import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { Subscription } from "rxjs";

import { Product } from "../../models/product.model";
import { VoiceService } from "../../services/voice.service";
import { ProductService } from "../../services/product.service";
import { SpeechSynthesisService } from "../../services/speech-synthesis-service";
import { GeminiApiService } from "../../services/gemini-api-service";
import { AichatService } from "../../services/aichat-service";
import { InactivityService } from "../../services/inactivity-service";
import { ChatbotStateService } from "../../services/chatbot-state-service";

interface ChatMessage {
  text: string;
  sender: "user" | "bot";
  type?: "text" | "image" | "video";
  products?: Product[];
  time: Date;
}

@Component({
  selector: "app-floating-chatbot",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./floating-chatbot-component.html",
  styleUrls: ["./floating-chatbot-component.css"],
})
export class FloatingChatbotComponent implements OnInit, OnDestroy {
  @ViewChild("chatContainer") chatContainer!: ElementRef;
  @ViewChild("userInput") userInput!: ElementRef;
  query = "";
  results: any[] = [];
  loading = false;
  isOpen = false; 
  isListening = false;
  recognition: any;
  messages: ChatMessage[] = [];
  userMessage = "";
  response = "";
  isLoading = false;
  error = "";
  recommendedProducts: any[] = [];
  quickSuggestionsMap: { [key: string]: string } = {
    "Show me electronics": "Electronics",
    "Best headphones under $300": "Audio",
    "Help me choose a laptop": "Laptops",
    "What's on sale?": "Sale",
    "Compare products": "Compare",
    "Voice commands help": "Help",
  };

  quickSuggestions = [
    "Show me electronics",
    "Best headphones under $300",
    "Help me choose a laptop",
    "What's on sale?",
    "Compare products",
    "Voice commands help",
  ];
  isVisible = false;
  private inactivitySub!: Subscription;

  constructor(
    private router: Router,
    private speechService: SpeechSynthesisService,
    private productService: ProductService,
    private geminiApiService: GeminiApiService,
    private voiceService: VoiceService,
    private aiService: AichatService,
    private inactivityService: InactivityService,
    private chatbotState: ChatbotStateService, 
    private route: ActivatedRoute,  ) {

    
  }

  ngOnInit() {
    this.initVoiceRecognition();
    this.addBotMessage(
      "Hello! I'm your shopping assistant. How can I help you today?"
    );
 this.chatbotState.isOpen$.subscribe((state) => (this.isOpen = state))
    this.inactivitySub = this.inactivityService.inactivityReached$.subscribe(
      () => {
        this.showPrompt();
      }
    );

    this.chatbotState.isOpen$.subscribe((state) => (this.isOpen = state));

    this.route.params.subscribe((params) => { debugger
      const productId = params["id"];
      if (productId) {
        this.loadProduct(productId);
      }
    });
    const isOpen = localStorage.getItem('chatbotOpen');
  if (isOpen === 'true') {
    this.isOpen = true;
    
  }
  }

  loadProduct(productId: string) {
    this.productService.getProductById(productId).subscribe({
      next: (product: any) => {
        this.messages.push({
          text: `Product loaded: ${product.name}`,
          sender: "bot",
          type: "text",
          products: [product],
          time: new Date()
        });
      },
      error: (err) => {
        console.error("Error fetching product by ID:", err);
      },
    });

    this.productService.getRecommendedProducts(productId).subscribe({
      next: (products: any[]) => {
        this.recommendedProducts = products;
      },
      error: (err) => {
        console.error("Error fetching recommended products:", err);
      },
    });
  }

  search(msg: any) {
    if (!msg.trim()) return;
    this.loading = true;
    this.aiService.searchProducts(msg).subscribe({
      next: (res) => {
        this.results = res.products || [];
        this.loading = false;
        console.log("Search results:", this.results);
      },
      error: () => (this.loading = false),
    });
  }

  askAboutProduct(product: any) {
    this.addUserMessage(`Tell me more about ${product.name}`);
    this.isLoading = true;
    this.scrollToBottom();

    setTimeout(() => {
      this.addBotMessage({
        text: `${product.name} is a top-rated item with ${product.rating}★ and priced at $${product.price}.`,
        products: [product],
      });
      this.isLoading = false;
      this.scrollToBottom();
    }, 800);
  }

  async sendQuickMessage(suggestion: string) {
    this.addUserMessage(suggestion);
    const category = this.quickSuggestionsMap[suggestion];

    if (category === "Sale") {
      this.loadSaleProducts();
      this.speakAndShow(`Here are the best deals right now.`);
    } else if (category === "Help") {
      const helpText = this.getHelpResponse();
      this.speakAndShow(helpText);
    } else if (category) {
      this.loadProductRecommendations(category);
      this.speakAndShow(`Here are some great ${category} products for you.`);
    } else {
      this.handleMessage(suggestion); 
    }
  }

  private getHelpResponse(): string {
    return `You can ask me to show categories, search products, find deals, or compare items. Try saying "Show me electronics" or "Find phones under $500".`;
  }

  private loadSaleProducts(): void {
    this.productService.getProducts().subscribe((products: any) => {
      if (products.length) {
        this.addBotMessage({
          text: `Here are ${products.length} items on sale:`,
          products,
        });
      } else {
        this.addBotMessage("No items on sale right now.");
      }
    });
  }

  private speakAndShow(text: string) {
    this.addBotMessage(text);
    this.voiceService.speak(text);
  }

  private loadProductRecommendations(category: string): void {
    this.productService.getProductsByCategory(category).subscribe((products) => {
      this.recommendedProducts = products.slice(0, 6);

      if (products.length) {
        this.addBotMessage({
          text: `I found ${products.length} ${category} products:`,
          products: this.recommendedProducts,
        });
        this.speakProductInfo(this.recommendedProducts[0]);
      } else {
        this.addBotMessage(
          `I couldn’t find any ${category} products right now.`
        );
      }
    });
  }

  initVoiceRecognition() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = "en-US";
      this.recognition.interimResults = true;
      this.recognition.continuous = true;

      this.recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        this.userMessage = transcript;

        if (event.results[event.results.length - 1].isFinal) {
          const finalText = transcript.trim();
          if (finalText) {
            this.addUserMessage(finalText);
            this.userMessage = "";
            this.handleMessage(finalText);
          }
        }
      };

      this.recognition.onerror = () => {
        this.isListening = false;
        this.addBotMessage("Sorry, I couldn't hear you properly.");
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          this.recognition.start();
        }
      };
    } else {
      this.addBotMessage("Voice recognition is not supported in your browser.");
    }
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
     this.chatbotState.setOpen(this.isOpen); 
    if (this.isOpen) {
      setTimeout(() => {
        this.scrollToBottom();
        this.userInput?.nativeElement.focus();
      }, 200);
    }
  }

  toggleListening() {
    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  startListening() {
    if (this.recognition) {
      this.isListening = true;
      this.addBotMessage("🎤 Listening... Speak now");
      this.recognition.start();
    }
  }

  stopListening() {
    if (this.recognition) {
      this.isListening = false;
      this.recognition.stop();
    }
  }

  sendMessage() {
    const msg = this.userMessage.trim();
    if (!msg) return;

    this.addUserMessage(msg);
    this.userMessage = "";
    this.handleMessage(msg);
  }

  handleMessage(msg: any) {
    this.search(msg);
    if (this.handleNavigation(msg)) {
      return;
    }

    if (this.isProductQuery(msg)) {
      this.handleProductQuery(msg);
    } else {
      this.queryGemini(msg);
    }
    localStorage.setItem(msg, 'true');
  }

  isProductQuery(msg: string): boolean {
    const productKeywords = [
      "product",
      "item",
      "show me",
      "find",
      "search",
      "looking for",
      "features",
      "specifications",
    ];
    return productKeywords.some((keyword) =>
      msg.toLowerCase().includes(keyword)
    );
  }

  handleProductQuery(query: string) {
    this.productService.searchProducts(query).subscribe({
      next: (products) => {
        if (products.length > 0) {
          this.addBotMessage({
            text: `I found ${products.length} products matching "${query}":`,
            products: products.slice(0, 3),
          });
          this.speakProductInfo(products[0]);
        } else {
          this.addBotMessage(
            `I couldn't find any products matching "${query}". Try being more specific.`
          );
          this.queryGemini(query);
        }
      },
      error: () => {
        this.addBotMessage("Sorry, I couldn't search for products right now.");
        this.queryGemini(query);
      },
    });
  }

  queryGemini(prompt: string) {
    if (!prompt.trim()) {
      this.error = "Please enter a message";
      return;
    }

    this.isLoading = true;
    this.error = "";

    this.geminiApiService.generateContent(prompt).subscribe({
      next: (result: any) => {
        this.response =
          result.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No response text found";
        this.addBotMessage(this.response);
        this.isLoading = false;
      },
      error: () => {
        this.addBotMessage("Sorry, I'm having trouble responding right now.");
        this.isLoading = false;
      },
    });
  }

  handleNavigation(msg: string): boolean {
    const text = msg.toLowerCase();
    const productMatch = text.match(/product\s*(\d+)/);
    if (productMatch) {
      const id = productMatch[1];
      this.stopListening();
      this.router.navigate(["/products", id]).then(() => {
        const response = `Taking you to product ${id} details...`;
        this.addBotMessage(response);
        this.speechService.speak(response);
      });
      return true;
    }

    const navMap: { [key: string]: string } = {
     home: "/",
      mainpage: "/",
      dashboard: "/",
      products: "/products",
      product: "/products",
      item: "/products",
      categories: "/categories",
      category: "/categories",
      cart: "/cart",
      checkout: "/checkout",
      assistant: "/assistant",
      help: "/assistant",
      support: "/assistant",
      profile: "/profile",
      search: "/searchAI",     
      login: "/login",
      account: "/account",
      product1: "/product/1",
    };

    for (const phrase in navMap) {
      if (text.includes(phrase)) {
        this.stopListening();
        this.router.navigate([navMap[phrase]]).then(() => {
          const response = `Taking you to ${phrase}...`;
          this.addBotMessage(response);
          this.speechService.speak(response);
        });
        return true;
      }
    }
    return false;
  }

  addUserMessage(text: string) {
    this.messages.push({ text, sender: "user", type: "text",time: new Date()});
    this.scrollToBottom();
  }

  addBotMessage(message: string | { text: string; products?: Product[] }) {
    if (typeof message === "string") {
      this.messages.push({ text: message, sender: "bot", type: "text",time: new Date()});
    } else {
      this.messages.push({
        text: message.text,
        sender: "bot",
        type: "text",
        products: message.products,time: new Date()
      });

      if (message.products?.length === 1) {
        const product = message.products[0];
        this.speakProductInfo(product);
        this.isVisible = true;
        this.navigateToProduct(product.id);
      }
    }
    this.scrollToBottom();
  }



  navigateToProduct(redID: any) {
localStorage.setItem('chatbotOpen', 'true'); 
  this.router.navigate(['/product', redID]).then(() => {
    window.location.reload();
  });
}
  speakProductInfo(product: Product) {
    const message = `${product.name} by ${product.brand}. Priced at $${product.price}. Rating: ${product.rating} stars. ${product.description.substring(0, 100)}...`;
    this.speechService.speak(message);
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop =
          this.chatContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  onKeyPress(event: any) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  showPrompt() {
    this.isVisible = true;
    this.voiceService.speak(`how can i help you`);
    this.messages.push({
      text: `how can i help you`,
      sender: "bot",
      type: "text",time: new Date()
    });

    this.toggleChat();
    if (this.isVisible) {
      this.isVisible = false;
    }
  }

  enableVoice() {
    this.isVisible = false;
    this.inactivityService.resetInactivityTimer();
    this.voiceService.speak(`how can i help you`);
  }

  dismiss() {
    this.isVisible = false;
    this.inactivityService.resetInactivityTimer();
  }

  ngOnDestroy() {
    if (this.inactivitySub) {
      this.inactivitySub.unsubscribe();
    }
    this.voiceService.stopSpeaking();
  }
}
