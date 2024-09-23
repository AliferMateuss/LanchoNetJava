package com.example.lanchonet.negocio;

import com.example.lanchonet.entidades.Usuario;
import com.example.lanchonet.facades.UsuarioFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioNegocio {

    @Autowired
    private UsuarioFacade facade;

    public void salvarUsuario(Usuario usuario) {
        facade.save(usuario);
    }

    public Usuario buscarUsuarioPorId(Long id) {
        return facade.findById(id);
    }

    public List<Usuario> buscarUsuarios() {
        return facade.findAll();
    }

    public void excluirUsuario(Usuario usuario) {
        facade.delete(usuario);
    }

    public void excluirUsuario(Long id) {
        facade.deleteById(id);
    }
}
