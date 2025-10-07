interface ReceiptService {
	name: string
	quantity: number
	serviceNumber: number
	amount: number
}

interface ReceiptCancellationInfo {
	cancelledAt: string
	reason?: string
	cancelledBy?: string
}

export interface Receipt {
	receiptId: string
	services: ReceiptService[]
	operationTime: string
	requestTime: string
	registerTime: string
	taxPeriodId: number
	paymentType: 'CASH' | 'CASHLESS' | string
	incomeType: 'FROM_INDIVIDUAL' | 'FROM_ENTITY' | 'FROM_FOREIGN' | string
	totalAmount: number
	cancellationInfo: ReceiptCancellationInfo | null
	sourceDeviceId: string | null
	clientInn: string | null
	clientDisplayName: string | null
	partnerDisplayName: string | null
	partnerInn: string | null
	inn: string
	profession: string
	description: string[]
	email: string | null
	phone: string | null
	invoiceId: string | null
}
