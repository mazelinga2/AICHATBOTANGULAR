import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { VoiceService } from '../../services/voice.service';
import { GeminiService } from '../../services/gemini.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="product" class="min-vh-100 bg-light">
      <div class="container py-2">
        
        <!-- Breadcrumb -->
        <nav aria-label="breadcrumb" class="mt-3">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a routerLink="/" class="text-primary text-decoration-none">Home</a></li>
            <li class="breadcrumb-item"><a routerLink="/products" class="text-primary text-decoration-none">Products</a></li>
            <li class="breadcrumb-item active text-truncate" style="max-width: 200px;" aria-current="page">{{ product.name }}</li>
          </ol>
        </nav>

        <div class="row">
          
          <!-- Product Images -->
          <div class="col-lg-6 mt-2 mb-lg-0">
            <div class="position-relative">
              <img [src]="product.images[0]" [alt]="product.name" 
                   class="img-fluid rounded shadow-lg w-100" style="height: 400px; object-fit: cover;">
              
              <!-- Voice Control -->
              <button 
                (click)="speakProductDetails()"
                class="position-absolute top-0 end-0 bg-white bg-opacity-80 rounded-circle p-3 border-0 shadow-sm mt-3 me-3">
                <span class="fs-5">🔊</span>
              </button>
              
              <!-- Discount Badge -->
              <div *ngIf="product.originalPrice && product.originalPrice > product.price" 
                   class="position-absolute top-0 start-0 mt-3 ms-3">
                <span class="badge bg-danger text-white p-2 shadow">
                  {{ getDiscountPercentage() }}% OFF
                </span>
              </div>
            </div>
          </div>

          <!-- Product Info -->
          <div class="col-lg-6">
            <div class="mt-2">
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="text-primary small fw-medium">{{ product.category }}</span>
                <span class="text-muted small">•</span>
                <span class="text-muted small">{{ product.brand }}</span>
              </div>
              
              <h1 class="fw-bold mb-3">{{ product.name }}</h1>
              
              <!-- Rating -->
              <div class="d-flex align-items-center gap-2 mb-3">
                <div class="d-flex align-items-center">
                  <span class="text-warning me-1">⭐</span>
                  <span class="fw-medium">{{ product.rating }}</span>
                </div>
                <span class="text-muted">•</span>
                <span class="text-muted small">{{ product.reviewCount }} reviews</span>
              </div>

              <!-- Price -->
              <div class="d-flex align-items-center gap-3 mt-2">
                <span class="fs-3 fw-bold text-primary">\${{ product.price }}</span>
                <span *ngIf="product.originalPrice" 
                      class="fs-5 text-muted text-decoration-line-through">\${{ product.originalPrice }}</span>
                <span *ngIf="product.originalPrice && product.originalPrice > product.price" 
                      class="badge bg-danger bg-opacity-10 text-danger small">
                  Save \${{ (product.originalPrice - product.price).toFixed(2) }}
                </span>
              </div>

              <!-- Stock Status -->
              <div class="mt-2">
                <span [class]="product.inStock ? 'badge bg-success bg-opacity-10 text-success' : 'badge bg-danger bg-opacity-10 text-danger'" 
                      class="p-2">
                  <span class="me-1">{{ product.inStock ? '✓' : '✗' }}</span>
                  {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
                </span>
              </div>
            </div>

            <!-- Description -->
            <div class="mt-2">
              <h3 class="h5 fw-semibold mb-3">Description</h3>
              <p class="text-muted">{{ product.description }}</p>
            </div>

            <!-- Key Features -->
            <div class="mt-2">
              <h3 class="h5 fw-semibold mb-3">Key Features</h3>
              <ul class="list-unstyled">
                <li *ngFor="let feature of product.features" 
                    class="d-flex align-items-start mb-2">
                  <span class="text-success me-2">✓</span>
                  <span class="text-muted">{{ feature }}</span>
                </li>
              </ul>
            </div>

            <!-- Actions -->
            <div class="mt-3">
              <div class="d-flex flex-column flex-sm-row gap-3 mt-2">
                <button 
                  (click)="addToCart()"
                  [disabled]="!product.inStock"
                  class="btn btn-primary btn-lg flex-grow-1 py-3">
                  {{ product.inStock ? 'Add to Cart - $' + product.price : 'Out of Stock' }}
                </button>
                <button 
                  (click)="addToCart(); navigateToCheckout()"
                  [disabled]="!product.inStock"
                  class="btn btn-warning btn-lg flex-grow-1 py-3">
                  Buy Now
                </button>
              </div>

              <!-- External Purchase Links -->
             
            </div>
          </div>
        </div>

        <!-- Specifications -->
        <div class="mt-3 bg-white rounded shadow-sm p-5">
          <h2 class="fw-bold mt-2">Specifications</h2>
          <div class="row">
            <div *ngFor="let spec of getSpecifications()" 
                 class="col-md-6 d-flex justify-content-between py-3 border-bottom">
              <span class="fw-medium text-muted">{{ spec.key }}</span>
              <span class="text-end">{{ spec.value }}</span>
            </div>
          </div>
        </div>

        <!-- AI Recommendations -->
        <div class="mt-3 bg-white rounded shadow-sm p-5">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mt-2 gap-3">
            <h2 class="fw-bold mb-0">AI Recommendations</h2>
            <button 
              (click)="speakRecommendations()"
              class="btn btn-link text-primary text-decoration-none d-flex align-items-center gap-2 p-0">
              <span>🔊</span>
              <span>Listen to Recommendations</span>
            </button>
          </div>
          
          <div *ngIf="aiRecommendation" class="mt-2">
            <div class="alert alert-info">
              <h3 class="fw-semibold mb-2 d-flex align-items-center">
                <span class="me-2">🤖</span> AI Assistant Says:
              </h3>
              <p class="mb-0">{{ aiRecommendation }}</p>
            </div>
          </div>

          <div class="row g-4">
            <div *ngFor="let rec of recommendedProducts" 
                 class="col-sm-6 col-lg-3">
              <div class="card h-100 hover-shadow">
                <img [src]="rec.images[0]" [alt]="rec.name" 
                     class="card-img-top" style="height: 160px; object-fit: cover;">
                <div class="card-body">
                  <h4 class="card-title fw-medium small mb-2 line-clamp-2">{{ rec.name }}</h4>
                  <div class="d-flex align-items-center justify-content-between">
                    <span class="text-primary fw-semibold">\${{ rec.price }}</span>
                    <a (click)="onpageRe(rec.id)" 
                       class="btn btn-primary btn-sm">
                      View
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .hover-shadow:hover {
      box-shadow: 0 .5rem 1rem rgba(0,0,0,.15);
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  recommendedProducts: Product[] = [];
  aiRecommendation: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private voiceService: VoiceService,
    private geminiService: GeminiService,private router:Router
  ) {}

onpageRe(redID: any) {
 this.router.navigate(['/product', redID]).then(() => {
  window.location.reload();
});
}
    ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProduct(productId).subscribe(product => {
        this.product = product;
        if (product) {
          this.loadRecommendations();
          this.loadAIRecommendation();
        }
      });
    }
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product);
      this.voiceService.speak(`Added ${this.product.name} to your cart for $${this.product.price}`);
    }
  }

  navigateToCheckout(): void {
    // Navigate to checkout - implement routing
  }

  getDiscountPercentage(): number {
    if (this.product?.originalPrice && this.product.originalPrice > this.product.price) {
      return Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
    }
    return 0;
  }

  getSpecifications(): { key: string, value: string }[] {
    if (!this.product) return [];
    return Object.entries(this.product.specifications).map(([key, value]) => ({ key, value }));
  }

  async speakProductDetails(): Promise<void> {
    if (!this.product) return;
    
    const details = `${this.product.name} by ${this.product.brand}. 
      Priced at $${this.product.price}. 
      ${this.product.originalPrice ? `Original price was $${this.product.originalPrice}, saving you $${(this.product.originalPrice - this.product.price).toFixed(2)}.` : ''}
      Rating: ${this.product.rating} stars from ${this.product.reviewCount} reviews. 
      ${this.product.inStock ? 'Available in stock.' : 'Currently out of stock.'}
      Key features include: ${this.product.features.join(', ')}.`;
    
    await this.voiceService.speak(details);
  }

  async speakRecommendations(): Promise<void> {
    if (this.aiRecommendation) {
      await this.voiceService.speak(this.aiRecommendation);
    }
  }

  private loadRecommendations(): void {
    if (this.product) {
      this.productService.getRecommendedProducts(this.product.id).subscribe(products => {
        this.recommendedProducts = products;
      });
    }
  }

  private loadAIRecommendation(): void {
    if (this.product) {
      this.geminiService.generateProductRecommendations(
        `Interested in ${this.product.category} products, specifically ${this.product.name}`,
        this.product
      ).subscribe(recommendation => {
        this.aiRecommendation = recommendation;
      });
    }
  }
}