import axios, { AxiosInstance } from 'axios'

import { API_URL } from '../constants'
import type { CreateReceiptRequest } from '../interfaces'

export class ReceiptApi {
	private http: AxiosInstance

	public constructor(
		private accessToken: string,
		private deviceId: string
	) {
		this.http = axios.create({
			baseURL: 'https://lknpd.nalog.ru/api/v1',
			headers: {
				Authorization: `Bearer ${this.accessToken}`,
				'Content-Type': 'application/json'
			}
		})
	}

	public async create(payload: CreateReceiptRequest) {
		try {
			const response = await this.http.post('/receipt', {
				...payload,
				deviceId: this.deviceId
			})

			return response
		} catch (error: any) {
			if (error.response) {
				console.error('Ошибка создания чека:', error.response.data)
			}

			throw error
		}
	}

	public async getOne(inn: string, id: string) {
		const response = await this.http.get(`/receipt/${inn}/${id}/json`)

		return response
	}

	public getPrintUrl({
		inn,
		receiptId
	}: {
		inn: string
		receiptId: string
	}): string {
		return `${API_URL}/receipt/${inn}/${receiptId}/print`
	}
}
