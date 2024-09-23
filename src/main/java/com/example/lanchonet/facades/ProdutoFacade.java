package com.example.lanchonet.facades;

import com.example.lanchonet.entidades.GrupoUsuario;
import com.example.lanchonet.entidades.Produto;
import org.springframework.stereotype.Repository;

@Repository
public class ProdutoFacade extends AbstractFacade<Produto, Long>{

    public ProdutoFacade() {
        super(Produto.class);
    }
}
