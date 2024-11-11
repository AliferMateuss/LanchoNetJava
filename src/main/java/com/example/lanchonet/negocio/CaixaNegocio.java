package com.example.lanchonet.negocio;

import com.example.lanchonet.dtos.CaixaDto;
import com.example.lanchonet.dtos.MovimentoCaixaDto;
import com.example.lanchonet.entidades.*;
import com.example.lanchonet.enums.StatusCaixa;
import com.example.lanchonet.enums.TipoMovimentoCaixa;
import com.example.lanchonet.facades.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Service
public class CaixaNegocio {

    @Autowired
    private CaixaFacade facade;
    @Autowired
    private MovimentoCaixaFacade movimentoCaixaFacade;
    @Autowired
    private VendaFacade vendaFacade;
    @Autowired
    private CompraFacade compraFacade;
    @Autowired
    private PedidoFacade pedidoFacade;

    private Caixa caixa;

    public void abreCaixa(Caixa caixa){
        caixa.setStatus(StatusCaixa.ABERTO);
        caixa.setDataAbertura(new Date());
        caixa.setValorTotal(caixa.getValorInicial());
        facade.save(caixa);
    }

    public void fechaCaixa(Long id){
        try {
            Caixa caixa = facade.findById(id);

            if(caixa == null){
                throw new Exception("Caixa não encontrado");
            }

            if(pedidoFacade.verificaSeExistePedidosAbertos()){
                throw new Exception("Existem pedidos abertos!");
            }

            caixa.setStatus(StatusCaixa.FECHADO);
            caixa.setDataFechamento(new Date());
            facade.save(caixa);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void excluirCaixa(Long id){
        try {
            facade.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public Caixa buscarCaixaPorId(Long id) {
        return facade.findById(id);
    }

    public List<Caixa> buscarCaixas() {
        return facade.findAll();
    }

    public List<MovimentoCaixaDto> buscarMovimentoCaixaPorId(Long id) {
        return  movimentoCaixaFacade.retornaMovimentoPorId(id);
    }

    public CaixaDto retornaCaixaAberto(){
        CaixaDto dto = facade.recuperaCaixaAbertoDto();
        dto.setMovimentos(movimentoCaixaFacade.retornaMovimentoPorId(dto.getId()));
        return dto;
    }

    public CaixaDto retornaMovimentosPorId(Long id) {
        CaixaDto dto = facade.recuperaCaixaPorId(id);
        dto.setMovimentos(movimentoCaixaFacade.retornaMovimentoPorId(dto.getId()));
        return dto;
    }

    public void gerarMovimentacao(Venda venda){
        try {
            setCaixa();
            MovimentoCaixa movimentacao = new MovimentoCaixa();
            movimentacao.setVenda(venda);
            movimentacao.setDataMovimento(new Date());
            venda.setMovimentoCaixa(movimentacao);

            if(venda.getVendaFiado())
                movimentacao.setTipoMovimento(TipoMovimentoCaixa.FIADO);
            else
                movimentacao.setTipoMovimento(TipoMovimentoCaixa.ENTRADA);

            movimentacao.setTipoPagamento(venda.getTipoPagamento());
            movimentacao.setValor(venda.getValorTotal());
            movimentacao.setCaixa(caixa);

            caixa.getMovimentos().add(movimentacao);
            geraValorTotal();
            facade.save(caixa);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void gerarMovimentacao(Compra compra){
        try {
            setCaixa();
            MovimentoCaixa movimentacao = new MovimentoCaixa();
            movimentacao.setDataMovimento(new Date());
            movimentacao.setCompra(compra);
            compra.setMovimentoCaixa(movimentacao);

            if(compra.getTipoPagamento().getAVista())
                movimentacao.setTipoMovimento(TipoMovimentoCaixa.SAIDA);
            else
                movimentacao.setTipoMovimento(TipoMovimentoCaixa.FORNECEDOR);

            movimentacao.setTipoPagamento(compra.getTipoPagamento());
            movimentacao.setValor(compra.getValorTotal());
            movimentacao.setCaixa(caixa);

            caixa.getMovimentos().add(movimentacao);
            geraValorTotal();
            facade.save(caixa);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void gerarMovimentacao(ContasAReceber conta){
        try {
            setCaixa();
            MovimentoCaixa movimentacao = new MovimentoCaixa();

            Venda venda = vendaFacade.findById(conta.getVendaId());

            if(venda == null)
                throw new Exception("Venda não encontrada!");

            movimentacao.setDataMovimento(new Date());
            movimentacao.setContasAReceber(conta);
            conta.setMovimentoCaixa(movimentacao);
            movimentacao.setTipoMovimento(TipoMovimentoCaixa.ENTRADA);

            movimentacao.setTipoPagamento(conta.getTipoPagamento());
            movimentacao.setValor(conta.getValor());
            movimentacao.setCaixa(caixa);

            caixa.getMovimentos().add(movimentacao);
            geraValorTotal();
            facade.save(caixa);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void gerarMovimentacao(ContasAPagar conta){
        try {
            setCaixa();
            MovimentoCaixa movimentacao = new MovimentoCaixa();
            Compra compra = compraFacade.findById(conta.getCompraId());

            if(compra == null)
                throw new Exception("Compra não encontrada!");

            movimentacao.setDataMovimento(new Date());
            movimentacao.setContasAPagar(conta);
            conta.setMovimentoCaixa(movimentacao);
            movimentacao.setTipoMovimento(TipoMovimentoCaixa.SAIDA);
            movimentacao.setTipoPagamento(conta.getTipoPagamento());
            movimentacao.setValor(conta.getValor());
            movimentacao.setCaixa(caixa);

            caixa.getMovimentos().add(movimentacao);
            geraValorTotal();
            facade.save(caixa);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void geraValorTotal(){
        BigDecimal valorTotal = BigDecimal.ZERO;

        for (MovimentoCaixa mov : caixa.getMovimentos()) {
            if(mov.getTipoMovimento().equals(TipoMovimentoCaixa.ENTRADA)){
                valorTotal = valorTotal.add(mov.getValor());
            } else if (mov.getTipoMovimento().equals(TipoMovimentoCaixa.SAIDA)) {
                valorTotal = valorTotal.subtract(mov.getValor());
            }
        }

        caixa.setValorTotal(valorTotal);
    }

    public void apagarMovimentacaoVenda(Venda venda){
        movimentoCaixaFacade.excluiMovimentacaoPorVenda(venda);
    }

    public void apagarMovimentacaoCompra(Compra compra){
        movimentoCaixaFacade.excluiMovimentacaoPorCompra(compra);
    }

    private void setCaixa()throws Exception{
            caixa = facade.recuperaCaixaAberto();
            if(caixa == null)
                throw new Exception("Nenhum caixa aberto!");
    }
}
