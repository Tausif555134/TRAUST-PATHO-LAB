import { Payment, PaymentStatus } from '../../types';

export interface PaymentInitiateParams {
  bookingId: string;
  amount: number;
  patientName: string;
  patientEmail?: string;
  patientPhone: string;
  serviceName: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  signature?: string;
  error?: string;
}

export const paymentService = {
  /**
   * Initializes payment flow.
   * Can integrate with Razorpay / Stripe checkout modal.
   * Includes simulated server-side verification.
   */
  async processPayment(
    params: PaymentInitiateParams,
    method: 'upi' | 'card' | 'netbanking' | 'cash_on_visit' = 'upi',
    simulateFailure: boolean = false
  ): Promise<PaymentResult> {
    // Artificial latency for realism
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (simulateFailure) {
      return {
        success: false,
        error: 'Bank server declined the transaction. Please try another payment mode.',
      };
    }

    if (method === 'cash_on_visit') {
      return {
        success: true,
        paymentId: `cov_${Date.now()}`,
        orderId: `order_cov_${params.bookingId}`,
      };
    }

    // Simulated verified Razorpay transaction
    const simulatedPaymentId = `pay_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const simulatedOrderId = `order_${params.bookingId}_${Date.now()}`;
    const simulatedSignature = `sig_${Math.random().toString(36).substring(2, 14)}`;

    // Verify signature logic simulation (in production performed via secure Supabase Edge Function)
    const isValidSignature = this.verifyServerSideSignature(
      simulatedOrderId,
      simulatedPaymentId,
      simulatedSignature
    );

    if (!isValidSignature) {
      return {
        success: false,
        error: 'Security signature verification failed.',
      };
    }

    return {
      success: true,
      paymentId: simulatedPaymentId,
      orderId: simulatedOrderId,
      signature: simulatedSignature,
    };
  },

  /**
   * Cryptographic verification simulated for client/edge function parity
   */
  verifyServerSideSignature(orderId: string, paymentId: string, signature: string): boolean {
    return Boolean(orderId && paymentId && signature.startsWith('sig_'));
  },

  /**
   * Create Payment Record
   */
  buildPaymentRecord(
    bookingId: string,
    amount: number,
    method: Payment['method'],
    status: PaymentStatus,
    paymentId?: string
  ): Payment {
    return {
      id: paymentId || `pay-rec-${Date.now()}`,
      bookingId,
      amount,
      currency: 'INR',
      method,
      status,
      gatewayTransactionId: paymentId,
      createdAt: new Date().toISOString(),
    };
  },
};
