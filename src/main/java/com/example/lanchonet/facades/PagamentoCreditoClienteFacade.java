package com.example.lanchonet.facades;

import com.example.lanchonet.entidades.CreditoCliente;
import com.example.lanchonet.entidades.PagamentoCreditoCliente;
import org.springframework.stereotype.Repository;

@Repository
public class PagamentoCreditoClienteFacade extends AbstractFacade<PagamentoCreditoCliente, Long> {

    public PagamentoCreditoClienteFacade() {
        super(PagamentoCreditoCliente.class);
    }
    
}
