import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  constructor(private http: HttpClient) {}

  generateProductRecommendations(userPreferences: string, currentProduct?: Product): Observable<string> {
    const prompt = `Based on user preferences: "${userPreferences}" ${currentProduct ? `and current product: ${currentProduct.name}` : ''}, suggest 3-5 similar products with brief descriptions. Format as a helpful recommendation list.`;
    
    return this.callGeminiAPI(prompt);
  }

  generateChatResponse(userMessage: string, context?: string): Observable<string> {
    const prompt = `You are a helpful e-commerce assistant. User says: "${userMessage}". ${context ? `Context: ${context}` : ''} Provide a helpful, concise response about products, shopping, or assistance.`;
    
    return this.callGeminiAPI(prompt);
  }

  generateProductDescription(productName: string, category: string): Observable<string> {
    const prompt = `Generate an engaging product description for: ${productName} in category: ${category}. Include key features and benefits in 2-3 sentences.`;
    
    return this.callGeminiAPI(prompt);
  }

  private callGeminiAPI(prompt: string): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    };

    // For demo purposes, return mock responses
    // In production, uncomment the HTTP call below
    return of(this.getMockResponse(prompt));

    /*
    return this.http.post(`${this.apiUrl}?key=${environment.geminiApiKey}`, body, { headers })
      .pipe(
        map((response: any) => response.candidates[0].content.parts[0].text)
      );
    */
  }

  private getMockResponse(prompt: string): string {
    if (prompt.includes('recommendation')) {
      return 'Based on your preferences, I recommend: 1) Premium Wireless Headphones - Great sound quality and comfort, 2) Smart Fitness Tracker - Perfect for health monitoring, 3) Portable Bluetooth Speaker - Excellent for outdoor activities.';
    } else if (prompt.includes('assistant')) {
      return 'I\'m here to help you find the perfect products! You can ask me about product details, comparisons, or get personalized recommendations.';
    } else {
      return 'This product offers exceptional quality and value, featuring premium materials and innovative design that makes it perfect for your needs.';
    }

    
  }
}
  