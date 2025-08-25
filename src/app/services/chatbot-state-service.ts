import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root", 
})
export class ChatbotStateService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);

  isOpen$ = this.isOpenSubject.asObservable();

  constructor() {}

  getState(): boolean {
    return this.isOpenSubject.value;
  }

  setOpen(state: boolean): void {
    this.isOpenSubject.next(state);
    localStorage.setItem("chatbotOpen", JSON.stringify(state));
  }

  toggle(): void {
    this.setOpen(!this.getState());
  }

  restoreState(): void {
    const saved = localStorage.getItem("chatbotOpen");
    if (saved !== null) {
      this.isOpenSubject.next(JSON.parse(saved));
    }
  }
}
