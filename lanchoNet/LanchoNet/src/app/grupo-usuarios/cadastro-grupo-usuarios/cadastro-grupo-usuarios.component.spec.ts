import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroGrupoUsuariosComponent } from './cadastro-grupo-usuarios.component';

describe('CadastroGrupoUsuariosComponent', () => {
  let component: CadastroGrupoUsuariosComponent;
  let fixture: ComponentFixture<CadastroGrupoUsuariosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CadastroGrupoUsuariosComponent]
    });
    fixture = TestBed.createComponent(CadastroGrupoUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
