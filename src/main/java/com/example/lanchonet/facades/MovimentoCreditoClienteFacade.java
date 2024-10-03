package com.example.lanchonet.facades;

import com.example.lanchonet.entidades.CreditoCliente;
import com.example.lanchonet.entidades.MovimentoCreditoCliente;
import org.springframework.stereotype.Repository;

@Repository
public class MovimentoCreditoClienteFacade extends AbstractFacade<MovimentoCreditoCliente, Long> {

    public MovimentoCreditoClienteFacade() {
        super(MovimentoCreditoCliente.class);
    }
    
}
