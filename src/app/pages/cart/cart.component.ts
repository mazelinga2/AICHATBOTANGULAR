import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { VoiceService } from '../../services/voice.service';
import { CartItem } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-light min-vh-100">
      <div class="container py-5">
        
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="h2 fw-bold">Shopping Cart</h1>
          <button 
            (click)="speakCartSummary()"
            class="btn btn-link text-primary text-decoration-none d-flex align-items-center">
            <span class="me-2">🔊</span>
            <span>Listen to Cart Summary</span>
          </button>
        </div>

        <div *ngIf="cartItems.length === 0" class="text-center py-5">
          <div class="display-1 mb-4">🛒</div>
          <h2 class="h3 mb-3">Your cart is empty</h2>
          <p class="text-muted mb-4">Add some products to get started!</p>
          <a routerLink="/products" class="btn btn-primary btn-lg px-4">
            Continue Shopping
          </a>
        </div>

        <div *ngIf="cartItems.length > 0" class="row">
          
          <!-- Cart Items -->
          <div class="col-lg-8 mb-4 mb-lg-0">
            <div class="card">
              <div class="card-body">
                <div *ngFor="let item of cartItems" class="mb-4 pb-4 border-bottom">
                  <div class="d-flex">
                    <!-- Product Image -->
                    <div class="flex-shrink-0 me-4">
                      <img [src]="item.product.images[0]" [alt]="item.product.name" 
                           class="img-fluid rounded" style="width: 100px; height: 100px; object-fit: cover;">
                    </div>
                    
                    <!-- Product Info -->
                    <div class="flex-grow-1">
                      <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h3 class="h5 mb-1">{{ item.product.name }}</h3>
                          <p class="text-muted small mb-0">{{ item.product.category }} • {{ item.product.brand }}</p>
                        </div>
                        <button 
                          (click)="speakItemDetails(item)"
                          class="btn btn-sm btn-link text-primary p-0">
                          🔊
                        </button>
                      </div>
                      
                      <div class="d-flex justify-content-between align-items-center">
                        <div>
                          <span class="h5 text-primary">\${{ item.product.price }}</span>
                          <span *ngIf="item.product.originalPrice" 
                                class="text-muted small ms-2 text-decoration-line-through">
                            \${{ item.product.originalPrice }}
                          </span>
                        </div>
                        
                        <!-- Quantity Controls -->
                        <div class="d-flex align-items-center">
                          <button 
                            (click)="updateQuantity(item.product.id, item.quantity - 1)"
                            class="btn btn-outline-secondary btn-sm rounded-circle"
                            style="width: 32px; height: 32px;">
                            -
                          </button>
                          <span class="mx-2" style="width: 32px; text-align: center;">{{ item.quantity }}</span>
                          <button 
                            (click)="updateQuantity(item.product.id, item.quantity + 1)"
                            class="btn btn-outline-secondary btn-sm rounded-circle"
                            style="width: 32px; height: 32px;">
                            +
                          </button>
                        </div>
                      </div>
                      
                      <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="text-muted small">
                          Subtotal: \${{ (item.product.price * item.quantity).toFixed(2) }}
                        </span>
                        <button 
                          (click)="removeFromCart(item.product.id)"
                          class="btn btn-link text-danger p-0 small">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="col-lg-4">
            <div class="card sticky-top" style="top: 20px;">
              <div class="card-body">
                <h2 class="h5 mb-3">Order Summary</h2>
                
                <ul class="list-group list-group-flush mb-3">
                  <li class="list-group-item d-flex justify-content-between bg-transparent px-0 py-2">
                    <span class="text-muted">Items ({{ getTotalItems() }})</span>
                    <span class="fw-medium">\${{ getSubtotal().toFixed(2) }}</span>
                  </li>
                  
                  <li class="list-group-item d-flex justify-content-between bg-transparent px-0 py-2">
                    <span class="text-muted">Shipping</span>
                    <span class="text-success fw-medium">Free</span>
                  </li>
                  
                  <li class="list-group-item d-flex justify-content-between bg-transparent px-0 py-2">
                    <span class="text-muted">Tax</span>
                    <span class="fw-medium">\${{ getTax().toFixed(2) }}</span>
                  </li>
                  
                  <li class="list-group-item d-flex justify-content-between bg-transparent px-0 pt-3 pb-0">
                    <span class="h6 fw-semibold">Total</span>
                    <span class="h5 fw-bold text-primary">\${{ getTotal().toFixed(2) }}</span>
                  </li>
                </ul>
                
                <div class="d-grid gap-2">
                  <a routerLink="/checkout" class="btn btn-primary btn-lg">
                    Proceed to Checkout
                  </a>
                  
                  <a routerLink="/products" class="btn btn-outline-secondary">
                    Continue Shopping
                  </a>
                  
                  <button 
                    (click)="clearCart()"
                    class="btn btn-link text-danger p-0 small">
                    Clear Cart
                  </button>
                </div>
                
                <!-- Security Badge -->
                <div class="mt-4 p-3 bg-success bg-opacity-10 rounded">
                  <div class="d-flex align-items-center">
                    <span class="text-success me-2">🔒</span>
                    <span class="small text-success fw-medium">Secure Checkout</span>
                  </div>
                  <p class="small text-success mt-1 mb-0">
                    Your payment information is encrypted and secure
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private voiceService: VoiceService
  ) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeFromCart(productId: string): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item) {
      this.cartService.removeFromCart(productId);
      this.voiceService.speak(`Removed ${item.product.name} from your cart`);
    }
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.voiceService.speak('Cart cleared');
  }

  getTotalItems(): number {
    return this.cartService.getCartItemCount();
  }

  getSubtotal(): number {
    return this.cartService.getCartTotal();
  }

  getTax(): number {
    return this.getSubtotal() * 0.08; // 8% tax
  }

  getTotal(): number {
    return this.getSubtotal() + this.getTax();
  }

  async speakCartSummary(): Promise<void> {
    const itemCount = this.getTotalItems();
    const total = this.getTotal();
    await this.voiceService.speak(`Your cart contains ${itemCount} items with a total of $${total.toFixed(2)} including tax.`);
  }

  async speakItemDetails(item: CartItem): Promise<void> {
    await this.voiceService.speak(`${item.product.name}, quantity ${item.quantity}, $${item.product.price} each, subtotal $${(item.product.price * item.quantity).toFixed(2)}`);
  }
}