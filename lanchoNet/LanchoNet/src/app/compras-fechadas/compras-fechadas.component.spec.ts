import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasFechadasComponent } from './compras-fechadas.component';

describe('ComprasFechadasComponent', () => {
  let component: ComprasFechadasComponent;
  let fixture: ComponentFixture<ComprasFechadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprasFechadasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprasFechadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
