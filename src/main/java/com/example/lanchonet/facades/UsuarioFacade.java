package com.example.lanchonet.facades;
import com.example.lanchonet.entidades.Produto;
import com.example.lanchonet.entidades.Usuario;
import org.springframework.stereotype.Repository;

@Repository
public class UsuarioFacade extends AbstractFacade<Usuario, Long>{

    public UsuarioFacade() {
        super(Usuario.class);
    }
}
