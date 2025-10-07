import fetch from 'node-fetch'

import { RequestBuilder } from '../client/request-builder'
import { API_URL } from '../constants'
import { encodeJson } from '../utils/json'

export class Authenticator {
	private accessToken?: string

	public constructor(
		private requestBuilder: RequestBuilder,
		private deviceId: string
	) {}

	public async createAccessToken(
		username: string,
		password: string
	): Promise<string> {
		const body = encodeJson({
			username,
			password,
			deviceInfo: {
				sourceDeviceId: this.deviceId,
				sourceType: 'WEB',
				appVersion: '1.0.0',
				metadata: {
					os: 'Windows 10',
					version: 'Chrome 118'
				}
			}
		})

		const headers = {
			'Content-Type': 'application/json',
			Accept: 'application/json, text/plain, */*',
			'User-Agent': 'okhttp/4.10.0',
			'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
			Referrer: 'https://lknpd.nalog.ru/auth/login'
		}

		const request = this.requestBuilder.create(
			'POST',
			`${API_URL}/auth/lkfl`,
			headers,
			body
		)

		const response = await fetch(`${API_URL}/auth/lkfl`, request)

		if (!response.ok) {
			const text = await response.text()

			throw new Error(
				`Failed to create access token: ${response.statusText} (${response.status})\n${text}`
			)
		}

		this.accessToken = await response.text()
		return this.accessToken
	}

	public async createPhoneChallenge(phone: string) {
		const body = encodeJson({ phone, requireTpToBeActive: true })

		const headers = {
			'Content-Type': 'application/json'
		}
		const request = this.requestBuilder.create(
			'POST',
			'https://lknpd.nalog.ru/api/v2/auth/challenge/sms/start',
			headers,
			body
		)

		const response = await fetch(
			'https://lknpd.nalog.ru/api/v2/auth/challenge/sms/start',
			request
		)

		if (!response.ok) {
			const text = await response.text()
			throw new Error(
				`Failed to create phone challenge: ${response.statusText} (${response.status})\n${text}`
			)
		}

		const data = await response.json()

		return data
	}

	public async createAccessTokenByPhone(
		phone: string,
		challengeToken: string,
		verificationCode: string
	): Promise<string> {
		const body = encodeJson({
			phone,
			code: verificationCode,
			challengeToken,
			deviceInfo: {
				sourceDeviceId: this.deviceId,
				sourceType: 'WEB',
				appVersion: '1.0.0',
				metadata: {
					os: 'Windows 10',
					version: 'Chrome 118'
				}
			}
		})

		const headers = { 'Content-Type': 'application/json' }
		const request = this.requestBuilder.create(
			'POST',
			`${API_URL}/auth/challenge/sms/verify`,
			headers,
			body
		)

		const response = await fetch(
			`${API_URL}/auth/challenge/sms/verify`,
			request
		)

		if (!response.ok) {
			const text = await response.text()
			throw new Error(
				`Failed to verify phone challenge: ${response.statusText} (${response.status})\n${text}`
			)
		}

		this.accessToken = await response.text()
		return this.accessToken
	}

	public async refreshAccessToken(
		refreshToken: string
	): Promise<string | null> {
		const body = encodeJson({
			deviceInfo: { sourceDeviceId: this.deviceId },
			refreshToken
		})

		const headers = { 'Content-Type': 'application/json' }
		const request = this.requestBuilder.create(
			'POST',
			`${API_URL}/auth/token`,
			headers,
			body
		)

		const response = await fetch(`${API_URL}/auth/token`, request)

		if (!response.ok) return null

		this.accessToken = await response.text()
		return this.accessToken
	}

	public setAccessToken(token: string) {
		this.accessToken = token
	}

	public getAccessToken(): string | undefined {
		return this.accessToken
	}
}
