package com.example.lanchonet.facades;

import com.example.lanchonet.entidades.Mesa;
import com.example.lanchonet.entidades.Venda;
import org.springframework.stereotype.Repository;

@Repository
public class MesaFacade extends AbstractFacade<Mesa, Long> {

    public MesaFacade() {
        super(Mesa.class);
    }
}
