import axios, { AxiosInstance } from 'axios'

import { API_URL } from '../constants'

export class ReceiptApi {
	private http: AxiosInstance

	public constructor(private accessToken: string) {
		this.http = axios.create({
			baseURL: API_URL,
			headers: {
				Authorization: `Bearer ${this.accessToken}`,
				'Content-Type': 'application/json'
			}
		})
	}

	public async getOne({
		inn,
		receiptId
	}: {
		inn: string
		receiptId: string
	}) {
		const response = await this.http.get(
			`/receipt/${inn}/${receiptId}/json`
		)

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
