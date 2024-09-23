package com.example.lanchonet.facades;

import com.example.lanchonet.entidades.ContasAReceber;
import com.example.lanchonet.entidades.GrupoUsuario;
import org.springframework.stereotype.Repository;

@Repository
public class GrupoUsuarioFacade extends AbstractFacade<GrupoUsuario, Long>{

    public GrupoUsuarioFacade() {
        super(GrupoUsuario.class);
    }
}
