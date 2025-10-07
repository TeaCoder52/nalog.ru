export interface CancelIncomeRequest {
	receiptUuid: string
	comment: string
	operationTime?: string
	requestTime?: string
	partnerCode?: string
}
