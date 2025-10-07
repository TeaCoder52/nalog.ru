import type { AxiosInstance } from 'axios'

import {
	CancelComment,
	type CancelIncomeRequest,
	type CreateIncomeRequest,
	CreateIncomeResponse,
	type IncomeClient,
	type IncomeServiceItem
} from '../interfaces'

import { createHttpClient } from './instance'

export class IncomeApi {
	private readonly http: AxiosInstance

	public constructor(
		private accessToken: string,
		private deviceId: string
	) {
		this.http = createHttpClient(this.accessToken)
	}

	public async create({
		name,
		amount,
		quantity,
		client
	}: {
		name: string
		amount: number
		quantity: number
		client?: IncomeClient
	}) {
		const serviceItem: IncomeServiceItem = {
			name,
			amount,
			quantity
		}

		const totalAmount = amount * quantity

		return this.createMultipleItems({
			services: [serviceItem],
			client,
			totalAmount,
			paymentType: 'CASH',
			ignoreMaxTotalIncomeRestriction: false
		})
	}

	public async createMultipleItems(payload: CreateIncomeRequest) {
		const { services, client, paymentType } = payload

		if (!services.length) throw new Error('Items cannot be empty')

		for (const [index, item] of services.entries()) {
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

		const totalAmount = services.reduce(
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
			const { data } = await this.http.post<CreateIncomeResponse>(
				'/income',
				{
					operationTime: new Date().toISOString(),
					requestTime: new Date().toISOString(),
					services,
					totalAmount,
					client: client ?? {},
					paymentType,
					ignoreMaxTotalIncomeRestriction: false,
					deviceId: this.deviceId
				}
			)

			return data
		} catch (error: any) {
			if (error.response)
				console.error('Ошибка создания дохода:', error.response.data)

			throw error
		}
	}

	public async cancel(data: CancelIncomeRequest) {
		if (!Object.values(CancelComment).includes(data.comment))
			throw new Error(
				`Комментарий указан неверно. Допустимые значения: ${Object.values(
					CancelComment
				).join(', ')}`
			)

		try {
			const response = await this.http.post('/cancel', {
				operationTime: new Date().toISOString(),
				requestTime: new Date().toISOString(),
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
