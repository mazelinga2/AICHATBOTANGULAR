import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpeechSynthesisService } from '../../services/speech-synthesis-service';

@Component({
  selector: 'app-chat-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: 'app-chat-assistant.html',
  styles: ['app-chat-assistant.css'],
})
export class ChatAssistantComponent implements OnInit, AfterViewInit {
  @ViewChild('chatMessages') chatMessages!: ElementRef;
  
  isOpen = true;
  userInput = '';
  messages: {sender: string, text: string}[] = [];
  suggestions: string[] = [];
  
  constructor(
    private speechService: SpeechSynthesisService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    // Auto-open after a short delay
    setTimeout(() => {
      this.isOpen = true;
      this.readPageContent();
    }, 2000);
  }

  ngAfterViewInit() {
    // Analyze page content after view initializes
    setTimeout(() => {
      this.analyzePageContent();
    }, 3000);
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.scrollToBottom();
    }
  }

  readPageContent() { debugger;
    // Get main content from the page (you might need to adjust the selector)
    const mainContent = document.querySelector('main') || document.body;
    const textContent = mainContent.textContent || '';
    
    // Speak the welcome message
    this.speechService.speak("Hello! I'm your AI assistant. I've analyzed this page and can help you with:");
    
    // Read the first few sentences of page content
    const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const preview = sentences.slice(0, 3).join('. ') + '.';
    this.speechService.speak(preview);
    
    // Suggest help options
    setTimeout(() => {
      this.speechService.speak("I can help you understand more about this content. Just ask or select one of the suggestions.");
    }, 5000);
  }

  analyzePageContent() { debugger;
    // This would be more sophisticated in a real app
    // For now, we'll use some mock suggestions based on the image content
    this.suggestions = [
      "Tell me more about luxury gift materials",
      "What makes these items ethically sourced?",
      "Explain the craftsmanship process",
      "How are these items personalized?"
    ];
  }

  sendMessage() { debugger;
    if (!this.userInput.trim()) return;
    
    // Add user message
    this.messages.push({sender: 'user', text: this.userInput});
    
    // Process message (in a real app, this would call an API)
    const response = this.generateResponse(this.userInput);
    
    // Add assistant response after a short delay
    setTimeout(() => {
      this.messages.push({sender: 'assistant', text: response});
      this.speechService.speak(response);
      this.scrollToBottom();
    }, 1000);
    
    this.userInput = '';
  }

  selectSuggestion(suggestion: string) { debugger;
    this.userInput = suggestion;
    this.sendMessage();
  }

  private generateResponse(input: string): string { debugger;
    // This would be replaced with actual AI integration
    input = input.toLowerCase();
    
    if (input.includes('luxury') || input.includes('materials')) {
      return "Our luxury gifts utilize premium materials including ethically sourced gemstones and rare materials. Each piece is selected for its quality and sustainability.";
    } else if (input.includes('ethic') || input.includes('source')) {
      return "All materials are ethically sourced with full transparency in the supply chain. We work directly with certified suppliers who meet our strict ethical standards.";
    } else if (input.includes('craft') || input.includes('process')) {
      return "Each item is handcrafted by renowned artisans with impeccable craftsmanship. The process involves superior skills passed down through generations.";
    } else if (input.includes('personal') || input.includes('custom')) {
      return "Every piece can be personalized to make it uniquely yours. We offer engraving, custom designs, and tailored solutions for special occasions.";
    } else {
      return "I can help you with information about our luxury items, their materials, craftsmanship, and personalization options. What would you like to know more about?";
    }
  }

  private scrollToBottom() { debugger;
    setTimeout(() => {
      this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight;
    }, 100);
  }
}