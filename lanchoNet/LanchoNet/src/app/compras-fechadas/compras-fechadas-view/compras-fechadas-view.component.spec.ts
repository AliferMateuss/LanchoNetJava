import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasFechadasViewComponent } from './compras-fechadas-view.component';

describe('ComprasFechadasViewComponent', () => {
  let component: ComprasFechadasViewComponent;
  let fixture: ComponentFixture<ComprasFechadasViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprasFechadasViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprasFechadasViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
