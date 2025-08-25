import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { VoiceService } from '../../services/voice.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="search-container">
      <!-- Voice Search Modal -->
      <div #voiceModal class="modal fade" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Voice Search</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center py-4">
              <div class="voice-animation mb-3" [class.listening]="isListening">
                <div class="wave"></div>
                <div class="wave"></div>
                <div class="wave"></div>
              </div>
              <p class="mb-0">{{ isListening ? 'Listening... Speak now' : 'Click the microphone to start' }}</p>
            </div>
            <div class="modal-footer justify-content-center">
              <button 
                (click)="toggleVoiceListening()"
                class="btn btn-primary rounded-circle p-3"
                [class.btn-danger]="isListening">
                <i class="bi bi-mic-fill fs-4"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Search Area -->
      <div class="search-header">
        <div class="container">
          <h1 class="display-5 fw-bold mb-3">Discover Products</h1>
          <p class="lead mb-4">Find exactly what you need with voice or text search</p>
          
          <div class="search-box-container">
            <div class="input-group mb-3">
              <span class="input-group-text bg-white">
                <i class="bi bi-search text-muted"></i>
              </span>
              <input 
                type="text" 
                [(ngModel)]="searchQuery" 
                (keyup.enter)="performSearch()"
                class="form-control form-control-lg" 
                placeholder="Search products, brands, or categories..."
                #searchInput>
              <button 
                (click)="openVoiceModal()"
                class="btn btn-outline-secondary"
                type="button">
                <i class="bi bi-mic"></i>
              </button>
              <button 
                (click)="performSearch()"
                [disabled]="!searchQuery.trim()"
                class="btn btn-primary"
                type="button">
                Search
              </button>
            </div>

            <!-- Quick Suggestions -->
            <div class="quick-suggestions">
              <span class="me-2">Try:</span>
              <div class="d-flex flex-wrap gap-2">
                <button 
                  *ngFor="let suggestion of popularSearches" 
                  (click)="searchSuggestion(suggestion)"
                  class="btn btn-sm btn-outline-secondary rounded-pill">
                  {{ suggestion }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Results -->
      <div class="container my-5">
        <div *ngIf="hasSearched">
          <!-- Results Header -->
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="h4 fw-bold">
              <span *ngIf="searchResults.length > 0">{{ searchResults.length }} results</span>
              <span *ngIf="searchResults.length === 0">No results</span>
              <span *ngIf="searchQuery"> for "{{ searchQuery }}"</span>
            </h2>
            <div class="d-flex gap-2">
              <button 
                *ngIf="searchResults.length > 0"
                (click)="speakSearchResults()"
                class="btn btn-sm btn-outline-primary">
                <i class="bi bi-speaker me-1"></i> Listen
              </button>
              <button 
                *ngIf="searchQuery"
                (click)="clearSearch()"
                class="btn btn-sm btn-outline-secondary">
                <i class="bi bi-x-lg me-1"></i> Clear
              </button>
            </div>
          </div>

          <!-- No Results -->
          <div *ngIf="searchResults.length === 0" class="text-center py-5">
            <div class="empty-state-icon mb-4">
              <i class="bi bi-search text-muted" style="font-size: 3rem;"></i>
            </div>
            <h3 class="h5 mb-2">No products found</h3>
            <p class="text-muted mb-4">Try different keywords or browse our categories</p>
            <div class="d-flex justify-content-center gap-3">
              <button 
                (click)="clearSearch()"
                class="btn btn-primary">
                Clear Search
              </button>
              <a 
                routerLink="/products" 
                class="btn btn-outline-primary">
                Browse All
              </a>
            </div>
          </div>

          <!-- Results Grid -->
          <div *ngIf="searchResults.length > 0" class="row g-4">
            <div *ngFor="let product of searchResults" class="col-md-6 col-lg-4 col-xl-3">
              <div class="card h-100 product-card">
                <div class="product-badges">
                  <span *ngIf="product.originalPrice && product.originalPrice > product.price" 
                        class="badge bg-danger">SALE</span>
                  <span class="badge bg-success">
                    <i class="bi bi-star-fill me-1"></i>{{ product.rating }}
                  </span>
                </div>
                
                <button 
                  (click)="speakProductInfo(product)"
                  class="btn btn-sm btn-light product-voice-btn">
                  <i class="bi bi-speaker"></i>
                </button>
                
                <img [src]="product.images[0]" [alt]="product.name" class="card-img-top product-image">
                
                <div class="card-body">
                  <div class="d-flex align-items-center text-muted small mb-2">
                    <span class="text-primary fw-medium">{{ product.category }}</span>
                    <span class="mx-2">•</span>
                    <span>{{ product.brand }}</span>
                  </div>
                  
                  <h3 class="h5 card-title mb-2">{{ product.name }}</h3>
                  <p class="card-text text-muted small mb-3">{{ product.description }}</p>
                  
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <span class="h5 text-primary">\${{ product.price }}</span>
                      <span *ngIf="product.originalPrice" 
                            class="text-muted small ms-2 text-decoration-line-through">\${{ product.originalPrice }}</span>
                    </div>
                    <span [class]="product.inStock ? 'text-success' : 'text-danger'" 
                          class="small fw-medium">
                      {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
                    </span>
                  </div>
                  
                  <div class="d-grid gap-2">
                    <button 
                      (click)="addToCart(product)"
                      [disabled]="!product.inStock"
                      class="btn btn-primary">
                      <i class="bi bi-cart-plus me-2"></i>
                      {{ product.inStock ? 'Add to Cart' : 'Out of Stock' }}
                    </button>
                    <a 
                      [routerLink]="['/product', product.id]" 
                      class="btn btn-outline-primary">
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Search Tips (shown when no search performed) -->
        <div *ngIf="!hasSearched" class="search-tips">
          <h2 class="h4 fw-bold text-center mb-4">How to Search</h2>
          <div class="row g-4">
            <div class="col-md-4">
              <div class="card h-100 border-0 text-center p-4">
                <div class="icon-container bg-primary bg-opacity-10 text-primary mb-3">
                  <i class="bi bi-search"></i>
                </div>
                <h3 class="h5 mb-2">Text Search</h3>
                <p class="text-muted small">
                  Type product names, brands, or categories to find exactly what you need
                </p>
              </div>
            </div>
            
            <div class="col-md-4">
              <div class="card h-100 border-0 text-center p-4">
                <div class="icon-container bg-info bg-opacity-10 text-info mb-3">
                  <i class="bi bi-mic"></i>
                </div>
                <h3 class="h5 mb-2">Voice Search</h3>
                <p class="text-muted small">
                  Speak naturally to search hands-free with our voice recognition
                </p>
              </div>
            </div>
            
            <div class="col-md-4">
              <div class="card h-100 border-0 text-center p-4">
                <div class="icon-container bg-success bg-opacity-10 text-success mb-3">
                  <i class="bi bi-lightning-charge"></i>
                </div>
                <h3 class="h5 mb-2">Smart Filters</h3>
                <p class="text-muted small">
                  Narrow results by price, rating, or availability with one click
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      min-height: 100vh;
      background-color: #f8f9fa;
    }
    
    .search-header {
      background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
      color: white;
      padding: 4rem 0;
      margin-bottom: 2rem;
    }
    
    .search-box-container {
      max-width: 800px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 1rem;
      padding: 1.5rem;
    }
    
    .quick-suggestions {
      display: flex;
      align-items: center;
      margin-top: 1rem;
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9rem;
    }
    
    .product-card {
      transition: transform 0.2s, box-shadow 0.2s;
      border: none;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
    
    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }
    
    .product-image {
      height: 200px;
      object-fit: cover;
    }
    
    .product-badges {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 2;
      display: flex;
      gap: 5px;
    }
    
    .product-voice-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 2;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }
    
    .icon-container {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      font-size: 1.5rem;
    }
    
    /* Voice animation */
    .voice-animation {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      height: 60px;
      gap: 4px;
    }
    
    .voice-animation .wave {
      width: 6px;
      height: 20px;
      background: #0d6efd;
      border-radius: 3px;
      transition: height 0.2s;
    }
    
    .voice-animation.listening .wave {
      animation: wave 1s infinite ease-in-out;
    }
    
    .voice-animation.listening .wave:nth-child(1) {
      animation-delay: 0.1s;
    }
    
    .voice-animation.listening .wave:nth-child(2) {
      animation-delay: 0.3s;
    }
    
    .voice-animation.listening .wave:nth-child(3) {
      animation-delay: 0.5s;
    }
    
    @keyframes wave {
      0%, 100% {
        height: 20px;
      }
      50% {
        height: 40px;
      }
    }
  `]
})
export class SearchComponent implements OnInit {
  @ViewChild('voiceModal') voiceModal!: ElementRef;
  @ViewChild('searchInput') searchInput!: ElementRef;
  
  searchQuery = '';
  searchResults: Product[] = [];
  hasSearched = false;
  isListening = false;
  
  popularSearches = [
    'Wireless Earbuds',
    'Smart Watches',
    '4K TVs',
    'Gaming Laptops',
    'DSLR Cameras',
    'Fitness Trackers',
    'Bluetooth Speakers',
    'Under $50'
  ];

  constructor(
    private productService: ProductService,
    private voiceService: VoiceService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Initialize component
  }

  openVoiceModal(): void {
    const modal = new (window as any).bootstrap.Modal(this.voiceModal.nativeElement);
    modal.show();
  }

  async toggleVoiceListening(): Promise<void> {
    if (this.isListening) {
      this.voiceService.stopListening();
      this.isListening = false;
      return;
    }

    try {
      this.isListening = true;
      const voiceQuery = await this.voiceService.startListening();
      this.searchQuery = voiceQuery;
      this.isListening = false;
      
      // Close modal and focus search input
      const modal = (window as any).bootstrap.Modal.getInstance(this.voiceModal.nativeElement);
      modal.hide();
      this.searchInput.nativeElement.focus();
      
      await this.performSearch();
    } catch (error) {
      console.error('Voice search error:', error);
      this.isListening = false;
    }
  }

  async performSearch(): Promise<void> {
    if (!this.searchQuery.trim()) return;
    
    this.hasSearched = true;
    
    try {
      const results = await this.productService.searchProducts(this.searchQuery).toPromise();
      this.searchResults = results || [];
      
      if (this.searchResults.length === 0) {
        await this.voiceService.speak(`No results found for "${this.searchQuery}". Try different keywords.`);
      } else {
        await this.voiceService.speak(`Found ${this.searchResults.length} products matching "${this.searchQuery}". Here are some options.`);
      }
    } catch (error) {
      console.error('Search error:', error);
      await this.voiceService.speak('Sorry, there was an error processing your search. Please try again.');
    }
  }

  searchSuggestion(suggestion: string): void {
    this.searchQuery = suggestion;
    this.performSearch();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.hasSearched = false;
    this.searchInput.nativeElement.focus();
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.voiceService.speak(`Added ${product.name} to your cart. The price is $${product.price}.`);
  }

  async speakSearchResults(): Promise<void> {
    if (this.searchResults.length === 0) return;
    
    let resultsList = `Here are ${this.searchResults.length} results for "${this.searchQuery}": `;
    
    // Speak first 3 products in detail
    const productsToSpeak = this.searchResults.slice(0, 3);
    for (const [index, product] of productsToSpeak.entries()) {
      resultsList += `${index + 1}. ${product.name} by ${product.brand}. Priced at $${product.price}. Rating: ${product.rating} stars. `;
    }
    
    if (this.searchResults.length > 3) {
      resultsList += `Plus ${this.searchResults.length - 3} more products.`;
    }
    
    await this.voiceService.speak(resultsList);
  }

  async speakProductInfo(product: Product): Promise<void> {
    const message = `${product.name} by ${product.brand}. ${product.description}. Priced at $${product.price}. ` +
                   `Rating: ${product.rating} stars. ${product.inStock ? 'Available in stock.' : 'Currently out of stock.'}`;
    await this.voiceService.speak(message);
  }
}