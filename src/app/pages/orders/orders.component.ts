import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, TitleCasePipe],
  template: `
    <div class="min-vh-100 bg-light">
      <div class="container py-5">
        
        <!-- Header -->
        <div class="mb-4">
          <h1 class="h2 fw-bold text-dark mb-2">Order History</h1>
          <p class="text-muted">Track and manage all your orders</p>
        </div>

        <!-- Orders List -->
        <div class="d-grid gap-4">
          <div *ngFor="let order of orders" class="card shadow-sm">
            
            <!-- Order Header -->
            <div class="card-header bg-light">
              <div class="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center">
                <div class="mb-2 mb-md-0">
                  <h3 class="h5 fw-semibold mb-1">Order {{ order.id }}</h3>
                  <p class="small text-muted mb-0">Placed on {{ order.date }}</p>
                </div>
                <div class="d-flex align-items-center gap-3">
                  <span [class]="getStatusClass(order.status)" 
                        class="badge rounded-pill px-3 py-1">
                    {{ order.status | titlecase }}
                  </span>
                  <span class="h5 fw-bold mb-0">\${{ order.total }}</span>
                </div>
              </div>
            </div>

            <!-- Order Items -->
            <div class="card-body">
              <div class="d-grid gap-3">
                <div *ngFor="let item of order.items" 
                     class="d-flex align-items-center gap-3">
                  <img [src]="item.image" [alt]="item.name" 
                       class="img-fluid rounded" style="width: 64px; height: 64px; object-fit: cover;">
                  <div class="flex-grow-1">
                    <h4 class="h6 fw-medium mb-0">{{ item.name }}</h4>
                    <p class="small text-muted mb-0">Qty: {{ item.quantity }}</p>
                  </div>
                  <div>
                    <span class="fw-semibold">\${{ item.price }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Order Actions -->
              <div class="mt-4 d-flex flex-column flex-sm-row gap-2 justify-content-sm-end">
                <button *ngIf="order.status === 'delivered'" 
                        class="btn btn-outline-secondary">
                  Leave Review
                </button>
                <button *ngIf="order.status === 'shipped'" 
                        class="btn btn-primary">
                  Track Package
                </button>
                <button class="btn btn-outline-secondary">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .min-vh-100 {
      min-height: 100vh;
    }
    .bg-light {
      background-color: #f8f9fa!important;
    }
  `]
})
export class OrdersComponent {
  orders = [
    {
      id: '#12345',
      date: 'January 15, 2024',
      status: 'delivered',
      total: 299.99,
      items: [
        {
          name: 'Premium Wireless Headphones',
          quantity: 1,
          price: 299.99,
          image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg'
        }
      ]
    },
    {
      id: '#12344',
      date: 'January 10, 2024',
      status: 'shipped',
      total: 199.99,
      items: [
        {
          name: 'Smart Fitness Tracker',
          quantity: 1,
          price: 199.99,
          image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg'
        }
      ]
    },
    {
      id: '#12343',
      date: 'December 28, 2023',
      status: 'processing',
      total: 89.99,
      items: [
        {
          name: 'Portable Bluetooth Speaker',
          quantity: 1,
          price: 89.99,
          image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg'
        }
      ]
    }
  ];

  getStatusClass(status: string): string {
    switch (status) {
      case 'delivered':
        return 'bg-success bg-opacity-10 text-success';
      case 'shipped':
        return 'bg-primary bg-opacity-10 text-primary';
      case 'processing':
        return 'bg-warning bg-opacity-10 text-warning';
      default:
        return 'bg-secondary bg-opacity-10 text-secondary';
    }
  }
}