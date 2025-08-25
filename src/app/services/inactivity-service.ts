import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InactivityService implements OnDestroy {

  private inactivityTrigger = new Subject<void>();
  inactivityReached$ = this.inactivityTrigger.asObservable();

  private inactivityDelay = 1* 60 * 1000; 
  private timerId: any = null;
  
  private activityEvents = [
    'mousemove', 'mousedown', 'keypress', 'scroll', 
    'touchstart', 'click', 'input'
  ];

  constructor(private ngZone: NgZone) {
    this.startMonitoring();
  }

  private startMonitoring() {
    this.ngZone.runOutsideAngular(() => {
      this.resetTimer();
      
      this.activityEvents.forEach(eventName => {
        window.addEventListener(eventName, this.activityHandler.bind(this));
      });
    });
  }

  private activityHandler() {
    this.resetTimer();
  }

  private resetTimer() {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }

    this.timerId = setTimeout(() => {
      this.ngZone.run(() => {
        this.inactivityTrigger.next();
      });
      console.log('User is inactive', this.inactivityDelay);
    }, this.inactivityDelay);
  }

  resetInactivityTimer() {
    this.resetTimer();
  }

  ngOnDestroy() {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }    
    this.activityEvents.forEach(eventName => {
      window.removeEventListener(eventName, this.activityHandler.bind(this));
    });
  }
}
