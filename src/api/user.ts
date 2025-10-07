import axios, { AxiosInstance } from 'axios'

import type { User } from '../interfaces'

export class UserApi {
	private http: AxiosInstance

	public constructor(private accessToken: string) {
		this.http = axios.create({
			baseURL: 'https://lknpd.nalog.ru/api/v1',
			headers: {
				Authorization: `Bearer ${this.accessToken}`,
				'Content-Type': 'application/json'
			}
		})
	}

	public async getMe() {
		const response = await this.http.get<User>('/user')

		return response.data
	}
}
