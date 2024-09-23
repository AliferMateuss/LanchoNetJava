package com.example.lanchonet.negocio;

import com.example.lanchonet.entidades.*;
import com.example.lanchonet.enums.*;
import com.example.lanchonet.facades.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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
    private VendaNegocio vendaNegocio;
    private static final String ERRO_ESTOQUE = "Estoque insuficiente para o produto - \n %s!! Quantidade da venda: %d, Quantidade em estoque: %d";

    public void salvarPedido(Pedido pedido){
        try{
            setPessoa(pedido);
            abreFechaMesa(pedido, true);
            setUsuario(pedido);
            pedido.setStatusPedido(StatusPedido.ABERTO);
            validaEstoque(pedido);
            pedidoFacade.save(pedido);
        }catch (Exception e){
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    public Venda fecharPedidoParaPagar(Pedido pedido){
        try{
            setPessoa(pedido);
            abreFechaMesa(pedido, false);
            setUsuario(pedido);
            pedido.setDataFechamentoPedido(null);
            pedido.setStatusPedido(StatusPedido.FECHADO);
            if(pedido.getPedidoPago()){
                pedido.setTipoPedido(TipoPedido.PAGO);
            } else {
                pedido.setTipoPedido(TipoPedido.FIADO);
            }
            pedidoFacade.save(pedido);
            return criaVenda(pedido);
        }catch (Exception e){
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    public void fecharPedidoFiado(Pedido pedido){
        try{
            setPessoa(pedido);
            abreFechaMesa(pedido, false);
            setUsuario(pedido);
            pedido.setDataFechamentoPedido(null);
            pedido.setStatusPedido(StatusPedido.FECHADO);
            if(pedido.getPedidoPago()){
                pedido.setTipoPedido(TipoPedido.PAGO);
            } else {
                pedido.setTipoPedido(TipoPedido.FIADO);
            }
            vendaNegocio.salvarVendaPedido(criaVenda(pedido), true);
            pedidoFacade.save(pedido);
        }catch (Exception e){
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    public void cancelarFechamentoPedido(Pedido pedido){
        try{
            setPessoa(pedido);
            abreFechaMesa(pedido, true);
            setUsuario(pedido);
            pedido.setStatusPedido(StatusPedido.ABERTO);
            pedido.setTipoPedido(null);
            pedido.setPedidoFechado(null);
            pedidoFacade.save(pedido);
        }catch (Exception e){
            throw new RuntimeException(e.getMessage(), e);
        }
    }


    private void validaEstoque(Pedido pedido) throws Exception {
        try{
            pedido.getItensPedido().forEach(item -> {
                if(!item.getItemValidado()){
                    Produto produto = produtoFacade.findById(item.getProdutoId());
                    if (produto != null) {
                        Integer quantidade = 0;
                        if(item.getQuantidadeAnterior() != null && item.getQuantidadeAnterior() <= item.getQuantidade()){
                            quantidade = item.getQuantidade() - item.getQuantidadeAnterior();
                        } else {
                            quantidade = item.getQuantidade();
                        }
                        if (produto.getQuantidade() <= quantidade) {
                            throw new RuntimeException(String.format(ERRO_ESTOQUE, item.getProduto().getNome(), item.getQuantidade(), produto.getQuantidade()));
                        } else {
                            produto.setQuantidade(produto.getQuantidade() - quantidade);
                            item.setItemValidado(true);
                            item.setPedido(pedido);
                        }
                    } else {
                        throw new RuntimeException("Produto inexistente");
                    }
                }
            });
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private void setPessoa(Pedido pedido)throws Exception{
        if(pedido.getId() != null){
            Pessoa pessoa = pessoaFacade.findById(pedido.getPessoaId());
            if(pessoa == null){
                throw new Exception("Cliente não encontrado!");
            }
            pedido.setPessoa(pessoa);
        }
    }


    private void abreFechaMesa(Pedido pedido, Boolean abrir)throws Exception{
        if(pedido.getId() != null){
            Mesa mesa = mesaFacade.findById(pedido.getMesaId());
            if(mesa == null){
                throw new Exception("Mesa não encontrada!");
            }
            mesa.setStatus(abrir ? StatusMesa.ABERTA : StatusMesa.FECHADA);
            pedido.setMesa(mesa);
        } else {
            throw new Exception("Mesa não informada!");
        }
    }

    private void setUsuario(Pedido pedido)throws Exception{
        if(pedido.getId() != null){
            Usuario usuario = usuarioFacade.findById(pedido.getUsuarioId());
            if(usuario == null){
                throw new Exception("Usuário não encontrado!");
            }
            pedido.setUsuario(usuario);
        }
    }

    private Venda criaVenda(Pedido pedido){

        Venda venda = new Venda();
        venda.setDataVenda(pedido.getDataFechamentoPedido());
        venda.setUsuario(pedido.getUsuario());
        venda.setValorTotal(pedido.getValorTotal());
        venda.setPessoa(pedido.getPessoa());
        venda.setNomeCliente(pedido.getNomeCliente());
        venda.setVendaFiado(!pedido.getPedidoPago());

        List<ItensVenda> itensVenda = new ArrayList<>();

        pedido.getItensPedido().forEach(item -> {
            itensVenda.add(criaItensVenda(item, venda));
        });

        venda.setItensVenda(itensVenda);
        venda.setPedido(pedido);
        return venda;
    }

    private ItensVenda criaItensVenda(ItensPedido itemPedido, Venda venda){
        ItensVenda itemVenda = new ItensVenda();
        itemVenda.setProduto(itemPedido.getProduto());
        itemVenda.setQuantidade(itemPedido.getQuantidade());
        itemVenda.setPrecoUnitario(itemPedido.getPrecoUnitario());
        itemVenda.setSubTotal(itemPedido.getSubTotal());
        itemVenda.setVenda(venda);
        return itemVenda;
    }
}