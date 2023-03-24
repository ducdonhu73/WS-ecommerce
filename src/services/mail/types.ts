export interface ApproveDealerMailData {
  name: string;
  loginLink: string;
}

export interface RejectDealerMailData {
  name: string;
}

export interface WinningBidMailData {
  dealerName: string;
  sellerName: string;
  sellerPhone: string;
  invoiceNumber: string;
  invoiceDate: Date;
  invoiceDueDate: Date;
  platformFee: number;
}
