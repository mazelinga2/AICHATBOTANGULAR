import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoiceService {
  private recognition: any;
  private synthesis: SpeechSynthesis;
  private isListeningSubject = new BehaviorSubject<boolean>(false);
  private isSpeakingSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    this.synthesis = window.speechSynthesis;
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition() || new (window as any).SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    }
  }

  get isListening$(): Observable<boolean> {
    return this.isListeningSubject.asObservable();
  }

  get isSpeaking$(): Observable<boolean> {
    return this.isSpeakingSubject.asObservable();
  }

  startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject('Speech recognition not supported');
        return;
      }

      this.isListeningSubject.next(true);

      this.recognition.onresult = (event: any) => {
        const result = event.results[0][0].transcript;
        this.isListeningSubject.next(false);
        resolve(result);
      };

      this.recognition.onerror = (event: any) => {
        this.isListeningSubject.next(false);
        reject(event.error);
      };

      this.recognition.onend = () => {
        this.isListeningSubject.next(false);
      };

      try {
        this.recognition.start();
      } catch (error) {
        this.isListeningSubject.next(false);
        reject(error);
      }
    });
  }

  speak(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synthesis) {
        resolve();
        return;
      }

      this.synthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onstart = () => {
        this.isSpeakingSubject.next(true);
      };

      utterance.onend = () => {
        this.isSpeakingSubject.next(false);
        resolve();
      };

      utterance.onerror = () => {
        this.isSpeakingSubject.next(false);
        resolve();
      };

      this.synthesis.speak(utterance);
    });
  }

  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.isSpeakingSubject.next(false);
    }
  }

  stopListening(): void {
    if (this.recognition) {
      this.recognition.stop();
      this.isListeningSubject.next(false);
    }
  }
}