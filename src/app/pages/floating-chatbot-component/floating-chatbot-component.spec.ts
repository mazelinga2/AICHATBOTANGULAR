import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingChatbotComponent } from './floating-chatbot-component';

describe('FloatingChatbotComponent', () => {
  let component: FloatingChatbotComponent;
  let fixture: ComponentFixture<FloatingChatbotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingChatbotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatingChatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
