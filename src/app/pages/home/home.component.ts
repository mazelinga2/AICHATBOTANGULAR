import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { VoiceService } from '../../services/voice.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div>

      <!-- Hero Section -->
      <section class="bg-primary bg-gradient text-white py-5 text-center">
        <div class="container">
          <h1 class="display-4 fw-bold mb-3">Welcome to EcoMart</h1>
          <p class="lead mb-4">
            Discover amazing products with AI-powered recommendations and voice navigation
          </p>
          <div class="d-flex justify-content-center gap-3 flex-wrap">
            <button 
              (click)="speakWelcome()"
              class="btn btn-light text-primary fw-semibold">
              🔊 Listen to Welcome
            </button>
            <a routerLink="/products" class="btn btn-warning fw-semibold">
              Shop Now
            </a>
          </div>
        </div>
      </section>

      <!-- Featured Categories -->
      <section class="py-5">
        <div class="container">
          <h2 class="text-center fw-bold mb-4">Shop by Category</h2>
          <div class="row g-4">
            <div *ngFor="let category of categories" class="col-6 col-md-3">
              <div 
                (click)="navigateToCategory(category.name)"
                class="card text-center h-100 shadow-sm category-card cursor-pointer">
                <div class="card-body">
                  <div class="mb-3 category-image-container">
                    <img [src]="category.icon" [alt]="category.name" class="category-image">
                  </div>
                  <h5 class="card-title">{{ category.name }}</h5>
                  <p class="text-muted small">{{ category.count }} items</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Products -->
      <section class="py-5 bg-light">
        <div class="container">
          <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <h2 class="fw-bold mb-0">Featured Products</h2>
            <button 
              (click)="speakFeaturedProducts()"
              class="btn btn-outline-primary btn-sm d-flex align-items-center gap-2">
              <span>🔊</span>
              <span>Listen to Products</span>
            </button>
          </div>
          
          <div class="row g-4">
            <div *ngFor="let product of featuredProducts" class="col-12 col-md-6 col-lg-3">
              <div class="card h-100 shadow-sm">
                <div class="position-relative">
                  <img [src]="product.images[0]" [alt]="product.name" class="card-img-top" style="height: 200px; object-fit: cover;">
                  <div class="position-absolute top-0 end-0 m-2">
                    <span class="badge bg-success">
                      ⭐ {{ product.rating }}
                    </span>
                  </div>
                </div>
                
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title">{{ product.name }}</h5>
                  <p class="card-text text-muted small mb-3 line-clamp-2">
                    {{ product.description }}
                  </p>
                  
                  <div class="mb-3">
                    <span class="fw-bold text-primary">\${{ product.price }}</span>
                    <span *ngIf="product.originalPrice" class="text-muted text-decoration-line-through small ms-2">
                      \${{ product.originalPrice }}
                    </span>
                  </div>
                  
                  <div class="d-flex gap-2 mb-3">
                    <button 
                      (click)="addToCart(product)"
                      class="btn btn-primary btn-sm flex-fill">
                      Add to Cart
                    </button>
                    <a [routerLink]="['/product', product.id]" class="btn btn-outline-secondary btn-sm flex-fill">
                      View Details
                    </a>
                  </div>
                  
               
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- AI Assistant CTA -->
      <section class="py-5 text-white" style="background: linear-gradient(to right, #6f42c1, #d63384);">
        <div class="container text-center">
          <h2 class="fw-bold mb-3">Meet Your AI Shopping Assistant</h2>
          <p class="lead mb-4">
            Get personalized recommendations, product comparisons, and shopping help with voice commands
          </p>
          <a routerLink="/assistant" class="btn btn-light text-primary fw-semibold">
            Try AI Assistant
          </a>
        </div>
      </section>

    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .cursor-pointer {
      cursor: pointer;
    }
    .category-card:hover {
      transform: translateY(-3px);
      transition: transform 0.2s ease;
    }
    .category-image-container {
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 15px;
    }
    .category-image {
      max-height: 100%;
      max-width: 100%;
      object-fit: contain;
      border-radius: 8px;
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  categories = [
    { 
      name: 'Moringa Olifera, Drumstick Leaf Powder', 
      icon: 'assets/ts (2).jpg', 
      count: 25
    },
    { 
      name: 'Wearables', 
      icon: 'assets/ts (1).jpg', 
      count: 18
    },
    { 
      name: 'Photography', 
      icon: 'assets/ts (3).jpg',
      count: 12
    },
    { 
      name: 'Gaming', 
      icon: 'assets/ts (4).jpg',
      count: 22
    },
    { 
      name: 'Audio', 
      icon: 'assets/ts (5).jpg',
      count: 15
    },
    { 
      name: 'Home', 
      icon: 'assets/ts (6).jpg',
      count: 30
    },
    { 
      name: 'Fashion', 
      icon: 'assets/ts.jpg',
      count: 45
    },
    { 
      name: 'Books', 
      icon: 'assets/ts (8).jpg',
      count: 28
    }
  ];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private voiceService: VoiceService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(products => {
      this.featuredProducts = products.slice(0, 4);
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.voiceService.speak(`Added ${product.name} to your cart`);
  }

  navigateToCategory(categoryName: string): void {
    this.voiceService.speak(`Browsing ${categoryName} category`);
  }

  async speakWelcome(): Promise<void> {
    await this.voiceService.speak(
      'Welcome to EcoMart! Your ultimate shopping destination with AI-powered recommendations and voice navigation. Discover amazing products and get personalized assistance for all your shopping needs.'
    );
  }

  async speakFeaturedProducts(): Promise<void> {
    let productList = 'Here are our featured products: ';
    this.featuredProducts.forEach((product, index) => {
      productList += `${index + 1}. ${product.name} for $${product.price}. `;
    });
    await this.voiceService.speak(productList);
  }
}