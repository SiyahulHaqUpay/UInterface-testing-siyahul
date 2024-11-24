import {
  AddCardData,
  AddCardResponse,
  CreateCustomerTokenData,
  CreateCustomerTokenResponse,
  CreateInvoiceData,
  CreateOrderData,
  CreateOrderResponse,
  CreateSingleRefundData,
  CreateSingleRefundResponse,
  CustomerUniqueToken,
  GetDepositStatusResponse,
  GetMultiRefundResponse,
  MultiRefundData,
  RetrieveCardsResponse,
  SingleRefundStatusResponse,
  MultiRefundStatusResponse,
  PaymentButtonStatusResponse,
} from "../types";
import { api } from "./axios";

export class UPayments {
  private static instance: UPayments;
  private endpoints = {
    createOrder: "/api/v1/charge",
    createCustomerToken: "/api/v1/create-customer-unique-token",
    addCard: "/api/v1/add-card",
    retrieveCards: "/api/v1/retrieve-customer-cards",
    getInvoicePaymentStatus: "/api/v1/get-payment-status",
    getPaymentStatus: "/api/v1/get-payment-status/:trackId",
    getPaymentButtonStatus: "/api/v1/payment-button/status",
    getDepositStatus: "/api/v1/get-deposit-status/:trackId",
    singleRefund: "/api/v1/refund/single",
    deleteSingleRefund: "/api/v1/delete-refund",
    getSingleRefundStatus: "/api/v1/refund/single/status/:orderId",
    getRefundStatus: "/api/v1/check-refund/:orderId",
    multiVendorRefund: "/api/v1/create-multivendor-refund",
    deleteMultiVendorRefund: "/api/v1/delete-multivendor-refund",
    multiRefund: "/api/v1/refund/multi",
    multiRefundStatus: "/api/v1/refund/multi/status/:orderId",
  };

  private constructor() {}

  public static getInstance(): UPayments {
    if (!UPayments.instance) {
      UPayments.instance = new UPayments();
    }
    return UPayments.instance;
  }

  async createOrder(data: CreateOrderData): Promise<CreateOrderResponse> {
    return (await api.post<CreateOrderResponse>(this.endpoints.createOrder, data)).data;
  }

  async createInvoice(data: CreateInvoiceData): Promise<CreateOrderResponse> {
    const _data = { ...data, paymentGateway: { src: "create-invoice" } };
    return (await api.post<CreateOrderResponse>(this.endpoints.createOrder, _data)).data;
  }

  async createCustomerToken(data: CreateCustomerTokenData): Promise<CreateCustomerTokenResponse> {
    return (await api.post<CreateCustomerTokenResponse>(this.endpoints.createCustomerToken, data)).data;
  }

  async saveCard(data: AddCardData): Promise<AddCardResponse> {
    return (await api.post<AddCardResponse>(this.endpoints.addCard, data)).data;
  }

  async retrieveCards(data: CustomerUniqueToken): Promise<RetrieveCardsResponse> {
    return (await api.post<RetrieveCardsResponse>(this.endpoints.retrieveCards, data)).data;
  }

  async getPaymentStatus(trackId: string) {
    const url = this.endpoints.getPaymentStatus.replace(":trackId", trackId);
    return (await api.get(url)).data;
  }

  async getInvoicePaymentStatus(trackId: string) {
    return (await api.get(`${this.endpoints.getInvoicePaymentStatus}/${trackId}`)).data;
  }

  async getPaymentButtonStatus() {
    return (await api.get<PaymentButtonStatusResponse>(this.endpoints.getPaymentButtonStatus)).data;
  }

  async getDepositStatus(trackId: string) {
    const url = this.endpoints.getDepositStatus.replace(":trackId", trackId);
    return (await api.get<GetDepositStatusResponse>(url)).data;
  }

  async createSingleRefund(data: CreateSingleRefundData) {
    return (await api.post<CreateSingleRefundResponse>(this.endpoints.singleRefund, data)).data;
  }

  async deleteSingleRefund(refundId: string) {
    return (await api.delete(`${this.endpoints.deleteSingleRefund}/${refundId}`)).data;
  }

  async getSingleRefundStatus(orderId: string) {
    const url = this.endpoints.getSingleRefundStatus.replace(":orderId", orderId);
    return (await api.get<SingleRefundStatusResponse>(url)).data;
  }

  async getMultiRefundStatus(orderId: string) {
    const url = this.endpoints.multiRefundStatus.replace(":orderId", orderId);
    return (await api.get<MultiRefundStatusResponse>(url)).data;
  }

  async getRefundStatus(orderId: string) {
    const url = this.endpoints.getRefundStatus.replace(":orderId", orderId);
    return (await api.get(url)).data;
  }

  async createMultiVendorRefund(data: MultiRefundData) {
    return (await api.post<GetMultiRefundResponse>(this.endpoints.multiVendorRefund, data)).data;
  }

  async deleteMultiVendorRefund(refundId: string) {
    return (await api.delete(`${this.endpoints.deleteMultiVendorRefund}/${refundId}`)).data;
  }
}

export const upayments = UPayments.getInstance();

// REMARKS:
// 1. We are using v2 api still we have confusion why v1 is in the urls
// 2. On https://developers.upayments.com/reference/create-invoice not mentioned how we can pass all notificationType
