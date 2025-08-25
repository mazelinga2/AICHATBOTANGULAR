// gemini-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiApiService {
  private model = 'gemini-1.5-flash';
  private apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`;

  constructor(private http: HttpClient) {}

  generateContent(prompt: string) {
    const params = { key: environment.geminiApiKey };
    const body = {
      contents: [
        { parts: [{ text: prompt }] }
      ]
    };
    return this.http.post(this.apiUrl, body, { params });
  }

  listModels() {
    return this.http.get(
      'https://generativelanguage.googleapis.com/v1beta/models',
      { params: { key: environment.geminiApiKey } }
    );
  }
}