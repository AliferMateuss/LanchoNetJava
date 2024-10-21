package com.example.lanchonet.negocio;

import com.example.lanchonet.dtos.*;
import com.example.lanchonet.entidades.*;
import com.example.lanchonet.facades.*;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

@Service
public class RelatorioNegocio {
    @Autowired
    private VendaFacade vendaFacade;

    @Autowired
    private CompraFacade compraFacade;

    @Autowired
    private PedidoFacade pedidoFacade;

    @Autowired
    private CreditoClienteFacade creditoClienteFacade;

    @Autowired
    private PessoaFacade pessoaFacade;

    @Autowired
    private ProdutoFacade produtoFacade;

    @Autowired
    private UsuarioFacade  usuarioFacade;

    @Autowired
    private ContaReceberFacade contaReceberFacade;

    @Autowired
    private ContaPagarFacade contaPagarFacade;

    private final String InicioRelatorio = "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"></meta><title>%s</title><style>" +
            "body {font-family: Arial, sans-serif; font-size: 60px; width: 100%; height: 100%;}header {text-align: center;background-color: #333;color: #fff;padding: 20px;}" +
            "h1 {margin: 0;}main {margin: 20px;}table {width: 100%; height: 100%;border-collapse: collapse;}" +
            "table, th, td {border: 1px solid #333;}th, td {padding: 8px;text-align: left;}" +
            "th {background-color: #333;color: #fff;}" +
            ".total-row {font-weight: bold;}</style></head><body><header>";

    private final String TituloRelatorio = "<h1>%s</h1>";
    private final String DataRelatorio = "<p>Periodo: %s</p>";
    private final String CorpoRelatorio = "<img src=\"\" alt=\"Logo da Empresa\"></img></header><main><h2>Dados do Relatório</h2><table><tr>";
    private final String FinalRelatorio = "</table></main></body></html>";

    public String geraRelatorioVendas(FiltroDto filtro) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");

        String dataInicio = sdf.format(filtro.getDataInicio());
        String dataFim = sdf.format(filtro.getDataFim());

        List<Venda> vendas = vendaFacade.vendasRel(filtro);
        StringBuilder relatorio = new StringBuilder(InicioRelatorio);
        relatorio.append(String.format(TituloRelatorio, "Relatório de Vendas"));
        relatorio.append(String.format(DataRelatorio, String.format(" %s - %s", dataInicio, dataFim)));
        relatorio.append(CorpoRelatorio);
        relatorio.append("<th>Data da Venda</th><th>Cliente</th><th>Valor Total</th><th>Status</th><th>Itens da Venda</th></tr>");

        if (vendas != null) {
            for (Venda venda : vendas) {
                Hibernate.initialize(venda.getPessoa());
                Hibernate.initialize(venda.getItensVenda());
                String valorFormatado = formatarValor(venda.getValorTotal());
                relatorio.append(String.format("<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>",
                        venda.getDataVenda(), (venda.getPessoa() != null ? venda.getPessoa().getNome() : venda.getNomeCliente()),
                        valorFormatado, venda.getStatusVenda().getDescricao()));

                int count = 1;
                for (ItensVenda item : venda.getItensVenda()) {
                    String precoUnitarioFormatado = formatarValor(item.getPrecoUnitario());
                    String subtotal = formatarValor(item.getSubTotal());
                    relatorio.append(String.format("<ul><li>Item %d: %d %s - %s  Valor Total: %s</li></ul>",
                            count, item.getQuantidade(), item.getProduto().getNome(), precoUnitarioFormatado, subtotal));
                    count++;
                }
                relatorio.append("</td></tr>");
            }
        }

        relatorio.append(FinalRelatorio);
        return relatorio.toString();
    }

    public String geraRelatorioCompras(FiltroDto filtro) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");

        String dataInicio = sdf.format(filtro.getDataInicio());
        String dataFim = sdf.format(filtro.getDataFim());

        List<Compra> compras = compraFacade.comprasRel(filtro);
        StringBuilder relatorio = new StringBuilder(InicioRelatorio);
        relatorio.append(String.format(TituloRelatorio, "Relatório de Compras"));
        relatorio.append(String.format(DataRelatorio, String.format(" %s - %s", dataInicio, dataFim)));
        relatorio.append(CorpoRelatorio);
        relatorio.append("<th>Data da Venda</th><th>Cliente</th><th>Valor Total</th><th>Itens da Compra</th></tr>");

        if (compras != null) {
            for (Compra compra : compras) {
                Hibernate.initialize(compra.getPessoa());
                Hibernate.initialize(compra.getItensCompra());
                String valorFormatado = formatarValor(compra.getValorTotal());
                relatorio.append(String.format("<tr><td>%s</td><td>%s</td><td>%s</td><td>",
                        compra.getDataCompra(),  compra.getPessoa().getNome() ,
                        valorFormatado));

                int count = 1;
                for (ItensCompra item : compra.getItensCompra()) {
                    String precoUnitarioFormatado = formatarValor(item.getPrecoUnitario());
                    String subtotal = formatarValor(item.getSubTotal());
                    relatorio.append(String.format("<ul><li>Item %d: %d %s - %s  Valor Total: %s</li></ul>",
                            count, item.getQuantidade(), item.getProduto().getNome(), precoUnitarioFormatado, subtotal));
                    count++;
                }
                relatorio.append("</td></tr>");
            }
        }

        relatorio.append(FinalRelatorio);
        return relatorio.toString();
    }


    public String geraRelatorioPedidos(FiltroDto filtro) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");

        String dataInicio = sdf.format(filtro.getDataInicio());
        String dataFim = sdf.format(filtro.getDataFim());

        List<Pedido> pedidos = pedidoFacade.pedidosRel(filtro);
        StringBuilder relatorio = new StringBuilder(InicioRelatorio);
        relatorio.append(String.format(TituloRelatorio, "Relatório de Pedidos"));
        relatorio.append(String.format(DataRelatorio, String.format(" %s - %s", dataInicio, dataFim)));
        relatorio.append(CorpoRelatorio);
        relatorio.append("<th>Data do Pedido</th><th>Cliente</th><th>Valor Total</th><th>Itens de pedido</th></tr>");

        if (pedidos != null) {
            for (Pedido pedido : pedidos) {
                Hibernate.initialize(pedido.getPessoa());
                Hibernate.initialize(pedido.getItensPedido());
                String valorFormatado = formatarValor(pedido.getValorTotal());
                relatorio.append(String.format("<tr><td>%s</td><td>%s</td><td>%s</td><td>",
                        pedido.getDataPedido(), (pedido.getPessoa() != null ? pedido.getPessoa().getNome() : pedido.getNomeCliente()),
                        valorFormatado, pedido.getStatusPedido().getDescricao()));

                int count = 1;
                for (ItensPedido item : pedido.getItensPedido()) {
                    String precoUnitarioFormatado = formatarValor(item.getPrecoUnitario());
                    String subtotal = formatarValor(item.getSubTotal());
                    relatorio.append(String.format("<ul><li>Item %d: %d %s - %s  Valor Total: %s</li></ul>",
                            count, item.getQuantidade(), item.getProduto().getNome(), precoUnitarioFormatado, subtotal));
                    count++;
                }
                relatorio.append("</td></tr>");
            }
        }

        relatorio.append(FinalRelatorio);
        return relatorio.toString();
    }

    public String geraRelatorioCredito(FiltroDto filtro) {

        List<CreditoClienteDto> creditos = creditoClienteFacade.creditoRel(filtro);
        StringBuilder relatorio = new StringBuilder(InicioRelatorio);
        relatorio.append(String.format(TituloRelatorio, "Relatório de Créditos de cliente"));
        relatorio.append(CorpoRelatorio);
        relatorio.append("<th>Nome Cliente</th><th>Total</th></tr>");

        if (creditos != null) {
            for (CreditoClienteDto credito : creditos) {
                String valorFormatado = formatarValor(credito.getValorTotal());
                relatorio.append(String.format("<tr><td>%s</td><td>%s</td></tr>",
                        credito.getNome(), valorFormatado));
            }
        }

        relatorio.append(FinalRelatorio);
        return relatorio.toString();
    }

    public String geraRelPessoas(FiltroDto filtro) {

        List<PessoaDto> pessoas = pessoaFacade.findAllDto(filtro);
        StringBuilder relatorio = new StringBuilder(InicioRelatorio);
        relatorio.append(String.format(TituloRelatorio, "Relatório de Pessoas"));
        relatorio.append(CorpoRelatorio);
        relatorio.append("<th>Nome/RazaoSocial</th><th>Documento</th><th>Tipo de Pessoa</th></tr>");

        if (pessoas != null) {
            for (PessoaDto pessoa : pessoas) {
                relatorio.append(String.format("<tr><td>%s</td><td>%s</td><td>%s</td></tr>",
                        pessoa.getNome(), formatarCpfCnpj(pessoa.getDocumento()), montarTipoPessoa(pessoa)));
            }
        }

        relatorio.append(FinalRelatorio);
        return relatorio.toString();
    }


    public String geraRelProdutos(FiltroDto filtro) {

        List<ProdutoDto> prods = produtoFacade.findAllDto(filtro);
        StringBuilder relatorio = new StringBuilder(InicioRelatorio);
        relatorio.append(String.format(TituloRelatorio, "Relatório de Produtos"));
        relatorio.append(CorpoRelatorio);
        relatorio.append("<th>Produto</th><th>Categoria</th><th>Valor compra</th><th>Valor venda</th> <th>Quantidade</th></tr>");

        if (prods != null) {
            for (ProdutoDto prod : prods) {
                relatorio.append(String.format("<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>",
                        prod.getNome(), prod.getCategoriaNome(), formatarValor(prod.getPrecoCompra()), formatarValor(prod.getPreco()),
                        prod.getQuantidade()));
            }
        }

        relatorio.append(FinalRelatorio);
        return relatorio.toString();
    }

    public String geraRelUsuario(FiltroDto filtro) {

        List<Usuario> usuarios = usuarioFacade.usuariosRel(filtro);
        StringBuilder relatorio = new StringBuilder(InicioRelatorio);
        relatorio.append(String.format(TituloRelatorio, "Relatório de Usuários"));
        relatorio.append(CorpoRelatorio);
        relatorio.append("<th>Login</th><th>Grupo usuário</th><th>Pessoa</th></tr>");

        if (usuarios != null) {
            for (Usuario usu : usuarios) {
                Hibernate.initialize(usu.getPessoa());
                Hibernate.initialize(usu.getGrupoUsuario());
                relatorio.append(String.format("<tr><td>%s</td><td>%s</td><td>%s</td></tr>",
                        usu.getUsuarioNome(), usu.getGrupoUsuario().getNome(), usu.getPessoa().getNome()));
            }
        }

        relatorio.append(FinalRelatorio);
        return relatorio.toString();
    }

    public String geraRelContasPagar(FiltroDto filtro) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");

        String dataInicio = sdf.format(filtro.getDataInicio());
        String dataFim = sdf.format(filtro.getDataFim());
        List<ContasAPagar> contas = contaPagarFacade.contasRel(filtro);
        StringBuilder relatorio = new StringBuilder(InicioRelatorio);
        relatorio.append(String.format(TituloRelatorio, "Relatório de contas a pagar"));
        relatorio.append(String.format(DataRelatorio, String.format(" %s - %s", dataInicio, dataFim)));
        relatorio.append(CorpoRelatorio);
        relatorio.append("<th>Conta</th><th>Fornecedor</th><th>Data Conta</th><th>Data Vencimento</th><th>Data Competencia</th><th>Valor</th><th>Status</th></tr>");

        if (contas != null) {
            for (ContasAPagar conta : contas) {
                Hibernate.initialize(conta.getFornecedor());
                relatorio.append(String.format("<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>",
                        conta.getId().toString(), conta.getFornecedor().getNome(), conta.getDataConta(),
                        conta.getDataVencimento(), conta.getDataCompetencia(), formatarValor(conta.getValor()),
                        conta.getStatus().getDescricao()));
            }
        }

        relatorio.append(FinalRelatorio);
        return relatorio.toString();
    }

    public String geraRelContasReceber(FiltroDto filtro) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");

        String dataInicio = sdf.format(filtro.getDataInicio());
        String dataFim = sdf.format(filtro.getDataFim());
        List<ContasAReceber> contas = contaReceberFacade.contasRel(filtro);
        StringBuilder relatorio = new StringBuilder(InicioRelatorio);
        relatorio.append(String.format(TituloRelatorio, "Relatório de contas a pagar"));
        relatorio.append(String.format(DataRelatorio, String.format(" %s - %s", dataInicio, dataFim)));
        relatorio.append(CorpoRelatorio);
        relatorio.append("<th>Conta</th><th>Fornecedor</th><th>Data Conta</th><th>Data Vencimento</th><th>Data Competencia</th><th>Valor</th><th>Status</th></tr>");

        if (contas != null) {
            for (ContasAReceber conta : contas) {
                Hibernate.initialize(conta.getPessoa());
                relatorio.append(String.format("<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>",
                        conta.getId().toString(), conta.getPessoa().getNome(), conta.getDataConta(),
                        conta.getDataVencimento(), conta.getDataCompetencia(), formatarValor(conta.getValor()),
                        conta.getStatus().getDescricao()));
            }
        }

        relatorio.append(FinalRelatorio);
        return relatorio.toString();
    }

    private String formatarValor(BigDecimal valor) {
        NumberFormat formatador = NumberFormat.getCurrencyInstance(new Locale("pt", "BR"));
        return formatador.format(valor);
    }

    public String formatarCpfCnpj(String valor) {
        String valorLimpo = valor.replaceAll("\\D", "");

        if (valorLimpo.length() == 11) {
            return valorLimpo.replaceAll("(\\d{3})(\\d{3})(\\d{3})(\\d{2})", "$1.$2.$3-$4");
        } else if (valorLimpo.length() == 14) {
            return valorLimpo.replaceAll("(\\d{2})(\\d{3})(\\d{3})(\\d{4})(\\d{2})", "$1.$2.$3/$4-$5");
        } else {
            return valor;
        }
    }

    public String montarTipoPessoa(PessoaDto pessoa) {
        List<String> tipo = new ArrayList<>();

        if (pessoa.getCliente()) {
            tipo.add("Cliente");
        }
        if (pessoa.getFornecedor()) {
            tipo.add("Fornecedor");
        }
        if (pessoa.getFuncionario()) {
            tipo.add("Funcionario");
        }

        return String.join(" | ", tipo);
    }
}
