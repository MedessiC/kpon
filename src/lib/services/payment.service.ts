import { apiClient } from "@/lib/api-client";
import { PaymentFormData } from "@/lib/schemas";

export interface PaymentResponse {
  transactionId: string;
  status: "pending" | "completed" | "failed";
  redirectUrl: string;
}

export interface PaymentStatus {
  transactionId: string;
  status: "pending" | "completed" | "failed";
  amount: number;
  projectId: string;
}

export const paymentService = {
  async initiatePayment(data: PaymentFormData): Promise<PaymentResponse> {
    return apiClient.post("/payments/initiate", data);
  },

  async getPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    return apiClient.get(`/payments/${transactionId}/status`);
  },

  async confirmPayment(transactionId: string, code: string): Promise<PaymentStatus> {
    return apiClient.post(`/payments/${transactionId}/confirm`, { code });
  },

  async getTransactionHistory(projectId?: string): Promise<Array<PaymentStatus>> {
    const url = projectId ? `/payments/history?projectId=${projectId}` : "/payments/history";
    return apiClient.get(url);
  },
};
