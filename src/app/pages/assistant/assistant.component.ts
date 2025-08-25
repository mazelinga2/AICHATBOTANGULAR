import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../services/gemini.service';
import { VoiceService } from '../../services/voice.service';
import { ProductService } from '../../services/product.service';
import { ChatMessage, Product } from '../../models/product.model';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="assistant-container">
      <div class="assistant-content">
        
        <!-- Header -->
        <div class="assistant-header">
          <h1>AI Shopping Assistant</h1>
          <p>Get personalized recommendations and shopping help with voice or text</p>
        </div>

        <!-- Voice Controls -->
        <div class="control-panel">
          <div class="control-buttons">
            <button 
              (click)="startVoiceChat()"
              [class.listening]="(isListening$ | async)"
              class="voice-button">
              <span class="button-icon">{{ (isListening$ | async) ? '🎤' : '🗣️' }}</span>
              <span>{{ (isListening$ | async) ? 'Listening...' : 'Voice Chat' }}</span>
            </button>
            
            <button 
              *ngIf="isSpeaking$ | async"
              (click)="stopSpeaking()"
              class="stop-speaking-button">
              <span class="button-icon">🔇</span>
              <span>Stop Speaking</span>
            </button>
            
            <button 
              (click)="clearChat()"
              class="clear-button">
              Clear Chat
            </button>
          </div>
        </div>

        <!-- Chat Interface -->
        <div class="chat-container">
          
          <!-- Messages -->
          <div class="messages-area" #messagesContainer>
            <div *ngIf="messages.length === 0" class="empty-message">
              <div class="empty-icon">🤖</div>
              <p>Hello! I'm your AI shopping assistant. Ask me about products, get recommendations, or use voice commands!</p>
            </div>
            
            <div *ngFor="let message of messages" 
                 [class]="message.isUser ? 'user-message-wrapper' : 'bot-message-wrapper'">
              <div [class]="message.isUser ? 'user-message' : 'bot-message'">
                
                <div class="message-meta">
                  <span class="message-avatar">{{ message.isUser ? '👤' : '🤖' }}</span>
                  <span class="message-time">
                    {{ message.timestamp | date:'short' }}
                  </span>
                  <span *ngIf="message.type === 'voice'" class="voice-indicator">🎤</span>
                </div>
                
                <p class="message-content">{{ message.content }}</p>
                
                <button 
                  *ngIf="!message.isUser"
                  (click)="speakMessage(message.content)"
                  class="listen-button">
                  <span>🔊</span>
                  <span>Listen</span>
                </button>
              </div>
            </div>
            
            <div *ngIf="isTyping" class="typing-indicator">
              <div class="typing-bubble">
                <div class="typing-meta">
                  <span class="typing-avatar">🤖</span>
                  <span>Thinking...</span>
                </div>
                <div class="typing-dots">
                  <div class="typing-dot"></div>
                  <div class="typing-dot"></div>
                  <div class="typing-dot"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Input -->
          <div class="input-area">
            <div class="input-group">
              <input 
                type="text" 
                [(ngModel)]="currentMessage" 
                (keyup.enter)="sendMessage()"
                placeholder="Ask me about products, get recommendations, or say 'help' for commands..."
                class="message-input">
              
              <button 
                (click)="sendMessage()"
                [disabled]="!currentMessage.trim()"
                class="send-button">
                Send
              </button>
            </div>
            
            <!-- Quick Actions -->
            <div class="quick-actions">
              <button 
                *ngFor="let suggestion of quickSuggestions" 
                (click)="sendQuickMessage(suggestion)"
                class="quick-action-button">
                {{ suggestion }}
              </button>
            </div>
          </div>
        </div>

        <!-- Product Recommendations -->
        <div *ngIf="recommendedProducts.length > 0" class="recommendations-section">
          <h2>Recommended Products</h2>
          <div class="products-grid">
            <div *ngFor="let product of recommendedProducts" 
                 class="product-card">
              <img [src]="product.images[0]" [alt]="product.name" 
                   class="product-image">
              <div class="product-details">
                <h3>{{ product.name }}</h3>
                <div class="product-price-rating">
                  <span class="price">\${{ product.price }}</span>
                  <span class="rating">⭐ {{ product.rating }}</span>
                </div>
                <div class="product-actions">
                  <a [routerLink]="['/product', product.id]" 
                     class="view-button">
                    View
                  </a>
                  <button 
                    (click)="askAboutProduct(product)"
                    class="ask-button">
                    Ask AI
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Base styles */
    .assistant-container {
      min-height: 100vh;
      background-color: #f8fafc;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    .assistant-content {
      max-width: 72rem;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
    
    /* Header styles */
    .assistant-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .assistant-header h1 {
      font-size: 1.875rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }
    
    .assistant-header p {
      color: #64748b;
    }
    
    /* Control panel styles */
    .control-panel {
      background-color: white;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .control-buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .voice-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      background-color: #3b82f6;
      color: white;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .voice-button:hover {
      opacity: 0.9;
    }
    
    .voice-button.listening {
      background-color: #ef4444;
    }
    
    .stop-speaking-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      background-color: #f97316;
      color: white;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .stop-speaking-button:hover {
      background-color: #ea580c;
    }
    
    .clear-button {
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      background-color: #64748b;
      color: white;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .clear-button:hover {
      background-color: #475569;
    }
    
    .button-icon {
      font-size: 1.25rem;
    }
    
    /* Chat container styles */
    .chat-container {
      background-color: white;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    /* Messages area styles */
    .messages-area {
      height: 24rem;
      overflow-y: auto;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .empty-message {
      text-align: center;
      color: #64748b;
      padding: 2rem 0;
    }
    
    .empty-icon {
      font-size: 2.25rem;
      margin-bottom: 1rem;
    }
    
    .user-message-wrapper {
      display: flex;
      justify-content: flex-end;
    }
    
    .bot-message-wrapper {
      display: flex;
      justify-content: flex-start;
    }
    
    .user-message {
      max-width: 20rem;
      background-color: #3b82f6;
      color: white;
      padding: 0.75rem 1rem;
      border-radius: 1rem 1rem 0 1rem;
    }
    
    .bot-message {
      max-width: 20rem;
      background-color: #f1f5f9;
      color: #1e293b;
      padding: 0.75rem 1rem;
      border-radius: 1rem 1rem 1rem 0;
    }
    
    .message-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
      font-size: 0.75rem;
      opacity: 0.8;
    }
    
    .message-content {
      font-size: 0.875rem;
      line-height: 1.5;
    }
    
    .listen-button {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      margin-top: 0.25rem;
      font-size: 0.75rem;
      opacity: 0.7;
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    
    .listen-button:hover {
      opacity: 1;
    }
    
    /* Typing indicator styles */
    .typing-indicator {
      display: flex;
      justify-content: flex-start;
    }
    
    .typing-bubble {
      background-color: #f1f5f9;
      color: #1e293b;
      padding: 0.75rem 1rem;
      border-radius: 1rem 1rem 1rem 0;
      max-width: 20rem;
    }
    
    .typing-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
      font-size: 0.75rem;
    }
    
    .typing-dots {
      display: flex;
      gap: 0.25rem;
    }
    
    .typing-dot {
      width: 0.5rem;
      height: 0.5rem;
      background-color: #94a3b8;
      border-radius: 50%;
      animation: bounce 1s infinite;
    }
    
    .typing-dot:nth-child(2) {
      animation-delay: 0.1s;
    }
    
    .typing-dot:nth-child(3) {
      animation-delay: 0.2s;
    }
    
    /* Input area styles */
    .input-area {
      border-top: 1px solid #e2e8f0;
      padding: 1rem;
    }
    
    .input-group {
      display: flex;
      gap: 0.5rem;
    }
    
    .message-input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      transition: all 0.2s;
    }
    
    .message-input:focus {
      outline: none;
      border-color: #93c5fd;
      box-shadow: 0 0 0 3px rgba(147, 197, 253, 0.3);
    }
    
    .send-button {
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      background-color: #3b82f6;
      color: white;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .send-button:hover {
      background-color: #2563eb;
    }
    
    .send-button:disabled {
      background-color: #cbd5e1;
      cursor: not-allowed;
    }
    
    /* Quick actions styles */
    .quick-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.75rem;
    }
    
    .quick-action-button {
      font-size: 0.75rem;
      background-color: #e0f2fe;
      color: #0369a1;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .quick-action-button:hover {
      background-color: #bae6fd;
    }
    
    /* Recommendations section styles */
    .recommendations-section {
      margin-top: 2rem;
    }
    
    .recommendations-section h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 1rem;
    }
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 1rem;
    }
    
    @media (min-width: 768px) {
      .products-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (min-width: 1024px) {
      .products-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    
    .product-card {
      background-color: white;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: box-shadow 0.2s;
    }
    
    .product-card:hover {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .product-image {
      width: 100%;
      height: 8rem;
      object-fit: cover;
    }
    
    .product-details {
      padding: 1rem;
    }
    
    .product-details h3 {
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .product-price-rating {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }
    
    .price {
      color: #3b82f6;
      font-weight: 600;
    }
    
    .rating {
      font-size: 0.75rem;
      color: #64748b;
    }
    
    .product-actions {
      display: flex;
      gap: 0.5rem;
    }
    
    .view-button {
      flex: 1;
      background-color: #3b82f6;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      text-align: center;
      text-decoration: none;
      transition: background-color 0.2s;
    }
    
    .view-button:hover {
      background-color: #2563eb;
    }
    
    .ask-button {
      flex: 1;
      background-color: #e2e8f0;
      color: #1e293b;
      padding: 0.25rem 0.75rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .ask-button:hover {
      background-color: #cbd5e1;
    }
    
    /* Animations */
    @keyframes bounce {
      0%, 80%, 100% { 
        transform: translateY(0); 
      }
      40% { 
        transform: translateY(-0.5rem); 
      }
    }
  `]
})
export class AssistantComponent implements OnInit {
  messages: any[] = [];
  currentMessage = '';
  isTyping = false;
  recommendedProducts: Product[] = [];
  isListening$: Observable<boolean>;
  isSpeaking$: Observable<boolean>;
  
  quickSuggestions = [
    'Show me electronics',
    'Best headphones under $300',
    'Help me choose a laptop',
    'What\'s on sale?',
    'Compare products',
    'Voice commands help'
  ];

  constructor(
    private geminiService: GeminiService,
    private voiceService: VoiceService,
    private productService: ProductService
  ) {
    this.isListening$ = this.voiceService.isListening$;
    this.isSpeaking$ = this.voiceService.isSpeaking$;
  }

  ngOnInit(): void {
    this.addWelcomeMessage();
  }

  private addWelcomeMessage(): void {
    this.messages.push({
      id: Date.now().toString(),
      content: 'Hi! I\'m your AI shopping assistant. I can help you find products, compare items, get recommendations, and answer questions. Try asking me something like "Show me the best headphones" or use voice commands!',
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    });
  }

  async sendMessage(): Promise<void> { debugger;
    if (!this.currentMessage.trim()) return;
    
    const userMessage = this.currentMessage.trim();
    this.currentMessage = '';
    
    // Add user message
    this.messages.push({
      id: Date.now().toString(),
      content: userMessage,
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    });
    
    await this.processUserMessage(userMessage);
  }

  async sendQuickMessage(suggestion: string): Promise<void> { debugger;
    this.currentMessage = suggestion;
    await this.sendMessage();
  }

  async startVoiceChat(): Promise<void> { debugger;
    try {
      const voiceInput = await this.voiceService.startListening();
      
      // Add user voice message
      this.messages.push({
        id: Date.now().toString(),
        content: voiceInput,
        isUser: true,
        timestamp: new Date(),
        type: 'voice'
      });
      
      await this.processUserMessage(voiceInput);
    } catch (error) {
      console.error('Voice recognition error:', error);
      await this.voiceService.speak('Sorry, I couldn\'t understand that. Please try again.');
    }
  }

  stopSpeaking(): void {
    this.voiceService.stopSpeaking();
  }

  clearChat(): void {
    this.messages = [];
    this.recommendedProducts = [];
    this.addWelcomeMessage();
  }

  async speakMessage(content: string): Promise<void> { debugger
    await this.voiceService.speak(content);
  }

  async askAboutProduct(product: Product): Promise<void> {
    const question = `Tell me about ${product.name}`;
    this.currentMessage = question;
    await this.sendMessage();
  }

  private async processUserMessage(message: string): Promise<void> {
    this.isTyping = true;
    
    try {
      const lowerMessage = message.toLowerCase();
      let response = '';
      
      // Handle specific commands
      if (lowerMessage.includes('help') || lowerMessage.includes('commands')) {
        response = this.getHelpResponse();
      } else if (lowerMessage.includes('electronics') || lowerMessage.includes('gadgets')) {
        response = 'Here are some great electronics! I\'ve loaded some recommendations below.';
        this.loadProductRecommendations('Electronics');
      } else if (lowerMessage.includes('headphones') || lowerMessage.includes('audio')) {
        response = 'Great choice! Here are some excellent headphones and audio products.';
        this.loadProductRecommendations('Audio');
      } else if (lowerMessage.includes('sale') || lowerMessage.includes('discount')) {
        response = 'I found some great deals for you! Check out these discounted items.';
        this.loadSaleProducts();
      } else if (lowerMessage.includes('compare') || lowerMessage.includes('vs')) {
        response = 'I can help you compare products! Tell me which specific products you\'d like to compare, and I\'ll highlight their key differences.';
      } else {
        // Use Gemini AI for general queries
        response = await this.geminiService.generateChatResponse(message).toPromise() || 'I\'m here to help with your shopping needs!';
      }
      
      // Add AI response
      this.messages.push({
        id: Date.now().toString(),
        content: response,
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      });
      
      // Speak the response
      await this.voiceService.speak(response);
      
    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorResponse = 'I apologize, but I encountered an error. Please try asking your question again.';
      this.messages.push({
        id: Date.now().toString(),
        content: errorResponse,
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      });
    } finally {
      this.isTyping = false;
      this.scrollToBottom();
    }
  }

  private getHelpResponse(): string {
    return `Here are some things you can ask me:

Voice Commands:
• "Show me electronics" - Browse electronics
• "Find headphones under $300" - Product search with budget
• "What's on sale?" - See discounted items
• "Compare products" - Get product comparisons
• "Tell me about [product]" - Product details

Text Commands:
• Ask for product recommendations
• Get shopping advice
• Compare product features
• Find deals and discounts
• Get detailed product information

Just speak naturally or type your questions!`;
  }

  private loadProductRecommendations(category: string): void {
    this.productService.getProductsByCategory(category).subscribe(products => {
      this.recommendedProducts = products.slice(0, 6);
    });
  }

  private loadSaleProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.recommendedProducts = products.filter(p => p.originalPrice && p.originalPrice > p.price).slice(0, 6);
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const container = document.querySelector('.messages-area');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }
}