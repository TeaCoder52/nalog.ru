export interface IncomeServiceItem {
	name: string
	amount: number
	quantity: number
}

export interface IncomeClient {
	contactPhone?: string
	displayName?: string
	inn?: string
	incomeType?: 'FROM_INDIVIDUAL' | 'LEGAL_ENTITY' | string
}

export interface CreateIncomeRequest {
	services: IncomeServiceItem[]
	totalAmount: number
	client?: IncomeClient
	paymentType: 'CASH' | 'ELECTRONIC'
	ignoreMaxTotalIncomeRestriction: boolean
	deviceId?: string
}

export interface CreateIncomeResponse {
	approvedReceiptUuid: string
}
