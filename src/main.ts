import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withRouterConfig } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HeaderComponent } from './app/components/header/header.component';
import { routes } from './app/app.routes';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FloatingChatbotComponent } from './app/pages/floating-chatbot-component/floating-chatbot-component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FloatingChatbotComponent
],
  template: `
    <div class="app-container">
      <app-header></app-header>
      <main class="main-content container py-4">
        <router-outlet></router-outlet>
      </main>
     <app-floating-chatbot></app-floating-chatbot>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
    
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      position: relative; /* Add this for proper positioning */
    }
    
    .main-content {
      flex: 1;
      padding-top: 20px;
    }
  `]
})
export class App {}

bootstrapApplication(App, {
  providers: [
   // provideRouter(routes),
    provideHttpClient(),
    provideRouter(routes, withRouterConfig({
  onSameUrlNavigation: 'reload'
}))
  ]
}).catch(err => console.error(err));