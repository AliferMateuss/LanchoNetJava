package com.example.lanchonet.facades;

import com.example.lanchonet.dtos.ProdutoDto;
import com.example.lanchonet.entidades.GrupoUsuario;
import com.example.lanchonet.entidades.Produto;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ProdutoFacade extends AbstractFacade<Produto, Long>{

    public ProdutoFacade() {
        super(Produto.class);
    }

    public List<ProdutoDto> findAllDto(){
        return entityManager.createQuery("SELECT new  com.example.lanchonet.dtos.ProdutoDto(" +
                " p.id, p.nome, p.preco, p.quantidade)" +
                " FROM Produto p", ProdutoDto.class).getResultList();
    }
}
