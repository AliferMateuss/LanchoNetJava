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
import { VendaComponent } from "./venda/venda.component";
import {CompraComponent} from "./compra/compra.component";
import {ContasAReceberComponent} from "./contas-receber/contas-areceber.component";
import {ContasPagarComponent} from "./contas-pagar/contas-pagar.component";
import {ListaCaixaComponent} from "./caixa/lista-caixa/lista-caixa.component";
import {CadastroCaixaComponent} from "./caixa/cadastro-caixa/cadastro-caixa.component";
import {ListaCategoriasComponent} from "./categoria/lista-categoria/lista-categoria.component";
import {CadastroCategoriasComponent} from "./categoria/cadastro-categoria/cadastro-categoria.component";
import {PedidosComponent} from "./pedidos/pedidos/pedidos.component";
import {
  ComandasFechadasViewComponent
} from "./comandas-fechadas/comandas-fechadas-view/comandas-fechadas-view.component";
import {VendasFechadasComponent} from "./vendas-fechadas/vendas-fechadas.component";
import {VendasFechadasViewComponent} from "./vendas-fechadas/vendas-fechadas-view/vendas-fechadas-view.component";
import {ComprasFechadasComponent} from "./compras-fechadas/compras-fechadas.component";
import {ComprasFechadasViewComponent} from "./compras-fechadas/compras-fechadas-view/compras-fechadas-view.component";
import {ListaCreditoClienteComponent} from "./creditoCliente/lista-credito-cliente/lista-credito-cliente.component";
import {CreditoClienteComponent} from "./creditoCliente/credito-cliente/credito-cliente.component";

export const routes: Routes = [
  { path: '', redirectTo: "/comandas", pathMatch: 'full' },
  { path: 'comandas', component: ComandasComponent, pathMatch: 'full' },
  { path: 'pedidos', component: PedidosComponent, pathMatch: 'full' },
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
  { path: 'listaCaixas', component: ListaCaixaComponent },
  { path: 'cadastroCaixa/:id?', component: CadastroCaixaComponent },
  { path: 'listaCategorias', component: ListaCategoriasComponent },
  { path: 'cadastroCategorias/:id?', component: CadastroCategoriasComponent },
  { path: 'venda', component: VendaComponent },
  { path: 'vendas', component: VendasFechadasComponent },
  { path: 'vendaFechada', component: VendasFechadasViewComponent },
  { path: 'compra', component: CompraComponent },
  { path: 'compras', component: ComprasFechadasComponent },
  { path: 'compraFechada', component: ComprasFechadasViewComponent },
  { path: 'contaReceber', component: ContasAReceberComponent },
  { path: 'contaPagar', component: ContasPagarComponent },
  { path: 'pedidoFechado', component:  ComandasFechadasViewComponent},
  { path: 'listaCreditoCliente', component:  ListaCreditoClienteComponent},
  { path: 'creditoCliente', component:  CreditoClienteComponent},
];

export const appRoutingProviders = [
  provideRouter(routes)
];
