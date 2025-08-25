import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistantSuggestionsComponent } from './assistant-suggestions-component';

describe('AssistantSuggestionsComponent', () => {
  let component: AssistantSuggestionsComponent;
  let fixture: ComponentFixture<AssistantSuggestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssistantSuggestionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssistantSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
