import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AichatService {
 private baseUrl = 'http://localhost:5000/api/products'; // Your backend

  constructor(private http: HttpClient) {}

  // Semantic search
  searchProducts(query: string, limit: number = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}/search`, {
      params: { q: query, limit }
    });
  }

  // Get product with AI summary
  getProduct(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // Get recommendations
  getRecommendations(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}/recommendations`);
  }

  // Get categories
  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categories/all`);
  }
}
