import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditoClienteComponent } from './credito-cliente.component';

describe('CreditoClienteComponent', () => {
  let component: CreditoClienteComponent;
  let fixture: ComponentFixture<CreditoClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditoClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditoClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
