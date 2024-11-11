package com.example.lanchonet.negocio;

import com.example.lanchonet.dtos.ExcluiItemDto;
import com.example.lanchonet.dtos.FechamentoPedidoDto;
import com.example.lanchonet.dtos.ItemPedidoDto;
import com.example.lanchonet.dtos.PedidoDto;
import com.example.lanchonet.entidades.*;
import com.example.lanchonet.enums.*;
import com.example.lanchonet.facades.*;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
public class PedidoNegocio {

    @Autowired
    private PedidoFacade pedidoFacade;
    @Autowired
    private ProdutoFacade produtoFacade;
    @Autowired
    private PessoaFacade pessoaFacade;
    @Autowired
    private MesaFacade mesaFacade;
    @Autowired
    private UsuarioFacade usuarioFacade;
    @Autowired
    private TipoPagamentoFacade tipoPagamentoFacade ;
    @Autowired
    private VendaNegocio vendaNegocio;

    private TipoPagamento tipoPagamento;

    private static final String ERRO_ESTOQUE = "Estoque insuficiente para o produto - \n %s!! Quantidade da venda: %d, Quantidade em estoque: %d";


    public List<PedidoDto> recuperPedidosAbertos() {
        return pedidoFacade.pedidosAbertos();
    }

    public List<PedidoDto> recuperPedidosFechados() {
        return pedidoFacade.pedidosFechados();
    }

    public List<ItemPedidoDto> recuperItensComanda(Long id) {
        return pedidoFacade.recuperItensComanda(id);
    }

    public void salvarPedido(Pedido pedido) {
        try {
            setPessoa(pedido);
            if (pedido.getPessoa() == null && !pedido.getPedidoCliente()) {
                throw new Exception("Cliente não definido para o pedido, selecione o cliente ou clique em pedido balcão");
            }
            abreFechaMesa(pedido, false);
            setUsuario(pedido);
            pedido.setStatusPedido(StatusPedido.ABERTO);
            validaEstoque(pedido);
            pedidoFacade.save(pedido);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    public void excluirPedido(Long id){
        pedidoFacade.deleteById(id);
    }

    public void salvaItemPedido(ItemPedidoDto itemDto) {
        try {
            Produto produto = produtoFacade.findById(itemDto.getProdutoId());
            Pedido pedido = pedidoFacade.findById(itemDto.getIdPedido());

            if (pedido == null) {
                throw new Exception("Pedido não encontrado!");
            }
            if (produto == null) {
                throw new RuntimeException("Produto inexistente");
            }

            if (!Hibernate.isInitialized(pedido.getItensPedido())) {
                Hibernate.initialize(pedido.getItensPedido());
            }

            if (itemDto.getId() != null) {

                ItensPedido itensPedido = pedido.getItensPedido().stream()
                        .filter(item -> Objects.equals(item.getId(), itemDto.getId()))
                        .findFirst()
                        .orElse(null);

                if (itemDto.getQuantidade().compareTo(itensPedido.getQuantidade()) < 0) {
                    Integer qtd = itensPedido.getQuantidade() - itemDto.getQuantidade();
                    BigDecimal totalRmv = itemDto.getSubTotal().subtract(itensPedido.getSubTotal());
                    produto.setQuantidade(produto.getQuantidade() + qtd);
                    itensPedido.setProduto(produto);
                    itensPedido.setQuantidade(itemDto.getQuantidade());
                    itensPedido.setSubTotal(itemDto.getSubTotal());
                    itensPedido.setPrecoUnitario(itemDto.getPrecoUnitario());
                    pedido.setValorTotal(pedido.getValorTotal().subtract(totalRmv));
                    itensPedido.setPedido(pedido);
                } else {
                    Integer qtd = itemDto.getQuantidade() - itensPedido.getQuantidade();
                    BigDecimal totalAdc = itemDto.getSubTotal().subtract(itensPedido.getSubTotal());

                    if(itemDto.getSubTotal().equals(itensPedido.getSubTotal())){
                        totalAdc = BigDecimal.ZERO;
                    }

                    if (produto.getQuantidade() < qtd) {
                        throw new RuntimeException(String.format(ERRO_ESTOQUE, itemDto.getProdutoNome(), itemDto.getQuantidade(), produto.getQuantidade()));
                    } else {
                        produto.setQuantidade(produto.getQuantidade() - qtd);
                        itensPedido.setProduto(produto);
                        itensPedido.setQuantidade(itemDto.getQuantidade());
                        itensPedido.setSubTotal(itemDto.getSubTotal());
                        itensPedido.setPrecoUnitario(itemDto.getPrecoUnitario());
                        pedido.setValorTotal(pedido.getValorTotal().add(totalAdc));
                        itensPedido.setPedido(pedido);
                    }
                }
            } else {
                if (produto.getQuantidade() < itemDto.getQuantidade()) {
                    throw new RuntimeException(String.format(ERRO_ESTOQUE, itemDto.getProdutoNome(), itemDto.getQuantidade(), produto.getQuantidade()));
                } else {
                    produto.setQuantidade(produto.getQuantidade() - itemDto.getQuantidade());
                    ItensPedido itensPedido = new ItensPedido();
                    itensPedido.setProduto(produto);
                    itensPedido.setQuantidade(itemDto.getQuantidade());
                    itensPedido.setSubTotal(itemDto.getSubTotal());
                    itensPedido.setPrecoUnitario(itemDto.getPrecoUnitario());
                    itensPedido.setPedido(pedido);
                    pedido.setValorTotal(pedido.getValorTotal().add(itemDto.getSubTotal()));
                    pedido.getItensPedido().add(itensPedido);
                }
            }
            pedidoFacade.save(pedido);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void excluirItemPedido(ExcluiItemDto dto){
        try{
            Pedido pedido = pedidoFacade.findById(dto.getIdPedido());

            if (pedido == null) {
                throw new Exception("Pedido não encontrado!");
            }

            if (!Hibernate.isInitialized(pedido.getItensPedido())) {
                Hibernate.initialize(pedido.getItensPedido());
            }

            ItensPedido itensPedido = pedido.getItensPedido().stream()
                    .filter(item -> Objects.equals(item.getId(), dto.getId()))
                    .findFirst()
                    .orElse(null);

            pedido.setValorTotal(pedido.getValorTotal().subtract(itensPedido.getSubTotal()));
            pedido.getItensPedido().remove(itensPedido);
            pedidoFacade.save(pedido);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void fecharPedido(FechamentoPedidoDto dto){
        try{
            Pedido pedido = pedidoFacade.findById(dto.getId());
            pedido.setMesaId(dto.getIdMesa());
            pedido.setPessoaId(dto.getIdPessoa());
            pedido.setParcelas(dto.getParcelas());
            setTipoPagamento(dto.getIdTipoPagamento());
            abreFechaMesa(pedido, true);

            if (!Hibernate.isInitialized(pedido.getItensPedido())) {
                Hibernate.initialize(pedido.getItensPedido());
            }

            if(dto.getPedidoFiado()){
                fecharPedidoFiado(pedido);
            } else {
                fecharPedidoPago(pedido);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void fecharPedidoPago(Pedido pedido) {
        try {
            setPessoa(pedido);
            setUsuario(pedido);
            pedido.setPedidoPago(true);
            pedido.setDataFechamentoPedido(new Date());
            pedido.setStatusPedido(StatusPedido.FECHADO);
            pedido.setTipoPedido(TipoPedido.PAGO);
            Venda venda = criaVenda(pedido);
            venda.setPedido(pedido);
            vendaNegocio.salvarVendaPedido(venda);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    public void fecharPedidoFiado(Pedido pedido) {
        try {
            setPessoa(pedido);
            setUsuario(pedido);
            pedido.setPedidoPago(false);
            pedido.setDataFechamentoPedido(new Date());
            pedido.setStatusPedido(StatusPedido.FECHADO);
            pedido.setTipoPedido(TipoPedido.FIADO);
            Venda venda = criaVenda(pedido);
            venda.setPedido(pedido);
            vendaNegocio.salvarVendaPedido(venda);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    public void cancelarFechamentoPedido(Pedido pedido) {
        try {
            setPessoa(pedido);
            abreFechaMesa(pedido, true);
            setUsuario(pedido);
            pedido.setStatusPedido(StatusPedido.ABERTO);
            pedido.setTipoPedido(null);
            pedido.setPedidoFechado(false);
            pedidoFacade.save(pedido);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }


    private void validaEstoque(Pedido pedido) throws Exception {
        try {
            pedido.getItensPedido().forEach(item -> {
                Produto produto = produtoFacade.findById(item.getProdutoId());
                if (produto != null) {
                    if (produto.getQuantidade() <= item.getQuantidade()) {
                        throw new RuntimeException(String.format(ERRO_ESTOQUE, produto.getNome(), item.getQuantidade(), produto.getQuantidade()));
                    } else {
                        produto.setQuantidade(produto.getQuantidade() - item.getQuantidade());
                        item.setProduto(produto);
                        item.setPedido(pedido);
                    }
                } else {
                    throw new RuntimeException("Produto inexistente");
                }
            });
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private void setPessoa(Pedido pedido) throws Exception {
        if (pedido.getPessoaId() != null) {
            Pessoa pessoa = pessoaFacade.findById(pedido.getPessoaId());
            if (pessoa == null) {
                throw new Exception("Cliente não encontrado!");
            }
            pedido.setPessoa(pessoa);
        }
    }


    private void abreFechaMesa(Pedido pedido, Boolean abrir) throws Exception {
        if (pedido.getMesaId() != null) {
            Mesa mesa = mesaFacade.findById(pedido.getMesaId());
            if (mesa == null) {
                throw new Exception("Mesa não encontrada!");
            }
            mesa.setStatus(abrir ? StatusMesa.ABERTA : StatusMesa.FECHADA);
            pedido.setMesa(mesa);
        } else {
            throw new Exception("Mesa não informada!");
        }
    }

    private void setUsuario(Pedido pedido) throws Exception {
        pedido.setUsuarioId(1L);
        if (pedido.getUsuarioId() != null) {
            Usuario usuario = usuarioFacade.findById(pedido.getUsuarioId());
            if (usuario == null) {
                throw new Exception("Usuário não encontrado!");
            }
            pedido.setUsuario(usuario);
        }
    }

    private void setTipoPagamento(Long id) throws Exception {
        if (id != null) {
             tipoPagamento = tipoPagamentoFacade.findById(id);
            if (tipoPagamento == null) {
                throw new Exception("Tipo pagamento não encontrado!");
            }
        }
    }

    private Venda criaVenda(Pedido pedido) {

        Venda venda = new Venda();
        venda.setDataVenda(pedido.getDataFechamentoPedido());
        venda.setUsuario(pedido.getUsuario());
        venda.setValorTotal(pedido.getValorTotal());
        venda.setPessoa(pedido.getPessoa());
        venda.setNomeCliente(pedido.getNomeCliente());
        venda.setVendaFiado(!pedido.getPedidoPago());
        venda.setTipoPagamento(tipoPagamento);
        venda.setParcelas(pedido.getParcelas());

        List<ItensVenda> itensVenda = new ArrayList<>();

        pedido.getItensPedido().forEach(item -> {
            itensVenda.add(criaItensVenda(item, venda));
        });

        venda.setItensVenda(itensVenda);
        venda.setPedido(pedido);
        return venda;
    }

    private ItensVenda criaItensVenda(ItensPedido itemPedido, Venda venda) {
        ItensVenda itemVenda = new ItensVenda();
        itemVenda.setProduto(itemPedido.getProduto());
        itemVenda.setQuantidade(itemPedido.getQuantidade());
        itemVenda.setPrecoUnitario(itemPedido.getPrecoUnitario());
        itemVenda.setSubTotal(itemPedido.getSubTotal());
        itemVenda.setVenda(venda);
        return itemVenda;
    }
}