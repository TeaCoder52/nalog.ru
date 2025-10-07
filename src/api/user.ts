import axios, { AxiosInstance } from 'axios'

import { API_URL } from '../constants'
import type { User } from '../interfaces'

export class UserApi {
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

	public async getMe() {
		const response = await this.http.get<User>('/user')

		return response.data
	}
}
