package com.example.lanchonet.facades;

import com.example.lanchonet.dtos.ItemCompraDto;
import com.example.lanchonet.dtos.CompraDto;
import com.example.lanchonet.entidades.Compra;
import com.example.lanchonet.entidades.Pessoa;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CompraFacade extends AbstractFacade<Compra, Long>  {
    public CompraFacade() {
        super(Compra.class);
    }

    public List<CompraDto> comprasFechadas() {
        return entityManager.createQuery("SELECT new com.example.lanchonet.dtos.CompraDto( " +
                "c.id, " +
                "c.pessoa.id, " +
                "c.usuario.id, " +
                "c.pessoa.nome, " +
                "c.valorTotal) " +
                "FROM Compra c LEFT JOIN c.pessoa pessoa", CompraDto.class).getResultList();
    }

    public List<ItemCompraDto> recuperItensCompra(Long id){
        return entityManager.createQuery("SELECT new com.example.lanchonet.dtos.ItemCompraDto(" +
                "i.id," +
                "i.precoUnitario," +
                "i.quantidade," +
                "i.subTotal," +
                "i.produto.id," +
                "i.produto.nome" +
                ") from ItensCompra i WHERE i.compra.id = :id", ItemCompraDto.class).setParameter("id", id).getResultList();
    }
}
