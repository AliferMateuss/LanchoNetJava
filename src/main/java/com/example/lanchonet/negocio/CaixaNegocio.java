package com.example.lanchonet.negocio;

import com.example.lanchonet.entidades.*;
import com.example.lanchonet.enums.StatusCaixa;
import com.example.lanchonet.enums.TipoMovimentoCaixa;
import com.example.lanchonet.facades.CaixaFacade;
import com.example.lanchonet.facades.MesaFacade;
import com.example.lanchonet.facades.MovimentoCaixaFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class CaixaNegocio {

    @Autowired
    private CaixaFacade facade;
    @Autowired
    private MovimentoCaixaFacade movimentoCaixaFacade;
    private Caixa caixa;
    @Autowired
    private CaixaFacade caixaFacade;


    public void abreCaixa(Caixa caixa){
        caixa.setStatus(StatusCaixa.ABERTO);
        caixa.setDataAbertura(new Date());
        facade.save(caixa);
    }

    public void fechaCaixa(Caixa caixa){
        caixa.setStatus(StatusCaixa.FECHADO);
        caixa.setDataFechamento(new Date());
        facade.save(caixa);
    }

    public void gerarMovimentacao(Venda venda){
        try {
            setCaixa();
            MovimentoCaixa movimentacao = new MovimentoCaixa();
            movimentacao.setVenda(venda);
            venda.setMovimentoCaixa(movimentacao);

            if(venda.getVendaFiado())
                movimentacao.setTipoMovimento(TipoMovimentoCaixa.ENTRADA);
            else
                movimentacao.setTipoMovimento(TipoMovimentoCaixa.FIADO);

            movimentacao.setTipoPagamento(venda.getTipoPagamento());
            movimentacao.setValor(venda.getValorTotal());
            movimentacao.setCaixa(caixa);

            caixa.getMovimentos().add(movimentacao);
            caixaFacade.save(caixa);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void gerarMovimentacao(Compra compra){
        try {
            setCaixa();
            MovimentoCaixa movimentacao = new MovimentoCaixa();
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
            caixaFacade.save(caixa);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
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
