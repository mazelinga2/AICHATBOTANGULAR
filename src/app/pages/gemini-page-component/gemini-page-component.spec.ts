import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeminiPageComponent } from './gemini-page-component';

describe('GeminiPageComponent', () => {
  let component: GeminiPageComponent;
  let fixture: ComponentFixture<GeminiPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeminiPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeminiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
