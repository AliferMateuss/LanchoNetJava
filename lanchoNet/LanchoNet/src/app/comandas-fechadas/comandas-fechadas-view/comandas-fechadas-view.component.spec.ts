import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComandasFechadasViewComponent } from './comandas-fechadas-view.component';

describe('ComandasFechadasViewComponent', () => {
  let component: ComandasFechadasViewComponent;
  let fixture: ComponentFixture<ComandasFechadasViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComandasFechadasViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComandasFechadasViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
