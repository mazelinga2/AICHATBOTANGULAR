import { Component } from '@angular/core';
import { GeminiApiService } from '../../services/gemini-api-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gemini-page-component',
imports: [CommonModule, FormsModule],
  templateUrl: './gemini-page-component.html',
  styleUrl: './gemini-page-component.css'
})
export class GeminiPageComponent {
 prompt = '';
  response = '';
  isLoading = false;
  error = '';

  constructor(private geminiService: GeminiApiService) {}
onEnterKey(event: any) {
  if (!event.shiftKey) { // Prevent shift+enter from sending
    event.preventDefault(); // Stop new line
    this.submitPrompt();
  }
}
  submitPrompt() {
    if (!this.prompt.trim()) {
      this.error = '⚠ Please enter a prompt';
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.response = '';

    this.geminiService.generateContent(this.prompt).subscribe({
      next: (result: any) => {
        this.response = result.candidates?.[0]?.content?.parts?.[0]?.text || 'No response text found';
        this.isLoading = false;
      },
      error: (err) => {
        const errMsg = err.error?.error?.message || 'Error fetching response';
        if (errMsg.includes('quota')) {
          this.error = '🚫 You have exceeded your free quota. Please enable billing or wait for quota reset.';
        } else {
          this.error = errMsg;
        }
        this.isLoading = false;
      }
    });
  }
}