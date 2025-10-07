import axios, { AxiosInstance } from 'axios'

import { API_URL } from '../constants'
import type {
	CancelIncomeRequest,
	CreateIncomeRequest,
	IncomeClient,
	IncomeServiceItem
} from '../interfaces'

export class IncomeApi {
	private http: AxiosInstance

	public constructor(
		private accessToken: string,
		private deviceId: string
	) {
		this.http = axios.create({
			baseURL: API_URL,
			headers: {
				Authorization: `Bearer ${this.accessToken}`,
				'Content-Type': 'application/json'
			}
		})
	}

	/**
	 * Создание одного дохода (обёртка над createMultipleItems)
	 */
	public async create({
		name,
		amount,
		quantity,
		operationTime,
		client
	}: {
		name: string
		amount: number
		quantity: number
		operationTime?: string
		client?: IncomeClient
	}) {
		const serviceItem: IncomeServiceItem = {
			name,
			amount,
			quantity
		}

		return this.createMultipleItems({
			serviceItems: [serviceItem],
			operationTime,
			client
		})
	}

	public async createMultipleItems({
		serviceItems,
		operationTime,
		client
	}: {
		serviceItems: IncomeServiceItem[]
		operationTime?: string
		client?: IncomeClient
	}) {
		if (!serviceItems.length) throw new Error('Items cannot be empty')

		for (const [index, item] of serviceItems.entries()) {
			if (!item.name)
				throw new Error(
					`У услуги с индексом ${index} отсутствует название`
				)

			if (typeof item.amount !== 'number' || item.amount <= 0)
				throw new Error(
					`Неверная сумма в услуге ${index}: должна быть больше 0`
				)

			if (typeof item.quantity !== 'number' || item.quantity <= 0)
				throw new Error(
					`Неверное количество в услуге ${index}: должно быть больше 0`
				)
		}

		const totalAmount = serviceItems.reduce(
			(sum, item) => sum + item.amount * item.quantity,
			0
		)

		if (client && client.incomeType === 'LEGAL_ENTITY') {
			if (!client.inn)
				throw new Error('ИНН клиента обязателен для юридических лиц')

			if (!/^\d+$/.test(client.inn))
				throw new Error('ИНН клиента должен содержать только цифры')

			if (![10, 12].includes(client.inn.length))
				throw new Error('Длина ИНН должна быть 10 или 12 символов')

			if (!client.displayName)
				throw new Error('Отсутствует наименование клиента')
		}

		try {
			const { data } = await this.http.post('/income', {
				operationTime: operationTime || new Date().toISOString(),
				requestTime: new Date().toISOString(),
				services: serviceItems,
				totalAmount,
				client: client ?? {},
				paymentType: 'CASH',
				ignoreMaxTotalIncomeRestriction: false,
				deviceId: this.deviceId
			})

			return data
		} catch (error: any) {
			if (error.response)
				console.error('Ошибка создания дохода:', error.response.data)

			throw error
		}
	}

	public async cancel(data: CancelIncomeRequest) {
		const validComments = ['MISTAKE', 'RETURN', 'SERVICE_ERROR']

		if (!validComments.includes(data.comment))
			throw new Error(
				`Комментарий указан неверно. Допустимые значения: ${validComments.join(
					', '
				)}`
			)

		try {
			const response = await this.http.post('/cancel', {
				operationTime: data.operationTime || new Date().toISOString(),
				requestTime: data.requestTime || new Date().toISOString(),
				deviceId: this.deviceId,
				...data
			})

			return response.data
		} catch (error: any) {
			if (error.response)
				console.error('Ошибка отмены дохода:', error.response.data)

			throw error
		}
	}
}
