import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelContasReceberComponent } from './rel-contas-receber.component';

describe('RelContasReceberComponent', () => {
  let component: RelContasReceberComponent;
  let fixture: ComponentFixture<RelContasReceberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelContasReceberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelContasReceberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
