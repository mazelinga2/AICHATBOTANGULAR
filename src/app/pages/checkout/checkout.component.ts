import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { PaymentService } from '../../services/payment.service';
import { VoiceService } from '../../services/voice.service';
import { CartItem, Address } from '../../models/product.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="checkout-container">
      <div class="checkout-content">
        
        <!-- Header -->
        <div class="checkout-header">
          <h1>Checkout</h1>
          <button 
            (click)="speakCheckoutInfo()"
            class="voice-button">
            <span class="voice-icon">🔊</span>
            <span>Listen to Order Info</span>
          </button>
        </div>

        <div class="checkout-grid">
          
          <!-- Checkout Form -->
          <div class="checkout-form-section">
            
            <!-- Shipping Information -->
            <div class="form-card">
              <h2>Shipping Information</h2>
              <form class="shipping-form">
                <div class="form-row">
                  <div class="form-group">
                    <label>First Name</label>
                    <input type="text" [(ngModel)]="firstName" name="firstName">
                  </div>
                  <div class="form-group">
                    <label>Last Name</label>
                    <input type="text" [(ngModel)]="lastName" name="lastName">
                  </div>
                </div>
                
                <div class="form-group">
                  <label>Email</label>
                  <input type="email" [(ngModel)]="email" name="email">
                </div>
                
                <div class="form-group">
                  <label>Street Address</label>
                  <input type="text" [(ngModel)]="shippingAddress.street" name="street">
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label>City</label>
                    <input type="text" [(ngModel)]="shippingAddress.city" name="city">
                  </div>
                  <div class="form-group">
                    <label>State</label>
                    <input type="text" [(ngModel)]="shippingAddress.state" name="state">
                  </div>
                  <div class="form-group">
                    <label>ZIP Code</label>
                    <input type="text" [(ngModel)]="shippingAddress.zipCode" name="zipCode">
                  </div>
                </div>
              </form>
            </div>

            <!-- Payment Information -->
            <div class="form-card">
              <h2>Payment Information</h2>
              
              <div class="payment-form">
                <div class="form-group">
                  <label>Card Number</label>
                  <input type="text" [(ngModel)]="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456">
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label>Expiry Date</label>
                    <input type="text" [(ngModel)]="expiryDate" name="expiryDate" placeholder="MM/YY">
                  </div>
                  <div class="form-group">
                    <label>CVV</label>
                    <input type="text" [(ngModel)]="cvv" name="cvv" placeholder="123">
                  </div>
                </div>
                
                <div class="form-group">
                  <label>Cardholder Name</label>
                  <input type="text" [(ngModel)]="cardholderName" name="cardholderName">
                </div>
              </div>
              
              <!-- Security Notice -->
              <div class="security-notice">
                <div class="security-header">
                  <span class="security-icon">🔒</span>
                  <span>Secure Payment</span>
                </div>
                <p>
                  Your payment information is encrypted and processed securely
                </p>
              </div>
            </div>

            <!-- Order Actions -->
            <div class="order-actions">
              <button 
                (click)="processPayment()"
                [disabled]="isProcessing || !isFormValid()"
                class="checkout-button">
                <span *ngIf="!isProcessing">Complete Order - \${{ getTotal().toFixed(2) }}</span>
                <span *ngIf="isProcessing" class="processing-indicator">
                  <span class="spinner">⏳</span>
                  Processing Payment...
                </span>
              </button>
              
              <a routerLink="/cart" class="back-button">
                ← Back to Cart
              </a>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="order-summary-section">
            <!-- Order Items -->
            <div class="summary-card">
              <h2>Order Summary</h2>
              
              <div class="order-items">
                <div *ngFor="let item of cartItems" class="order-item">
                  <img [src]="item.product.images[0]" [alt]="item.product.name" class="item-image">
                  <div class="item-details">
                    <h4>{{ item.product.name }}</h4>
                    <p>Qty: {{ item.quantity }}</p>
                  </div>
                  <div class="item-price">
                    \${{ (item.product.price * item.quantity).toFixed(2) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Price Breakdown -->
            <div class="summary-card">
              <h3>Price Breakdown</h3>
              
              <div class="price-details">
                <div class="price-row">
                  <span>Subtotal ({{ getTotalItems() }} items)</span>
                  <span>\${{ getSubtotal().toFixed(2) }}</span>
                </div>
                
                <div class="price-row">
                  <span>Shipping</span>
                  <span class="free-shipping">Free</span>
                </div>
                
                <div class="price-row">
                  <span>Tax</span>
                  <span>\${{ getTax().toFixed(2) }}</span>
                </div>
                
                <div class="divider"></div>
                
                <div class="total-row">
                  <span>Total</span>
                  <span class="total-amount">\${{ getTotal().toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <!-- Delivery Info -->
            <div class="summary-card">
              <h3>Delivery Information</h3>
              <div class="delivery-info">
                <div class="delivery-item">
                  <span class="delivery-icon">🚚</span>
                  <span>Free standard delivery</span>
                </div>
                <div class="delivery-item">
                  <span class="delivery-icon">📅</span>
                  <span>Estimated delivery: 3-5 business days</span>
                </div>
                <div class="delivery-item">
                  <span class="delivery-icon">📦</span>
                  <span>Package tracking included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Base styles */
    .checkout-container {
      min-height: 100vh;
      background-color: #f8fafc;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #1e293b;
    }
    
    .checkout-content {
      max-width: 90rem;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
    
    /* Header styles */
    .checkout-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    .checkout-header h1 {
      font-size: 2rem;
      font-weight: 700;
    }
    
    .voice-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: none;
      border: none;
      color: #2563eb;
      font-weight: 500;
      cursor: pointer;
      transition: color 0.2s;
    }
    
    .voice-button:hover {
      color: #1d4ed8;
    }
    
    .voice-icon {
      font-size: 1.25rem;
    }
    
    /* Grid layout */
    .checkout-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    
    @media (min-width: 1024px) {
      .checkout-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
    
    /* Form cards */
    .form-card {
      background-color: white;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
    
    .form-card h2 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1.25rem;
    }
    
    /* Form elements */
    .form-group {
      margin-bottom: 1rem;
    }
    
    .form-group label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: #334155;
    }
    
    .form-group input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #cbd5e1;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      transition: all 0.2s;
    }
    
    .form-group input:focus {
      outline: none;
      border-color: #93c5fd;
      box-shadow: 0 0 0 3px rgba(147, 197, 253, 0.3);
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    @media (min-width: 768px) {
      .form-row {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .form-row-3 {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    
    /* Security notice */
    .security-notice {
      margin-top: 1.5rem;
      padding: 0.75rem;
      background-color: #eff6ff;
      border-radius: 0.5rem;
    }
    
    .security-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      color: #1e40af;
    }
    
    .security-icon {
      font-size: 1rem;
    }
    
    .security-notice p {
      font-size: 0.75rem;
      color: #1e40af;
      margin-top: 0.25rem;
    }
    
    /* Order actions */
    .order-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .checkout-button {
      width: 100%;
      padding: 1rem;
      background-color: #16a34a;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .checkout-button:hover:not(:disabled) {
      background-color: #15803d;
    }
    
    .checkout-button:disabled {
      background-color: #cbd5e1;
      cursor: not-allowed;
    }
    
    .processing-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    
    .spinner {
      animation: spin 1s linear infinite;
    }
    
    .back-button {
      display: block;
      width: 100%;
      padding: 0.75rem;
      background-color: #e2e8f0;
      color: #1e293b;
      text-align: center;
      border-radius: 0.5rem;
      font-weight: 600;
      text-decoration: none;
      transition: background-color 0.2s;
    }
    
    .back-button:hover {
      background-color: #cbd5e1;
    }
    
    /* Order summary */
    .summary-card {
      background-color: white;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
    
    .summary-card h2, .summary-card h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1.25rem;
    }
    
    /* Order items */
    .order-items {
      display: flex;
      flex-direction: column;
    }
    
    .order-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f1f5f9;
    }
    
    .order-item:last-child {
      border-bottom: none;
    }
    
    .item-image {
      width: 3rem;
      height: 3rem;
      object-fit: cover;
      border-radius: 0.5rem;
    }
    
    .item-details {
      flex: 1;
      min-width: 0;
    }
    
    .item-details h4 {
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.25rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .item-details p {
      font-size: 0.75rem;
      color: #64748b;
    }
    
    .item-price {
      font-weight: 500;
    }
    
    /* Price breakdown */
    .price-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .price-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
    }
    
    .free-shipping {
      color: #16a34a;
      font-weight: 500;
    }
    
    .divider {
      height: 1px;
      background-color: #e2e8f0;
      margin: 0.75rem 0;
    }
    
    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1rem;
    }
    
    .total-amount {
      font-size: 1.5rem;
      font-weight: 700;
      color: #16a34a;
    }
    
    /* Delivery info */
    .delivery-info {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .delivery-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.875rem;
    }
    
    .delivery-icon {
      font-size: 1rem;
    }
    
    /* Animations */
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  isProcessing = false;
  
  // Form fields
  firstName = '';
  lastName = '';
  email = '';
  cardNumber = '';
  expiryDate = '';
  cvv = '';
  cardholderName = '';
  
  shippingAddress: Address = {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  };

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private voiceService: VoiceService
  ) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });
  }

  isFormValid(): boolean {
    return !!(
      this.firstName &&
      this.lastName &&
      this.email &&
      this.shippingAddress.street &&
      this.shippingAddress.city &&
      this.shippingAddress.state &&
      this.shippingAddress.zipCode &&
      this.cardNumber &&
      this.expiryDate &&
      this.cvv &&
      this.cardholderName
    );
  }

  async processPayment(): Promise<void> {
    if (!this.isFormValid()) {
      await this.voiceService.speak('Please fill in all required fields to complete your order.');
      return;
    }

    this.isProcessing = true;
    
    try {
      await this.voiceService.speak('Processing your payment. Please wait.');
      
      const success = await this.paymentService.processPayment(this.getTotal());
      
      if (success) {
        await this.voiceService.speak('Payment successful! Your order has been placed.');
        this.cartService.clearCart();
        // Navigate to success page
      } else {
        await this.voiceService.speak('Payment failed. Please check your payment information and try again.');
      }
    } catch (error) {
      await this.voiceService.speak('An error occurred during payment processing. Please try again.');
    } finally {
      this.isProcessing = false;
    }
  }

  getTotalItems(): number {
    return this.cartService.getCartItemCount();
  }

  getSubtotal(): number {
    return this.cartService.getCartTotal();
  }

  getTax(): number {
    return this.getSubtotal() * 0.08;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getTax();
  }

  async speakCheckoutInfo(): Promise<void> {
    const total = this.getTotal();
    const itemCount = this.getTotalItems();
    await this.voiceService.speak(`Your order contains ${itemCount} items with a total of $${total.toFixed(2)} including tax and free shipping.`);
  }
}