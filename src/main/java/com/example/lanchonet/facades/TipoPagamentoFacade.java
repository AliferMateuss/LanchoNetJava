package com.example.lanchonet.facades;

import com.example.lanchonet.entidades.TipoPagamento;
import com.example.lanchonet.entidades.Venda;
import org.springframework.stereotype.Repository;

@Repository
public class TipoPagamentoFacade extends AbstractFacade<TipoPagamento, Long> {

    public TipoPagamentoFacade() {
        super(TipoPagamento.class);
    }
}
