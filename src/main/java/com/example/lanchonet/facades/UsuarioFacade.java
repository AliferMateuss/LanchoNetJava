package com.example.lanchonet.facades;
import com.example.lanchonet.entidades.Produto;
import com.example.lanchonet.entidades.Usuario;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UsuarioFacade extends AbstractFacade<Usuario, Long>{

    public UsuarioFacade() {
        super(Usuario.class);
    }

    @Override
    public List<Usuario> findAll(){
        return entityManager.createQuery("SELECT new com.example.lanchonet.entidades.Usuario(" +
                "u.id," +
                "u.usuarioNome," +
                "u.grupoUsuario.nome"+
                ") FROM Usuario u").getResultList();
    }
}
