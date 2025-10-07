import { ReceiptApi } from './api'
import { Authenticator } from './auth/authenticator'
import { RequestBuilder } from './client/request-builder'
import { DeviceIdGenerator } from './utils/device-id'

export class ApiClient {
	private requestBuilder: RequestBuilder
	private authenticator: Authenticator

	private readonly deviceId: string

	private receiptApi?: ReceiptApi

	public constructor(private deviceIdGenerator = new DeviceIdGenerator()) {
		this.requestBuilder = new RequestBuilder()
		this.deviceId = new DeviceIdGenerator().generate()
		this.authenticator = new Authenticator(
			this.requestBuilder,
			this.deviceIdGenerator.generate()
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
	): Promise<string> {
		return this.authenticator.createAccessTokenByPhone(
			phone,
			challengeToken,
			verificationCode
		)
	}

	public async refreshAccessToken(refreshToken: string) {
		return this.authenticator.refreshAccessToken(refreshToken)
	}

	public getAccessToken(): string | undefined {
		return this.authenticator.getAccessToken()
	}

	public get receipt(): ReceiptApi {
		if (!this.receiptApi) {
			const token = this.getAccessToken()

			if (!token)
				throw new Error('Access token is not set. Please login first.')

			this.receiptApi = new ReceiptApi(token, this.deviceId)
		}

		return this.receiptApi
	}
}
