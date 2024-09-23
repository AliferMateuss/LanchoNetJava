package com.example.lanchonet.facades;

import com.example.lanchonet.entidades.Compra;
import com.example.lanchonet.entidades.ContasAPagar;
import org.springframework.stereotype.Repository;

@Repository
public class ContaPagarFacade extends AbstractFacade<ContasAPagar, Long>  {

    public ContaPagarFacade() {
        super(ContasAPagar.class);
    }
}
