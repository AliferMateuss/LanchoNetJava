import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAbrirCaixaComponent } from './modal-abrir-caixa.component';

describe('ModalAbrirCaixaComponent', () => {
  let component: ModalAbrirCaixaComponent;
  let fixture: ComponentFixture<ModalAbrirCaixaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAbrirCaixaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAbrirCaixaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
