package com.example.lanchonet.facades;

import com.example.lanchonet.entidades.Categoria;
import com.example.lanchonet.entidades.GrupoUsuario;
import org.springframework.stereotype.Repository;

@Repository
public class CategoriaFacade extends AbstractFacade<Categoria, Long>{

    public CategoriaFacade() {
        super(Categoria.class);
    }
}
