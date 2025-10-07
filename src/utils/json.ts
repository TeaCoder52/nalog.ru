export function encodeJson(data: unknown): string {
	try {
		return JSON.stringify(data)
	} catch (error) {
		throw new Error(`JSON encode error: ${(error as Error).message}`)
	}
}

export function decodeJson<T = any>(json: string): T {
	try {
		return JSON.parse(json) as T
	} catch (error) {
		throw new Error(`JSON decode error: ${(error as Error).message}`)
	}
}
