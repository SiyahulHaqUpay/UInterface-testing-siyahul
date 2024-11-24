export interface CreateOrderData {
  products: Product[];
  order: Order;
  paymentGateway?: PaymentGateway;
  language: string;
  reference: Reference;
  customer: Customer;
  returnUrl: string;
  cancelUrl: string;
  notificationUrl: string;
  customerExtraData: string;
}

export interface Product {
  name: string;
  description: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  reference: string;
  description: string;
  currency: string;
  amount: number;
}

export interface PaymentGateway {
  src: string;
}

export interface Reference {
  id: string;
}

export interface Customer {
  uniqueId: string;
  name: string;
  email: string;
  mobile: string;
}

export interface ResponseData<Data> {
  status: boolean;
  message: string;
  data: Data;
}

export type CreateOrderResponse = ResponseData<CreatePaymentLinkData>;

export interface CreatePaymentLinkData {
  status: boolean;
  message: string;
  link: string;
}

export interface CreateCustomerTokenData extends CustomerUniqueToken {}

export type CreateCustomerTokenResponse = ResponseData<CreateCustomerTokenData>;

export interface CustomerUniqueToken {
  customerUniqueToken: number;
}

export interface AddCardData extends CustomerUniqueToken {
  returnUrl: string;
}

export interface CustomerCardsResult {
  customerCards: CustomerCard[];
}

export interface CustomerCard {
  brand: string;
  number: string;
  scheme: string;
  token: string;
}

export interface AddCardLink {
  link: string;
}

export type AddCardResponse = ResponseData<AddCardLink>;

export type RetrieveCardsResponse = ResponseData<CustomerCardsResult>;

export type CreateInvoiceData = Omit<CreateOrderData, "paymentGateway"> & {
    notificationType: "email" | "sms" | "link" | "all"
};

export interface InvoiceData {
  sms: boolean;
  email: boolean;
  link: boolean;
  url: string;
  invoice_id: string;
}

export type CreateInvoiceResponse = ResponseData<InvoiceData>;

export interface CreateSingleRefundData {
    orderId: string;
    totalPrice: number;
    customerFirstName?: string;
    customerEmail?: string;
    customerMobileNumber?: string;
    reference?: string;
    notifyUrl?: string;
};

export interface MultiRefundData {
    orderId: string
    refundPayload: MultiRefundPayload[]
    receiptId?: string
    customerFirstName?: string
    customerEmail?: string
    customerMobileNumber?: string
    reference?: string
    notifyUrl?: string
  }
  
  export interface MultiRefundPayload {
    refundRequestId: string
    ibanNumber: string
    totalPaid: string
    refundedAmount: number
    remainingLimit: number
    amountToRefund: number
    merchantType: string
  }
  
export interface SingleRefund {
    "orderId": string,
    "refundOrderId": string,
    "refundArn": string
}

export interface MultiRefundResponseData {
    responseData: MultiRefundResponse
  }
  
  export interface MultiRefundResponse {
    generated: Generated[]
    dataTempered: any[]
    refundIssue: any[]
    insufficientBalance: any[]
  }
  
  export interface Generated {
    generatedInvoiceId: string
    amount: number
    orderId: string
    refundOrderId: string
    refundArn: string
  }

export type CreateSingleRefundResponse = ResponseData<SingleRefund>;
export type GetMultiRefundResponse = ResponseData<MultiRefundResponseData>;

export interface ExtraMerchantData {
  amount: number;
  knetCharge: number;
  knetChargeType: "fixed" | "percentage";
  ccCharge: number;
  ccChargeType: "fixed" | "percentage";
  ibanNumber: string;
}

export interface MultiVendorOrderData extends CreateOrderData {
  extraMerchantData: ExtraMerchantData[];
}

export interface DepositStatusData {
  status: string;
  message: string;
  depositStatus: {
    orderId: string;
    trackId: string;
    transactionId: string;
    paymentId: string;
    amount: string;
    currency: string;
    status: string;
    error: string;
    depositDate: string;
    depositStatus: string;
    depositReference: string;
    depositTrackId: string;
    depositTransactionId: string;
  };
}

export type GetDepositStatusResponse = ResponseData<DepositStatusData>;

export interface EndpointConfig {
  label: string;
  defaultData: any;
  action: (data: any) => Promise<any>;
  description?: string;
}

export type Endpoints = {
  [key: string]: EndpointConfig;
};

export interface SingleRefundStatus {
  is_refunded: boolean;
  refunded_date: string | null;
}

export interface MultiRefundStatusItem {
  order_id: string;
  is_refunded: boolean;
  refunded_date: string | null;
}

export interface MultiRefundStatus {
  refund: MultiRefundStatusItem[];
}

export type SingleRefundStatusResponse = ResponseData<SingleRefundStatus>;
export type MultiRefundStatusResponse = ResponseData<MultiRefundStatus>;

export interface PaymentMethod {
  name: string;
  enabled: boolean;
  displayName: string;
  code?: string;
  type?: string;
}

export interface PaymentButtonStatus {
  status: boolean;
  message: string;
  paymentMethods: Record<string, PaymentMethod>;
  lastUpdated: string;
  nextUpdateAllowedAt: string;
}

export type PaymentButtonStatusResponse = ResponseData<PaymentButtonStatus>;