import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelPedidoComponent } from './rel-pedido.component';

describe('RelPedidoComponent', () => {
  let component: RelPedidoComponent;
  let fixture: ComponentFixture<RelPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelPedidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
