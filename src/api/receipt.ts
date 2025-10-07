import type { AxiosInstance } from 'axios'

import { API_URL } from '../constants'

import { createHttpClient } from './instance'

export class ReceiptApi {
	private readonly http: AxiosInstance

	public constructor(private accessToken: string) {
		this.http = createHttpClient(this.accessToken)
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
