import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { VoiceService } from '../../services/voice.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-vh-100 bg-light">
      <div class="container-fluid py-4">
        <div class="row">
          
          <!-- Left Filter Sidebar -->
          <div class="col-12 col-md-3 col-lg-2 mb-4">
            <div class="card shadow-sm">
              <div class="card-header bg-primary text-white fw-bold">
                Filters
                <button class="btn btn-sm btn-outline-light float-end" 
                        (click)="toggleVoiceFilter()">
                  {{ voiceFilterEnabled ? '🔴 Disable' : '🟢 Enable' }} Voice Filter
                </button>
              </div>
              <div class="card-body">
                
                <!-- Category Filter -->
                <h6 class="fw-semibold">Categories</h6>
                <ul class="list-unstyled mb-3">
                  <li *ngFor="let category of categories" 
                      (click)="selectCategory(category.name)" 
                      class="mb-2 cursor-pointer">
                    <span [class.text-primary]="selectedCategory === category.name">
                      {{ category.icon }} {{ category.name }}
                    </span>
                  </li>
                </ul>

                <!-- Delivery Day Filter -->
                <h6 class="fw-semibold">Delivery Day</h6>
                <div class="form-check mb-2">
                  <input class="form-check-input" type="checkbox" id="deliveryFast" 
                         [(ngModel)]="fastDelivery" (change)="applyFilters()">
                  <label class="form-check-label" for="deliveryFast">
                    🚚 Get It by Tomorrow
                  </label>
                </div>
                <div class="form-check mb-3">
                  <input class="form-check-input" type="checkbox" id="deliveryStandard" 
                         [(ngModel)]="standardDelivery" (change)="applyFilters()">
                  <label class="form-check-label" for="deliveryStandard">
                    🚛 2-3 Days Delivery
                  </label>
                </div>

                <!-- Price Range Filter -->
                <h6 class="fw-semibold">Price Range</h6>
                <div class="input-group mb-3">
                  <span class="input-group-text">$</span>
                  <input type="number" class="form-control" placeholder="Min" 
                         [(ngModel)]="minPrice" (change)="applyFilters()">
                  <span class="input-group-text">to</span>
                  <input type="number" class="form-control" placeholder="Max" 
                         [(ngModel)]="maxPrice" (change)="applyFilters()">
                </div>

                <!-- Brands Filter -->
                <h6 class="fw-semibold">Brands</h6>
                <div *ngFor="let brand of brands" class="form-check mb-2">
                  <input class="form-check-input" type="checkbox" 
                         [id]="'brand-' + brand" 
                         [(ngModel)]="selectedBrands[brand]" 
                         (change)="applyFilters()">
                  <label class="form-check-label" [for]="'brand-' + brand">
                    {{ brand }}
                  </label>
                </div>

                <!-- Customer Reviews Filter -->
                <h6 class="fw-semibold">Customer Reviews</h6>
                <select class="form-select mb-3" [(ngModel)]="minRating" (change)="applyFilters()">
                  <option value="0">All Ratings</option>
                  <option value="3">⭐ 3+ Stars</option>
                  <option value="4">⭐ 4+ Stars</option>
                  <option value="4.5">⭐ 4.5+ Stars</option>
                </select>

                <!-- Discount Filter -->
                <h6 class="fw-semibold">Discount</h6>
                <select class="form-select mb-3" [(ngModel)]="minDiscount" (change)="applyFilters()">
                  <option value="0">No Discount</option>
                  <option value="10">10% Off or More</option>
                  <option value="20">20% Off or More</option>
                  <option value="30">30% Off or More</option>
                </select>

                <!-- Pay On Delivery Filter -->
                <div class="form-check mb-3">
                  <input class="form-check-input" type="checkbox" id="payOnDelivery" 
                         [(ngModel)]="payOnDelivery" (change)="applyFilters()">
                  <label class="form-check-label" for="payOnDelivery">
                    💵 Pay On Delivery Available
                  </label>
                </div>

                <!-- Clear Filters Button -->
                <button (click)="clearSelection()" 
                        class="btn btn-outline-secondary w-100">
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="col-12 col-md-9 col-lg-10">
            
            <!-- Header -->
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h2 class="fw-bold mb-0">
                {{ selectedCategory || 'All Products' }}
                <span *ngIf="activeFilterCount > 0" class="badge bg-secondary ms-2">
                  {{ activeFilterCount }} filter(s) applied
                </span>
              </h2>
              <div class="d-flex gap-2">
                <button (click)="speakCategoryProducts()" 
                        class="btn btn-outline-primary">
                  🔊 Listen to Products
                </button>
              </div>
            </div>

            <!-- Product Grid -->
            <div class="row g-4">
              <div *ngFor="let product of paginatedProducts" class="col-12 col-md-6 col-lg-4 col-xl-3">
                <div class="card h-100 shadow-sm">
                  <img [src]="product.images[0]" [alt]="product.name" 
                       class="card-img-top object-fit-cover" style="height: 200px;">
                  <div class="card-body">
                    <h5 class="fw-semibold">{{ product.name }}</h5>
                    <p class="small text-muted">{{ product.description.length > 100 ? (product.description | slice:0:100) + '...' : product.description }}</p>
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="fw-bold text-primary">\${{ product.price }}</span>
                      <button (click)="speakProductInfo(product)" 
                              class="btn btn-sm btn-outline-secondary">
                        🔊
                      </button>
                    </div>
                  </div>
                  <div class="card-footer text-center">
                    <a [routerLink]="['/product', product.id]" 
                       class="btn btn-primary w-100">
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <nav class="mt-4">
              <ul class="pagination justify-content-center">
                <li class="page-item" [class.disabled]="currentPage === 1">
                  <a class="page-link" (click)="changePage(currentPage - 1)">Previous</a>
                </li>
                <li class="page-item" *ngFor="let page of totalPagesArray" 
                    [class.active]="page === currentPage">
                  <a class="page-link" (click)="changePage(page)">{{ page }}</a>
                </li>
                <li class="page-item" [class.disabled]="currentPage === totalPages">
                  <a class="page-link" (click)="changePage(currentPage + 1)">Next</a>
                </li>
              </ul>
            </nav>

          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cursor-pointer { cursor: pointer; }
    .object-fit-cover { object-fit: cover; }
  `]
})
export class CategoriesComponent implements OnInit {
  selectedCategory: string | null = null;
  categoryProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  categories = [
    { name: 'Electronics', icon: '📱', description: 'Smartphones and gadgets', productCount: 25 },
    { name: 'Wearables', icon: '⌚', description: 'Smartwatches and fitness trackers', productCount: 18 },
    { name: 'Photography', icon: '📷', description: 'Cameras and lenses', productCount: 12 },
    { name: 'Gaming', icon: '🎮', description: 'Gaming gear and accessories', productCount: 22 },
    { name: 'Audio', icon: '🎧', description: 'Speakers and headphones', productCount: 15 },
    { name: 'Home', icon: '🏠', description: 'Smart home devices', productCount: 30 }
  ];
  
  // New filter properties
  minPrice: number | null = null;
  maxPrice: number | null = null;
  fastDelivery = false;
  standardDelivery = false;
  brands: any[] = [];
  selectedBrands: { [key: string]: boolean } = {};
  minRating = 0;
  minDiscount = 0;
  payOnDelivery = false;
  voiceFilterEnabled = false;
  activeFilterCount = 0;

  // Pagination
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  totalPagesArray: number[] = [];

  constructor(
    private productService: ProductService,
    private voiceService: VoiceService
  ) {}

  ngOnInit(): void {
    this.loadAllProducts();
  }

  loadAllProducts() {
    this.productService.getProducts().subscribe((products: any) => {
      this.categoryProducts = products;
      // Extract unique brands from products
      this.brands = [...new Set(products.map((p: Product) => p.brand))];
      this.brands.forEach(brand => this.selectedBrands[brand] = false);
      this.applyFilters();
    });
  }

  toggleVoiceFilter() {
    this.voiceFilterEnabled = !this.voiceFilterEnabled;
    if (this.voiceFilterEnabled) {
      this.startVoiceFilter();
    } else {
      this.voiceService.stopListening();
    }
  }

  selectCategory(categoryName: string): void {
    this.selectedCategory = categoryName;
    this.applyFilters();
    this.voiceService.speak(`Category selected: ${categoryName}`);
  }

  clearSelection(): void {
    this.selectedCategory = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.fastDelivery = false;
    this.standardDelivery = false;
    this.minRating = 0;
    this.minDiscount = 0;
    this.payOnDelivery = false;
    Object.keys(this.selectedBrands).forEach(brand => this.selectedBrands[brand] = false);
    this.applyFilters();
    this.voiceService.speak(`Filters cleared. Showing all products`);
  }

  applyFilters() {
    let filtered = [...this.categoryProducts];

    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    // Price range filter
    if (this.minPrice != null) {
      filtered = filtered.filter(p => p.price >= this.minPrice!);
    }
    if (this.maxPrice != null) {
      filtered = filtered.filter(p => p.price <= this.maxPrice!);
    }

    // Delivery filters (assuming product has deliveryDays property)
    if (this.fastDelivery) {
      filtered = filtered.filter((p:any) => p.deliveryDays <= 1);
    }
    if (this.standardDelivery) {
      filtered = filtered.filter((p:any) => p.deliveryDays <= 3);
    }

    // Brand filter
    const selectedBrands = Object.keys(this.selectedBrands).filter(brand => this.selectedBrands[brand]);
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand));
    }

    // Rating filter
    if (this.minRating > 0) {
      filtered = filtered.filter(p => p.rating >= this.minRating);
    }

    // Discount filter (assuming product has originalPrice property)
    if (this.minDiscount > 0) {
      filtered = filtered.filter(p => {
        if (!p.originalPrice) return false;
        const discount = ((p.originalPrice - p.price) / p.originalPrice) * 100;
        return discount >= this.minDiscount;
      });
    }

    // Pay on delivery filter (assuming product has payOnDelivery property)
    if (this.payOnDelivery) {
      filtered = filtered.filter((p:any) => p.payOnDelivery);
    }

    // Calculate active filter count
    this.activeFilterCount = 0;
    if (this.selectedCategory) this.activeFilterCount++;
    if (this.minPrice != null || this.maxPrice != null) this.activeFilterCount++;
    if (this.fastDelivery || this.standardDelivery) this.activeFilterCount++;
    if (selectedBrands.length > 0) this.activeFilterCount++;
    if (this.minRating > 0) this.activeFilterCount++;
    if (this.minDiscount > 0) this.activeFilterCount++;
    if (this.payOnDelivery) this.activeFilterCount++;

    // Update pagination
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.totalPagesArray = Array(this.totalPages).fill(0).map((x, i) => i + 1);
    this.changePage(1, filtered);
  }

  changePage(page: number, productsList?: Product[]) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    const list = productsList || this.getFilteredList();
    const start = (page - 1) * this.itemsPerPage;
    this.paginatedProducts = list.slice(start, start + this.itemsPerPage);
  }

  getFilteredList(): Product[] {
    let filtered = [...this.categoryProducts];
    if (this.selectedCategory) {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }
    if (this.minPrice != null) {
      filtered = filtered.filter(p => p.price >= this.minPrice!);
    }
    if (this.maxPrice != null) {
      filtered = filtered.filter(p => p.price <= this.maxPrice!);
    }
    return filtered;
  }

  async speakCategoryProducts() {
    if (this.paginatedProducts.length === 0) return;
    let message = `Showing ${this.paginatedProducts.length} products`;
    this.paginatedProducts.forEach((p, i) => {
      message += `. ${i + 1} ${p.name} priced at $${p.price}`;
    });
    await this.voiceService.speak(message);
  }

  async speakProductInfo(product: Product) {
    await this.voiceService.speak(`${product.name}, priced at $${product.price}. Rating: ${product.rating} stars.`);
  }

async startVoiceFilter() {
  try {
    // Start listening and get spoken text
    await this.voiceService.speak("What would you like to filter by? You can say things like 'Show electronics under $500' or 'Only 4 star ratings'");
    const spokenText = await this.voiceService.startListening();
    const lower = spokenText.toLowerCase();
    
    // Reset filters when user says "clear" or "reset"
    if (lower.includes('clear') || lower.includes('reset')) {
      this.clearSelection();
      await this.voiceService.speak("Filters cleared. Showing all products.");
      return;
    }

    // 1. Category Filter
    const matchedCategory = this.categories.find(c => 
      lower.includes(c.name.toLowerCase())
    );
    if (matchedCategory) {
      this.selectedCategory = matchedCategory.name;
      await this.voiceService.speak(`Showing ${matchedCategory.name} products.`);
    }

    // 2. Price Range Filter
    if (lower.includes('under') || lower.includes('below')) {
      const priceMatch = lower.match(/\d+/);
      if (priceMatch) {
        this.maxPrice = +priceMatch[0];
        await this.voiceService.speak(`Setting maximum price to $${this.maxPrice}.`);
      }
    } else if (lower.includes('over') || lower.includes('above')) {
      const priceMatch = lower.match(/\d+/);
      if (priceMatch) {
        this.minPrice = +priceMatch[0];
        await this.voiceService.speak(`Setting minimum price to $${this.minPrice}.`);
      }
    } else if (lower.includes('between')) {
      const prices = lower.match(/\d+/g);
      if (prices && prices.length >= 2) {
        this.minPrice = +prices[0];
        this.maxPrice = +prices[1];
        await this.voiceService.speak(`Setting price range between $${this.minPrice} and $${this.maxPrice}.`);
      }
    }

    // 3. Delivery Day Filter
    if (lower.includes('tomorrow') || lower.includes('fast') || lower.includes('same day')) {
      this.fastDelivery = true;
      await this.voiceService.speak("Showing items available for fast delivery.");
    }
    if (lower.includes('2-3') || lower.includes('standard') || lower.includes('few days')) {
      this.standardDelivery = true;
      await this.voiceService.speak("Showing items with standard delivery.");
    }

    // 4. Brand Filter
    const matchedBrand = this.brands.find(b => 
      lower.includes(b.toLowerCase())
    );
    if (matchedBrand) {
      this.selectedBrands[matchedBrand] = true;
      await this.voiceService.speak(`Showing products from ${matchedBrand}.`);
    }

    // 5. Customer Reviews Filter
    if (lower.includes('rating') || lower.includes('star') || lower.includes('review')) {
      if (lower.includes('4.5') || lower.includes('four and a half')) {
        this.minRating = 4.5;
        await this.voiceService.speak("Showing products with 4.5 stars or higher.");
      } else if (lower.includes('4') || lower.includes('four')) {
        this.minRating = 4;
        await this.voiceService.speak("Showing products with 4 stars or higher.");
      } else if (lower.includes('3') || lower.includes('three')) {
        this.minRating = 3;
        await this.voiceService.speak("Showing products with 3 stars or higher.");
      }
    }

    // 6. Discount Filter
    if (lower.includes('discount') || lower.includes('sale') || lower.includes('off')) {
      if (lower.includes('30%') || lower.includes('thirty percent')) {
        this.minDiscount = 30;
        await this.voiceService.speak("Showing products with 30% off or more.");
      } else if (lower.includes('20%') || lower.includes('twenty percent')) {
        this.minDiscount = 20;
        await this.voiceService.speak("Showing products with 20% off or more.");
      } else if (lower.includes('10%') || lower.includes('ten percent')) {
        this.minDiscount = 10;
        await this.voiceService.speak("Showing products with 10% off or more.");
      }
    }

    // 7. Pay On Delivery Filter
    if (lower.includes('pay on delivery') || lower.includes('cash on delivery') || lower.includes('cod')) {
      this.payOnDelivery = true;
      await this.voiceService.speak("Showing products available with pay on delivery.");
    }

    // Apply all filters
    this.applyFilters();
    
    // Confirm results
    const productCount = this.paginatedProducts.length;
    if (productCount > 0) {
      await this.voiceService.speak(`Found ${productCount} matching products.`);
    } else {
      await this.voiceService.speak("No products match your filters. Try adjusting your criteria.");
    }

  } catch (error) {
    console.error('Voice recognition error:', error);
    await this.voiceService.speak("Sorry, I didn't understand that. Please try again.");
  }
}
}