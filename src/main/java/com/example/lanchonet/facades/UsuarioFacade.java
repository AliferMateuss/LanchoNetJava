package com.example.lanchonet.facades;
import com.example.lanchonet.dtos.FiltroDto;
import com.example.lanchonet.dtos.ProdutoDto;
import com.example.lanchonet.entidades.Produto;
import com.example.lanchonet.entidades.Usuario;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

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
                ") FROM Usuario u", Usuario.class).getResultList();
    }

    @Transactional
    public List<Usuario> usuariosRel(FiltroDto filtro){

        String hql = "SELECT u " +
                " FROM Usuario u ";

        String condicaoExtra = "WHERE 1=1 ";

        if (filtro.getGrupoUsuarioId() != null ) {
            condicaoExtra += " AND u.grupoUsuario.id = :id ";
        }

        TypedQuery<Usuario> query = entityManager.createQuery(hql + condicaoExtra, Usuario.class);

        if (filtro.getGrupoUsuarioId() != null ) {
            query.setParameter("id", filtro.getGrupoUsuarioId());
        }

        return query.getResultList();
    }
}
