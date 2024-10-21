package com.example.lanchonet.facades;

import com.example.lanchonet.dtos.FiltroDto;
import com.example.lanchonet.dtos.PessoaDto;
import com.example.lanchonet.dtos.ProdutoDto;
import com.example.lanchonet.entidades.GrupoUsuario;
import com.example.lanchonet.entidades.Produto;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class ProdutoFacade extends AbstractFacade<Produto, Long>{

    public ProdutoFacade() {
        super(Produto.class);
    }

    public List<ProdutoDto> findAllDto(){
        return entityManager.createQuery("SELECT new  com.example.lanchonet.dtos.ProdutoDto(" +
                " p.id, p.nome, p.categoria.nome, p.preco, p.precoCompra, p.quantidade)" +
                " FROM Produto p", ProdutoDto.class).getResultList();
    }

    @Transactional
    public List<ProdutoDto> findAllDto(FiltroDto filtro){

        String hql = "SELECT new  com.example.lanchonet.dtos.ProdutoDto(" +
                " p.id, p.nome, p.categoria.nome, p.preco, p.precoCompra, p.quantidade)" +
                " FROM Produto p ";

        String condicaoExtra = "WHERE 1=1 ";

        if (filtro.getProdutoId() != null ) {
            condicaoExtra += " AND p.id = :id ";
        }

        if (filtro.getCategoriaId() != null ) {
            condicaoExtra += " AND p.categoria.id = :idC ";
        }

        if (condicaoExtra.equals("WHERE 1=1 ")) {
            condicaoExtra = "";
        }

        TypedQuery<ProdutoDto> query = entityManager.createQuery(hql + condicaoExtra, ProdutoDto.class);

        if (filtro.getProdutoId() != null ) {
            query.setParameter("id", filtro.getProdutoId());
        }

        if (filtro.getCategoriaId() != null ) {
            query.setParameter("idC", filtro.getCategoriaId());
        }

        return query.getResultList();
    }
}
