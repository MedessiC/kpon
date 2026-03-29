import { useMutation, useQuery } from "@tanstack/react-query";
import { paymentService, PaymentResponse, PaymentStatus } from "@/lib/services/payment.service";
import { PaymentFormData } from "@/lib/schemas";
import { handleError } from "@/lib/error-handler";

export function useInitiatePayment() {
  return useMutation({
    mutationFn: async (data: PaymentFormData) => {
      try {
        return await paymentService.initiatePayment(data);
      } catch (error) {
        handleError(error, "initiatePayment");
        throw error;
      }
    },
  });
}

export function usePaymentStatus(transactionId: string) {
  return useQuery<PaymentStatus>({
    queryKey: ["payment", transactionId],
    queryFn: () => paymentService.getPaymentStatus(transactionId),
    enabled: !!transactionId,
    refetchInterval: 3000, // Poll every 3 seconds
  });
}

export function useConfirmPayment() {
  return useMutation({
    mutationFn: async (data: { transactionId: string; code: string }) => {
      try {
        return await paymentService.confirmPayment(data.transactionId, data.code);
      } catch (error) {
        handleError(error, "confirmPayment");
        throw error;
      }
    },
  });
}

export function useTransactionHistory(projectId?: string) {
  return useQuery<Array<PaymentStatus>>({
    queryKey: ["payments", "history", projectId],
    queryFn: () => paymentService.getTransactionHistory(projectId),
    staleTime: 1000 * 60 * 5,
  });
}
