import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContasAReceberComponent } from './contas-areceber.component';

describe('ContasAReceberComponent', () => {
  let component: ContasAReceberComponent;
  let fixture: ComponentFixture<ContasAReceberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContasAReceberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContasAReceberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
