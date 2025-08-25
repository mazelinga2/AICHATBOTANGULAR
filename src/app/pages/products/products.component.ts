import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { VoiceService } from '../../services/voice.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-vh-100 bg-light">
      <div class="container py-2">
        <!-- Page Header -->
        <div class="mb-2">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <h1 class="h2 fw-bold text-dark">All Products</h1>
            <button 
              (click)="speakProductCount()"
              class="btn btn-link text-primary d-flex align-items-center gap-2">
              <i class="bi bi-megaphone"></i>
              <span>Listen to Product Info</span>
            </button>
          </div>
          <p class="text-muted">Discover our complete collection of premium products</p>
        </div>

        <div class="row">
          <!-- Left Side Filters -->
          <div class="col-md-3 mb-2">
            <div class="card shadow-sm sticky-top" style="top: 20px;">
              <div class="card-body">
                <h5 class="card-title mb-2">Filters</h5>
                
                <!-- Categories -->
                <div class="mb-2">
                  <h6 class="fw-bold small mb-1">Categories</h6>
                  <div class="form-check mb-2" *ngFor="let category of categories">
                    <input class="form-check-input" type="checkbox" 
                           [id]="'cat-'+category" 
                           [(ngModel)]="selectedCategories[category]"
                           (ngModelChange)="applyFilters()">
                    <label class="form-check-label small" [for]="'cat-'+category">
                      {{ category }}
                    </label>
                  </div>
                </div>

                <!-- Delivery Day -->
                <div class="mb-2">
                  <h6 class="fw-bold small mb-1">Delivery Day</h6>
                  <div class="form-check mb-2">
                    <input class="form-check-input" type="checkbox" id="delivery-1" 
                           [(ngModel)]="fastDelivery" (ngModelChange)="applyFilters()">
                    <label class="form-check-label small" for="delivery-1">
                      Get It by Tomorrow
                    </label>
                  </div>
                  <div class="form-check mb-2">
                    <input class="form-check-input" type="checkbox" id="delivery-2" 
                           [(ngModel)]="standardDelivery" (ngModelChange)="applyFilters()">
                    <label class="form-check-label small" for="delivery-2">
                      Get It in 2-3 Days
                    </label>
                  </div>
                </div>

                <!-- Price Range -->
                <div class="mb-2">
                  <h6 class="fw-bold small mb-1">Price Range</h6>
                  <div class="form-check mb-2">
                    <input class="form-check-input" type="radio" name="priceRange" id="price-0" 
                           [(ngModel)]="selectedPriceRange" (ngModelChange)="applyFilters()" value="">
                    <label class="form-check-label small" for="price-0">
                      All Prices
                    </label>
                  </div>
                  <div class="form-check mb-2">
                    <input class="form-check-input" type="radio" name="priceRange" id="price-1" 
                           [(ngModel)]="selectedPriceRange" (ngModelChange)="applyFilters()" value="0-100">
                    <label class="form-check-label small" for="price-1">
                      $0 - $100
                    </label>
                  </div>
                  <div class="form-check mb-2">
                    <input class="form-check-input" type="radio" name="priceRange" id="price-2" 
                           [(ngModel)]="selectedPriceRange" (ngModelChange)="applyFilters()" value="100-300">
                    <label class="form-check-label small" for="price-2">
                      $100 - $300
                    </label>
                  </div>
                  <div class="form-check mb-2">
                    <input class="form-check-input" type="radio" name="priceRange" id="price-3" 
                           [(ngModel)]="selectedPriceRange" (ngModelChange)="applyFilters()" value="300-500">
                    <label class="form-check-label small" for="price-3">
                      $300 - $500
                    </label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="priceRange" id="price-4" 
                           [(ngModel)]="selectedPriceRange" (ngModelChange)="applyFilters()" value="500+">
                    <label class="form-check-label small" for="price-4">
                      $500+
                    </label>
                  </div>
                </div>

                <!-- Brands -->
                <div class="mb-2" *ngIf="brands.length > 0">
                  <h6 class="fw-bold small mb-1">Brands</h6>
                  <div class="form-check mb-2" *ngFor="let brand of brands">
                    <input class="form-check-input" type="checkbox" 
                           [id]="'brand-'+brand" 
                           [(ngModel)]="selectedBrands[brand]"
                           (ngModelChange)="applyFilters()">
                    <label class="form-check-label small" [for]="'brand-'+brand">
                      {{ brand }}
                    </label>
                  </div>
                </div>

                <!-- Customer Reviews -->
                <div class="mb-2">
                  <h6 class="fw-bold small mb-1">Customer Reviews</h6>
                  <div class="form-check mb-2">
                    <input class="form-check-input" type="radio" name="rating" id="rating-0" 
                           [(ngModel)]="selectedRating" (ngModelChange)="applyFilters()" value="">
                    <label class="form-check-label small" for="rating-0">
                      All Ratings
                    </label>
                  </div>
                  <div class="form-check mb-2">
                    <input class="form-check-input" type="radio" name="rating" id="rating-1" 
                           [(ngModel)]="selectedRating" (ngModelChange)="applyFilters()" value="4.5">
                    <label class="form-check-label small d-flex align-items-center" for="rating-1">
                      <span class="text-warning me-1">★★★★★</span> 4.5 & up
                    </label>
                  </div>
                  <div class="form-check mb-2">
                    <input class="form-check-input" type="radio" name="rating" id="rating-2" 
                           [(ngModel)]="selectedRating" (ngModelChange)="applyFilters()" value="4.0">
                    <label class="form-check-label small d-flex align-items-center" for="rating-2">
                      <span class="text-warning me-1">★★★★☆</span> 4.0 & up
                    </label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="rating" id="rating-3" 
                           [(ngModel)]="selectedRating" (ngModelChange)="applyFilters()" value="3.5">
                    <label class="form-check-label small d-flex align-items-center" for="rating-3">
                      <span class="text-warning me-1">★★★☆☆</span> 3.5 & up
                    </label>
                  </div>
                </div>

                <!-- Discount -->
                <div class="mb-2">
                  <h6 class="fw-bold small mb-1">Discount</h6>
                  <div class="form-check mb-2">
                    <input class="form-check-input" type="checkbox" id="discount-1" 
                           [(ngModel)]="discount10" (ngModelChange)="applyFilters()">
                    <label class="form-check-label small" for="discount-1">
                      10% off or more
                    </label>
                  </div>
                  <div class="form-check mb-2">
                    <input class="form-check-input" type="checkbox" id="discount-2" 
                           [(ngModel)]="discount20" (ngModelChange)="applyFilters()">
                    <label class="form-check-label small" for="discount-2">
                      20% off or more
                    </label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="discount-3" 
                           [(ngModel)]="discount30" (ngModelChange)="applyFilters()">
                    <label class="form-check-label small" for="discount-3">
                      30% off or more
                    </label>
                  </div>
                </div>

                <!-- Pay On Delivery -->
                <div class="mb-2">
                  <h6 class="fw-bold small mb-1">Payment Options</h6>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="pay-delivery" 
                           [(ngModel)]="payOnDelivery" (ngModelChange)="applyFilters()">
                    <label class="form-check-label small" for="pay-delivery">
                      Pay on Delivery Available
                    </label>
                  </div>
                </div>

                <button 
                  (click)="clearFilters()"
                  class="btn btn-outline-secondary btn-sm w-100 mt-2">
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          <!-- Products Column -->
          <div class="col-md-9">
            <!-- Sort Options -->
            <div class="card shadow-sm mb-3">
              <div class="card-body py-2">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="text-muted small">
                    Showing {{ filteredProducts.length }} of {{ allProducts.length }} products
                  </span>
                  <div class="d-flex align-items-center gap-2">
                    <label class="form-label small mb-0">Sort By:</label>
                    <select [(ngModel)]="sortBy" (ngModelChange)="applyFilters()" 
                            class="form-select form-select-sm" style="width: auto;">
                      <option value="">Default</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="name">Name A-Z</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Products Grid -->
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              <div *ngFor="let product of filteredProducts" class="col">
                <div class="card h-100 shadow-sm">
                  <div class="position-relative">
                    <img [src]="product.images[0]" [alt]="product.name" 
                         class="card-img-top" style="height: 200px; object-fit: cover;">
                    
                    <!-- Badges -->
                    <div class="position-absolute top-0 start-0 p-2">
                      <span *ngIf="product.originalPrice && product.originalPrice > product.price" 
                            class="badge bg-danger">
                        SALE
                      </span>
                    </div>
                    
                    <div class="position-absolute top-0 end-0 p-2">
                      <span class="badge bg-success">
                        ⭐ {{ product.rating }}
                      </span>
                    </div>
                    
                    <div class="position-absolute bottom-0 end-0 p-2">
                      <button 
                        (click)="speakProductInfo(product)"
                        class="btn btn-light rounded-circle opacity-75">
                        <i class="bi bi-megaphone"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div class="card-body">
                    <div class="mb-2">
                      <span class="badge bg-primary me-1">{{ product.category }}</span>
                      <span class="text-muted small">{{ product.brand }}</span>
                    </div>
                    
                    <h5 class="card-title text-truncate">{{ product.name }}</h5>
                    <p class="card-text text-muted small text-truncate">{{ product.description }}</p>
                    
                    <!-- Features -->
                    <div class="mb-1">
                      <div class="d-flex flex-wrap gap-1">
                        <span *ngFor="let feature of product.features.slice(0, 2)" 
                              class="badge bg-light text-dark small">
                          {{ feature }}
                        </span>
                        <span *ngIf="product.features.length > 2" 
                              class="text-muted small">
                          +{{ product.features.length - 2 }} more
                        </span>
                      </div>
                    </div>
                    
                    <!-- Price and Stock -->
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <div class="d-flex align-items-center gap-2">
                        <span class="h5 text-primary">\${{ product.price }}</span>
                        <span *ngIf="product.originalPrice" 
                              class="text-muted small text-decoration-line-through">\${{ product.originalPrice }}</span>
                      </div>
                      <span [class]="product.inStock ? 'text-success' : 'text-danger'" 
                            class="small fw-bold">
                        {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
                      </span>
                    </div>
                    
                    <!-- Actions -->
                    <div class="d-flex gap-2 mb-1">
                      <button 
                        (click)="addToCart(product)"
                        [disabled]="!product.inStock"
                        class="btn btn-primary flex-grow-1">
                        {{ product.inStock ? 'Add to Cart' : 'Out of Stock' }}
                      </button>
                      <a [routerLink]="['/product', product.id]" 
                         class="btn btn-outline-secondary flex-grow-1">
                        Details
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div *ngIf="filteredProducts.length === 0" class="text-center py-2">
              <div class="display-1 mb-2">🔍</div>
              <h3 class="h4 text-muted mb-2">No products found</h3>
              <p class="text-muted mb-2">Try adjusting your filters or search criteria</p>
              <button 
                (click)="clearFilters()"
                class="btn btn-primary px-4">
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `.card {
      transition: transform 0.2s;
    }
    .card:hover {
      transform: translateY(-5px);
    }`
  ]
})
export class ProductsComponent implements OnInit {
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  brands: string[] = [];
  
  selectedCategories: {[key: string]: boolean} = {};
  selectedBrands: {[key: string]: boolean} = {};
  selectedPriceRange = '';
  selectedRating = '';
  sortBy = '';
  
  fastDelivery = false;
  standardDelivery = false;
  discount10 = false;
  discount20 = false;
  discount30 = false;
  payOnDelivery = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private voiceService: VoiceService,private router: Router
  ) {}

  ngOnInit(): void {
   this.productService.getProducts().subscribe(products => {

  products.sort((a:any, b:any) => a.id - b.id);

  this.allProducts = products;
  this.filteredProducts = [...products];
  this.categories = [...new Set(products.map(p => p.category))];
  this.brands = [...new Set(products.map(p => p.brand))];
  

  this.categories.forEach(cat => this.selectedCategories[cat] = false);
  this.brands.forEach(brand => this.selectedBrands[brand] = false);
});
  }

   handleProductSuggestion(productId: string) {
    this.router.navigate(['/product', productId]);
  }
  applyFilters(): void {
    let filtered = [...this.allProducts];
    
    // Category filter
    const selectedCats = Object.keys(this.selectedCategories).filter(cat => this.selectedCategories[cat]);
    if (selectedCats.length > 0) {
      filtered = filtered.filter(p => selectedCats.includes(p.category));
    }
    
    // Brand filter
    const selectedBrands = Object.keys(this.selectedBrands).filter(brand => this.selectedBrands[brand]);
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand));
    }
    
    // Price range filter
    if (this.selectedPriceRange) {
      const [min, max] = this.selectedPriceRange.split('-').map(v => v.replace('+', ''));
      filtered = filtered.filter(p => {
        if (max) {
          return p.price >= parseInt(min) && p.price <= parseInt(max);
        } else {
          return p.price >= parseInt(min);
        }
      });
    }
    
    // Rating filter
    if (this.selectedRating) {
      filtered = filtered.filter(p => p.rating >= parseFloat(this.selectedRating));
    }
    
    // Delivery filters (placeholder - would need actual delivery data)
    if (this.fastDelivery) {
      filtered = filtered.filter((p:any) => p.deliveryDays <= 1); // Assuming deliveryDays property exists
    }
    if (this.standardDelivery) {
      filtered = filtered.filter((p:any) => p.deliveryDays <= 3); // Assuming deliveryDays property exists
    }
    
    // Discount filters
    if (this.discount10 || this.discount20 || this.discount30) {
      filtered = filtered.filter(p => {
        if (!p.originalPrice) return false;
        const discount = ((p.originalPrice - p.price) / p.originalPrice) * 100;
        if (this.discount10 && discount >= 10) return true;
        if (this.discount20 && discount >= 20) return true;
        if (this.discount30 && discount >= 30) return true;
        return false;
      });
    }
    
    // Pay on delivery filter (placeholder - would need actual payment data)
    if (this.payOnDelivery) {
      filtered = filtered.filter((p:any) => p.payOnDelivery); // Assuming payOnDelivery property exists
    }
    
    // Sort
    if (this.sortBy) {
      switch (this.sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }
    }
    
    this.filteredProducts = filtered;
  }

  clearFilters(): void {
    // Clear all filter values
    Object.keys(this.selectedCategories).forEach(cat => this.selectedCategories[cat] = false);
    Object.keys(this.selectedBrands).forEach(brand => this.selectedBrands[brand] = false);
    this.selectedPriceRange = '';
    this.selectedRating = '';
    this.sortBy = '';
    this.fastDelivery = false;
    this.standardDelivery = false;
    this.discount10 = false;
    this.discount20 = false;
    this.discount30 = false;
    this.payOnDelivery = false;
    
    // Reset products
    this.filteredProducts = [...this.allProducts];
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.voiceService.speak(`Added ${product.name} to your cart for $${product.price}`);
  }

  async speakProductCount(): Promise<void> {
    await this.voiceService.speak(`Showing ${this.filteredProducts.length} products out of ${this.allProducts.length} total products in our catalog.`);
  }

  async speakProductInfo(product: Product): Promise<void> {
    await this.voiceService.speak(`${product.name} by ${product.brand}. Priced at $${product.price}. Rating: ${product.rating} stars. ${product.inStock ? 'Available in stock' : 'Currently out of stock'}.`);
  }
}