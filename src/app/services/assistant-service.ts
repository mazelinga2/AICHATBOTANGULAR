import { Injectable } from '@angular/core';
import { GeminiService } from './gemini.service';
import { SpeechSynthesisService } from './speech-synthesis-service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssistantService {
  constructor(
    private gemini: GeminiService,
    private speech: SpeechSynthesisService,
    private router: Router
  ) {}

  processMessage(message: string, context: string) {
    const lowerMsg = message.toLowerCase();

    if (this.isNavigation(lowerMsg)) {
      return { type: 'navigation', path: this.getPath(lowerMsg) };
    }
    if (this.isSearch(lowerMsg)) {
      return { type: 'search', query: message };
    }
    return { type: 'general', query: message };
  }

  handleGeminiResponse(prompt: string, context?: string): Observable<string> {
    return this.gemini.generateChatResponse(prompt, context);
  }

  speakResponse(response: string) {
    if (response.length < 150) {
      this.speech.speak(response);
    }
  }

  private isNavigation(msg: string): boolean {
    return ['home', 'cart', 'checkout', 'categories', 'products', 'profile', 'orders']
      .some(k => msg.includes(k));
  }

  private getPath(msg: string): string {
    if (msg.includes('cart')) return '/cart';
    if (msg.includes('checkout')) return '/checkout';
    if (msg.includes('categories')) return '/categories';
    if (msg.includes('products')) return '/products';
    if (msg.includes('profile')) return '/profile';
    if (msg.includes('orders')) return '/orders';
    return '/';
  }

  private isSearch(msg: string): boolean {
    return /(find|search|show|recommend|suggest|looking for|buy)/i.test(msg);
  }
}