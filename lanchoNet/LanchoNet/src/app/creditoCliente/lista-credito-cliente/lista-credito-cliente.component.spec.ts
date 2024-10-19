import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCreditoClienteComponent } from './lista-credito-cliente.component';

describe('ListaCreditoClienteComponent', () => {
  let component: ListaCreditoClienteComponent;
  let fixture: ComponentFixture<ListaCreditoClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaCreditoClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaCreditoClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
