import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarItemPedidoComponent } from './editar-item-pedido.component';

describe('EditarItemPedidoComponent', () => {
  let component: EditarItemPedidoComponent;
  let fixture: ComponentFixture<EditarItemPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarItemPedidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarItemPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
