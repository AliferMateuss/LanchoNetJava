import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendasFechadasComponent } from './vendas-fechadas.component';

describe('VendasFechadasComponent', () => {
  let component: VendasFechadasComponent;
  let fixture: ComponentFixture<VendasFechadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendasFechadasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendasFechadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
