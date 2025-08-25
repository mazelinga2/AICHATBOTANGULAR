import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataExchangeService {
 public GetValues:any;
  private commentSubject = new BehaviorSubject<any[]>([]);
  public comment$ = this.commentSubject.asObservable();
  constructor() {}
 private secretKey = 'MY_SUPER_SECRET_KEYNSB058_2025';

 updateComments(newComments: any[]) {
    this.commentSubject.next(newComments);
  }

private xorEncryptDecrypt(str: string): string {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      result += String.fromCharCode(
        str.charCodeAt(i) ^ this.secretKey.charCodeAt(i % this.secretKey.length)
      );
    }
    return result;
  }

  // ===== Reverse String =====
  private reverseString(str: string): string {
    return str.split('').reverse().join('');
  }

  // ===== Double Encode =====
  private doubleEncode(value: any): string {
    const json = JSON.stringify(value); 
    let step1 = this.xorEncryptDecrypt(json); // XOR encrypt
    let step2 = this.reverseString(step1);    // Reverse string
    let step3 = btoa(step2);                  // Base64 encode
    let step4 = this.reverseString(step3);    // Reverse again
    let step5 = btoa(step4);                  // Base64 encode again
    return step5;
  }

  // ===== Double Decode =====
  private doubleDecode(encoded: string): any {
    try {
      let step1 = atob(encoded);               // Base64 decode
      let step2 = this.reverseString(step1);   // Reverse
      let step3 = atob(step2);                 // Base64 decode
      let step4 = this.reverseString(step3);   // Reverse string
      let step5 = this.xorEncryptDecrypt(step4); // XOR decrypt
      return JSON.parse(step5);
    } catch {
      return null;
    }
  }

  // ===== Clear Data =====
  clearUserData(): void {
    localStorage.removeItem('userName');
    sessionStorage.clear();
    localStorage.clear();
  }

  clearCurrentValues(): void {
    localStorage.removeItem('currentValue');
  }

  // ===== Secure Set/Get =====
  setUserData(res: any): void {
    localStorage.setItem('userName', this.doubleEncode(res));
  }

  getUserData(): any {
    const data = localStorage.getItem('userName');
    return data ? this.doubleDecode(data) : null;
  }

  setCurrentValues(valueChange: any): void {
    sessionStorage.setItem('currentValue', this.doubleEncode(valueChange));
  }

  getCurrentValue(): any {
    const data = sessionStorage.getItem('currentValue');
    return data ? this.doubleDecode(data) : null;
  }

  setUserDetails(res: any): void {
    localStorage.setItem('userDetails', this.doubleEncode(res));
  }

  getUserDetails(): any {
    const data = localStorage.getItem('userDetails');
    return data ? this.doubleDecode(data) : null;
  }
}