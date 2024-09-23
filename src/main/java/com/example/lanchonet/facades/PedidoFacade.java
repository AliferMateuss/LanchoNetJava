package com.example.lanchonet.facades;

import com.example.lanchonet.entidades.Pedido;
import com.example.lanchonet.entidades.Venda;
import org.springframework.stereotype.Repository;

@Repository
public class PedidoFacade extends AbstractFacade<Pedido, Long> {

    public PedidoFacade() {
        super(Pedido.class);
    }
}
