import { IncomeApi, ReceiptApi, UserApi } from './api'
import { Authenticator } from './auth/authenticator'
import { RequestBuilder } from './client/request-builder'
import { DeviceIdGenerator } from './utils/device-id'

export class ApiClient {
	private requestBuilder: RequestBuilder
	private authenticator: Authenticator

	private readonly deviceId: string

	private receiptApi?: ReceiptApi
	private incomeApi?: IncomeApi
	private userApi?: UserApi

	public constructor(private token?: string) {
		this.requestBuilder = new RequestBuilder()
		this.deviceId = new DeviceIdGenerator().generate()

		this.authenticator = new Authenticator(
			this.requestBuilder,
			new DeviceIdGenerator().generate()
		)
	}

	public async createAccessToken(
		username: string,
		password: string
	): Promise<string> {
		return this.authenticator.createAccessToken(username, password)
	}

	public async createPhoneChallenge(phone: string) {
		return this.authenticator.createPhoneChallenge(phone)
	}

	public async createAccessTokenByPhone(
		phone: string,
		challengeToken: string,
		verificationCode: string
	) {
		return this.authenticator.createAccessTokenByPhone(
			phone,
			challengeToken,
			verificationCode
		)
	}

	public async refreshAccessToken(refreshToken: string) {
		return this.authenticator.refreshAccessToken(refreshToken)
	}

	public get receipt(): ReceiptApi {
		if (!this.receiptApi) {
			const token = this.getAccessToken()

			if (!token)
				throw new Error('Access token is not set. Please login first.')

			this.receiptApi = new ReceiptApi(token)
		}

		return this.receiptApi
	}

	public get income(): IncomeApi {
		if (!this.incomeApi) {
			const token = this.getAccessToken()

			if (!token)
				throw new Error('Access token is not set. Please login first.')

			this.incomeApi = new IncomeApi(token, this.deviceId)
		}

		return this.incomeApi
	}

	public get user(): UserApi {
		if (!this.userApi) {
			const token = this.getAccessToken()

			if (!token)
				throw new Error('Access token is not set. Please login first.')

			this.userApi = new UserApi(token)
		}

		return this.userApi
	}

	public setToken(token: string) {
		this.token = token
		this.authenticator.setAccessToken(token)
	}

	public getAccessToken(): string {
		return this.token ?? this.authenticator.getAccessToken()
	}
}
