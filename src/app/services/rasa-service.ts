import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const RASA_URL = 'http://localhost:5005/webhooks/rest/webhook';
@Injectable({
  providedIn: 'root'
})
export class RasaService {
 constructor(private http: HttpClient) {}


   sendMessage(message: string, sender = 'web_user'): Observable<any> {
    return this.http.post(RASA_URL, { sender, message });
  }
}
