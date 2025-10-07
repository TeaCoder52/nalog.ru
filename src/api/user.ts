import type { AxiosInstance } from 'axios'

import type { User } from '../interfaces'

import { createHttpClient } from './instance'

export class UserApi {
	private readonly http: AxiosInstance

	public constructor(private accessToken: string) {
		this.http = createHttpClient(this.accessToken)
	}

	public async getMe() {
		const response = await this.http.get<User>('/user')

		return response.data
	}
}
