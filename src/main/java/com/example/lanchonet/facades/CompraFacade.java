package com.example.lanchonet.facades;

import com.example.lanchonet.entidades.Compra;
import com.example.lanchonet.entidades.Pessoa;
import org.springframework.stereotype.Repository;

@Repository
public class CompraFacade extends AbstractFacade<Compra, Long>  {
    public CompraFacade() {
        super(Compra.class);
    }
}
