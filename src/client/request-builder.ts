import { HeadersInit, RequestInit } from 'node-fetch'

export class RequestBuilder {
	public create(
		method: string,
		url: string,
		headers: Record<string, string | string[]> = {},
		body?: string | Buffer
	): RequestInit & { headers: HeadersInit } {
		const init: RequestInit = { method }

		const requestHeaders: Record<string, string> = {}

		for (const [key, value] of Object.entries(headers)) {
			requestHeaders[key] = Array.isArray(value)
				? value.join(', ')
				: value
		}

		init.headers = requestHeaders

		if (body !== undefined) {
			init.body = body
		}

		return init as RequestInit & { headers: HeadersInit }
	}
}
