import { randomBytes } from 'crypto'

export class RandomIdStrategy {
	public constructor(private length: number) {}

	public getId(): string {
		return randomBytes(this.length).toString('base64').replace(/[+/=]/g, '')
	}
}

export class PlatformIdStrategy {
	public getId(): string {
		return `${process.platform}-${process.version}`
	}
}

export class DeviceIdGenerator {
	public constructor(
		private readonly strategy = new PlatformIdStrategy(),
		private readonly length = 21,
		private readonly lowercased = true
	) {}

	public generate(): string {
		let id = this.strategy.getId().substring(0, this.length)

		if (this.lowercased) id = id.toLowerCase()

		return id
	}
}
