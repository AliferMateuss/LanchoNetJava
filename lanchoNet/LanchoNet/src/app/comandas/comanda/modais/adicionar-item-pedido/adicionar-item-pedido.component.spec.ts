import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdicionarItemPedidoComponent } from './adicionar-item-pedido.component';

describe('AdicionarItemPedidoComponent', () => {
  let component: AdicionarItemPedidoComponent;
  let fixture: ComponentFixture<AdicionarItemPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdicionarItemPedidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdicionarItemPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
