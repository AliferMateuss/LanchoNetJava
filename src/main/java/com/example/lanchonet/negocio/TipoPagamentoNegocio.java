package com.example.lanchonet.negocio;

import com.example.lanchonet.entidades.TipoPagamento;
import com.example.lanchonet.facades.TipoPagamentoFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TipoPagamentoNegocio {

    @Autowired
    private TipoPagamentoFacade facade;

    public void salvarTipoPagamento(TipoPagamento tipoPagamento) {
        facade.save(tipoPagamento);
    }

    public TipoPagamento buscarTipoPagamentoPorId(Long id) {
        return facade.findById(id);
    }

    public List<TipoPagamento> buscarTipoPagamentos() {
        return facade.findAll();
    }

    public void excluirTipoPagamento(TipoPagamento tipoPagamento) {
        facade.delete(tipoPagamento);
    }

    public void excluirTipoPagamento(Long id) {
        facade.deleteById(id);
    }
}
