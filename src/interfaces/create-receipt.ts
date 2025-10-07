export interface ReceiptService {
	name: string
	amount: number
}

export interface ReceiptClient {
	contactPhone?: string
	displayName?: string
	email?: string
}

export interface CreateReceiptRequest {
	operationType: 'SALE' | 'BUY'
	client: ReceiptClient
	services: ReceiptService[]
	paymentType: 'CASH' | 'CASHLESS'
	totalAmount: number
	requestTime: string
}
