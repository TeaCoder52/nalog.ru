export interface User {
	id: number
	displayName: string
	email: string
	phone: string
	inn: string
	snils: string
	avatarExists: boolean
	initialRegistrationDate: string
	registrationDate: string
	firstReceiptRegisterTime: string | null
	firstReceiptCancelTime: string | null
	hideCancelledReceipt: boolean
	registerAvailable: boolean | null
	status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | string
	restrictedMode: boolean
	pfrUrl: string
	login: string
	lastName: string | null
	middleName: string | null
}
