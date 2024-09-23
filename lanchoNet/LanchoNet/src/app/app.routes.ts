import {provideRouter, Routes} from '@angular/router';
import {ComandasComponent} from "./comandas/comandas.component";
import {CounterComponent} from "./counter/counter.component";
import {FetchDataComponent} from "./fetch-data/fetch-data.component";
import {PessoasComponent} from "./pessoas/Cadastro/pessoas.component";
import {ListaPessoasComponent} from "./pessoas/Consulta/lista-pessoas.component";
import {ListaProdutosComponent} from "./produtos/lista-produtos/lista-produtos.component";
import {CadastroProdutosComponent} from "./produtos/cadastro-produtos/cadastro-produtos.component";
import {ListaMesasComponent} from "./mesa/lista-mesas/lista-mesas.component";
import {CadastroMesaComponent} from "./mesa/cadastro-mesa/cadastro-mesa.component";
import {ListaTiposPagamentosComponent} from "./tipo-pagamento/lista-tipos-pagamentos/lista-tipos-pagamentos.component";
import {
  CadastroTiposPagamentosComponent
} from "./tipo-pagamento/cadastro-tipos-pagamentos/cadastro-tipos-pagamentos.component";
import {ListaGrupoUsuariosComponent} from "./grupo-usuarios/lista-grupo-usuarios/lista-grupo-usuarios.component";
import {
  CadastroGrupoUsuariosComponent
} from "./grupo-usuarios/cadastro-grupo-usuarios/cadastro-grupo-usuarios.component";
import {ListaUsuariosComponent} from "./usuarios/lista-usuarios/lista-usuarios.component";
import {CadastroUsuariosComponent} from "./usuarios/cadastro-usuarios/cadastro-usuarios.component";

export const routes: Routes = [
  { path: '', component: ComandasComponent, pathMatch: 'full' },
  { path: 'counter', component: CounterComponent },
  { path: 'fetch-data', component: FetchDataComponent },
  { path: 'cadastroPessoas/:id?', component: PessoasComponent },
  { path: 'listaPessoas', component: ListaPessoasComponent },
  { path: 'listaProdutos', component: ListaProdutosComponent },
  { path: 'cadastroProdutos/:id?', component: CadastroProdutosComponent },
  { path: 'listaMesas', component: ListaMesasComponent },
  { path: 'cadastroMesas/:id?', component: CadastroMesaComponent },
  { path: 'listaTiposPagamento', component: ListaTiposPagamentosComponent },
  { path: 'cadastroTiposPagamento/:id?', component: CadastroTiposPagamentosComponent },
  { path: 'listaGruposUsuarios', component: ListaGrupoUsuariosComponent },
  { path: 'cadastroGruposUsuarios/:id?', component: CadastroGrupoUsuariosComponent },
  { path: 'listaUsuarios', component: ListaUsuariosComponent },
  { path: 'cadastroUsuarios/:id?', component: CadastroUsuariosComponent },
];

export const appRoutingProviders = [
  provideRouter(routes)
];
