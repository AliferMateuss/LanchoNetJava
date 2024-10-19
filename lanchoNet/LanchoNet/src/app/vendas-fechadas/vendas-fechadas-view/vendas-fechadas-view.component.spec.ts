import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendasFechadasViewComponent } from './vendas-fechadas-view.component';

describe('VendasFechadasViewComponent', () => {
  let component: VendasFechadasViewComponent;
  let fixture: ComponentFixture<VendasFechadasViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendasFechadasViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendasFechadasViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
