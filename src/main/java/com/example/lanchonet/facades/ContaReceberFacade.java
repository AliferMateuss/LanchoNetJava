package com.example.lanchonet.facades;

import com.example.lanchonet.entidades.ContasAPagar;
import com.example.lanchonet.entidades.ContasAReceber;
import org.springframework.stereotype.Repository;

@Repository
public class ContaReceberFacade extends AbstractFacade<ContasAReceber, Long>  {

    public ContaReceberFacade() {
        super(ContasAReceber.class);
    }
}
