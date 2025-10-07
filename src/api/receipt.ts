import axios, { AxiosInstance } from 'axios'

import type { CreateReceiptPayload } from '../interfaces'

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

	public async createReceipt(payload: CreateReceiptPayload) {
		try {
			const { data } = await this.http.post('/receipt', {
				...payload,
				deviceId: this.deviceId
			})

			return data
		} catch (error: any) {
			if (error.response) {
				console.error('Ошибка создания чека:', error.response.data)
			}

			throw error
		}
	}

	public async getReceipt(inn: string, receiptUuid: string) {
		const { data } = await this.http.get(
			`/receipt/${inn}/${receiptUuid}/json`
		)

		return data
	}

	public getReceiptPrintUrl(
		endpoint: string,
		inn: string,
		receiptId: string
	): string {
		return `${endpoint}/receipt/${inn}/${receiptId}/print`
	}
}
