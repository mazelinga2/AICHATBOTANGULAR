import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { VoiceService } from '../../services/voice.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
  <nav class="navbar navbar-expand-lg bg-white shadow-sm border-bottom py-2">
    <div class="container">
      
      <!-- Logo -->
      <a class="navbar-brand fw-bold d-flex align-items-center gap-2" routerLink="/">
        <span class="logo-icon">AI</span> <span>TechMart</span>
      </a>

      <!-- Mobile Toggle -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Menu + Search -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item"><a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Home</a></li>
          <li class="nav-item"><a class="nav-link" routerLink="/products" routerLinkActive="active">Products</a></li>
          <li class="nav-item"><a class="nav-link" routerLink="/categories" routerLinkActive="active">Categories</a></li>
          <li class="nav-item"><a class="nav-link" routerLink="/assistant" routerLinkActive="active">Assistant</a></li>
          <li class="nav-item"><a class="nav-link" routerLink="/searchAI" routerLinkActive="active">search</a></li>
        </ul>

        <!-- Search Bar -->
        <form class="d-flex me-3" (submit)="$event.preventDefault()">
          <input class="form-control me-2 rounded-pill px-3" type="search" placeholder="Search products..." [(ngModel)]="searchQuery" name="search">
          <button class="btn btn-outline-primary rounded-pill px-3" type="submit">Search</button>
        </form>

        <!-- Right Icons -->
        <div class="d-flex align-items-center gap-3">
          
          <!-- Voice Button -->
          <button (click)="toggleVoiceControl()" class="btn btn-sm rounded-circle btn-light shadow-sm" 
            [ngClass]="(isListening$ | async) ? 'btn-danger text-white' : 'btn-light'">
            {{ (isListening$ | async) ? '🎤' : '🎙️' }}
          </button>

          <!-- Cart -->
          <a routerLink="/cart" class="btn btn-light position-relative rounded-circle shadow-sm">
            🛒
            <span *ngIf="cartItemCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {{ cartItemCount }}
            </span>
          </a>

          <!-- Profile -->
          <a routerLink="/profile" class="btn btn-light rounded-circle shadow-sm">👤</a>
        </div>
      </div>
    </div>
  </nav>
  `,
  styles: [`
    .nav-link.active { color: #0d6efd !important; font-weight: 500; }
    .logo-icon {
      background: #6f42c1; 
      color: white; 
      font-size: 0.9rem; 
      padding: 5px 8px; 
      border-radius: 6px;
    }
  `]
})
export class HeaderComponent implements OnInit {
  cartItemCount = 0;
  isListening$: Observable<boolean>;
  searchQuery = '';

  constructor(
    private cartService: CartService,
    private voiceService: VoiceService,
    private router: Router
  ) {
    this.isListening$ = this.voiceService.isListening$;
  }

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(() => {
      this.cartItemCount = this.cartService.getCartItemCount();
    });
  }

  async toggleVoiceControl(): Promise<void> {
    try {
      const command = await this.voiceService.startListening();
      await this.processVoiceCommand(command);
    } catch (error) {
      console.error('Voice recognition error:', error);
    }
  }

  private async processVoiceCommand(command: string): Promise<void> {
    const lowerCommand = command.toLowerCase();
    if (lowerCommand.includes('home')) {
      this.router.navigate(['/']);
      await this.voiceService.speak('Navigating to home page');
    } else if (lowerCommand.includes('products')) {
      this.router.navigate(['/products']);
      await this.voiceService.speak('Navigating to products page');
    } else if (lowerCommand.includes('cart')) {
      this.router.navigate(['/cart']);
      await this.voiceService.speak('Navigating to cart');
    } else if (lowerCommand.includes('assistant')) {
      this.router.navigate(['/assistant']);
      await this.voiceService.speak('Opening AI assistant');
    } else {
      await this.voiceService.speak('Sorry, I did not understand.');
    }
  }
}
