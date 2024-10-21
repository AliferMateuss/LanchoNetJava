import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelCreditoComponent } from './rel-credito.component';

describe('RelCreditoComponent', () => {
  let component: RelCreditoComponent;
  let fixture: ComponentFixture<RelCreditoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelCreditoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
