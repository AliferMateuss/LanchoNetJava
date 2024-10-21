import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelContasPagarComponent } from './rel-contas-pagar.component';

describe('RelContasPagarComponent', () => {
  let component: RelContasPagarComponent;
  let fixture: ComponentFixture<RelContasPagarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelContasPagarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelContasPagarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
