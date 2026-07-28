export interface PaymentDetails {
  cardNumber?: string;
  cardExp?: string;
  cardCvc?: string;
  cardName?: string;
  upiId?: string;
  applePayToken?: string;
}

export interface PaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  method: 'credit_card' | 'apple_pay' | 'upi' | 'mock_stripe';
  details: PaymentDetails;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  message: string;
  provider: string;
  timestamp: string;
}

export interface PaymentProvider {
  name: string;
  processPayment(request: PaymentRequest): Promise<PaymentResponse>;
  refundPayment(transactionId: string, amount: number): Promise<{ success: boolean; message: string }>;
}

class MockPaymentProvider implements PaymentProvider {
  name = 'Mock E-Commerce Payment Gateway';

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Basic mock validation check
    if (request.method === 'credit_card' && request.details.cardNumber?.endsWith('0000')) {
      return {
        success: false,
        transactionId: `TXN-FAIL-${Date.now()}`,
        message: 'Card declined by issuing bank (Test Failure Code)',
        provider: this.name,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: true,
      transactionId: `TXN-OMNI-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      message: 'Payment authorized and captured successfully.',
      provider: this.name,
      timestamp: new Date().toISOString(),
    };
  }

  async refundPayment(transactionId: string, amount: number): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      success: true,
      message: `Refund of $${amount.toFixed(2)} processed for transaction ${transactionId}`,
    };
  }
}

// Pluggable Payment Service Architecture
class PaymentService {
  private activeProvider: PaymentProvider;

  constructor(provider?: PaymentProvider) {
    this.activeProvider = provider || new MockPaymentProvider();
  }

  public setProvider(provider: PaymentProvider) {
    this.activeProvider = provider;
  }

  public async executePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      return await this.activeProvider.processPayment(request);
    } catch (error: any) {
      return {
        success: false,
        transactionId: `TXN-ERR-${Date.now()}`,
        message: error.message || 'Payment service error',
        provider: this.activeProvider.name,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

export const paymentService = new PaymentService();
