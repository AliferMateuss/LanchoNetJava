package com.example.lanchonet.facades;

import com.example.lanchonet.dtos.FiltroDto;
import com.example.lanchonet.dtos.ItemCompraDto;
import com.example.lanchonet.dtos.CompraDto;
import com.example.lanchonet.entidades.Compra;
import com.example.lanchonet.entidades.Pessoa;
import com.example.lanchonet.entidades.Venda;
import jakarta.persistence.TypedQuery;
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
                "c.pessoa.razaoSocial, " +
                "c.valorTotal) " +
                "FROM Compra c LEFT JOIN c.pessoa pessoa" +
                " ORDER BY c.id DESC", CompraDto.class).getResultList();
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

    public List<Compra> comprasRel(FiltroDto filtro) {
        String hql = "SELECT c FROM Compra c LEFT JOIN c.pessoa pessoa ";

        String condicaoExtra = "WHERE 1=1 ";

        if (filtro.getDataFim() != null && filtro.getDataInicio() != null) {
            condicaoExtra += " AND c.dataCompra BETWEEN :dataInicio AND :dataFim ";
        }

        if (condicaoExtra.equals("WHERE 1=1 ")) {
            condicaoExtra = "";
        }

        TypedQuery<Compra> query = entityManager.createQuery(hql + condicaoExtra, Compra.class);

        if (filtro.getDataFim() != null && filtro.getDataInicio() != null) {
            query.setParameter("dataInicio", filtro.getDataInicio());
            query.setParameter("dataFim", filtro.getDataFim());
        }

        return query.getResultList();
    }
}
