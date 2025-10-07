export enum CancelComment {
	MISTAKE = 'MISTAKE',
	RETURN = 'RETURN',
	SERVICE_ERROR = 'SERVICE_ERROR'
}

export interface CancelIncomeRequest {
	receiptUuid: string
	comment: CancelComment
	partnerCode?: string
}
