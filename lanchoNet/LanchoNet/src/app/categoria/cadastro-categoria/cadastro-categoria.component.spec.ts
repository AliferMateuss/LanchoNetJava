import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroCategoriasComponent } from './cadastro-categoria.component';

describe('CadastroGrupoUsuariosComponent', () => {
  let component: CadastroCategoriasComponent;
  let fixture: ComponentFixture<CadastroCategoriasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CadastroCategoriasComponent]
    });
    fixture = TestBed.createComponent(CadastroCategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
