package com.example.lanchonet.negocio;

import com.example.lanchonet.entidades.GrupoUsuario;
import com.example.lanchonet.facades.GrupoUsuarioFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GrupoUsuarioNegocio {

    @Autowired
    private GrupoUsuarioFacade facade;

    public void salvarGrupoUsuario(GrupoUsuario grupoUsuario) {
        facade.save(grupoUsuario);
    }

    public GrupoUsuario buscarGrupoUsuarioPorId(Long id) {
        return facade.findById(id);
    }

    public List<GrupoUsuario> buscarGrupoUsuarios() {
        return facade.findAll();
    }

    public void excluirGrupoUsuario(GrupoUsuario grupoUsuario) {
        facade.delete(grupoUsuario);
    }

    public void excluirGrupoUsuario(Long id) {
        facade.deleteById(id);
    }
}
