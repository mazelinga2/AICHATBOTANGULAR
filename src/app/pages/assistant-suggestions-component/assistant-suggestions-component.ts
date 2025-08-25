import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AssistantService } from '../../services/assistant-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assistant-suggestions-component',
standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './assistant-suggestions-component.html',
  styleUrl: './assistant-suggestions-component.css'
})
export class AssistantSuggestionsComponent implements OnInit {
  query = '';
  products: any[] = [];
  isLoading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private assistantService: AssistantService,
    private router: Router
  ) {}

  ngOnInit() {
    this.query = this.route.snapshot.queryParamMap.get('q') || '';
    if (this.query) {
      this.assistantService.handleGeminiResponse(`Suggest products for: ${this.query}`).subscribe({
        next: (res) => {
          // For now, mock product list from text
          this.products = this.mockProducts(res);
          this.assistantService.speakResponse(res);
          this.isLoading = false;
        },
        error: () => {
          this.error = 'Error fetching suggestions.';
          this.isLoading = false;
        }
      });
    }
  }

goHome() {
  this.router.navigate(['/']);
}
  mockProducts(resText: string) {
    return [
      { name: 'Product A', image: '/assets/img/a.jpg', description: 'Great choice for daily use.' },
      { name: 'Product B', image: '/assets/img/b.jpg', description: 'High quality and affordable.' }
    ];
  }

  goToProduct(p: any) {
    this.router.navigate(['/product', p.name]);
  }
}