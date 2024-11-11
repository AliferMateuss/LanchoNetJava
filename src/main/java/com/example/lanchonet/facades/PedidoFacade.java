package com.example.lanchonet.facades;

import com.example.lanchonet.dtos.FiltroDto;
import com.example.lanchonet.dtos.ItemPedidoDto;
import com.example.lanchonet.dtos.PedidoDto;
import com.example.lanchonet.entidades.Compra;
import com.example.lanchonet.entidades.ItensPedido;
import com.example.lanchonet.entidades.Pedido;
import com.example.lanchonet.entidades.Venda;
import jakarta.persistence.TypedQuery;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Repository;

import java.math.BigInteger;
import java.util.List;

@Repository
public class PedidoFacade extends AbstractFacade<Pedido, Long> {

    public PedidoFacade() {
        super(Pedido.class);
    }

    public List<PedidoDto> pedidosAbertos() {
       return entityManager.createQuery("SELECT new com.example.lanchonet.dtos.PedidoDto( " +
                "p.id, " +
                "p.pessoa.id, " +
                "p.mesa.id, " +
                "p.usuario.id, " +
                "concat(CASE WHEN p.pessoa IS NOT NULL THEN p.pessoa.nome ELSE '' END, " +
                "CASE WHEN p.nomeCliente IS NOT NULL THEN p.nomeCliente ELSE '' END), " +
                "p.valorTotal) " +
                "FROM Pedido p LEFT JOIN p.pessoa pessoa " +
                "WHERE p.statusPedido = 'ABERTO' ORDER BY p.id", PedidoDto.class).getResultList();

    }

    public Boolean verificaSeExistePedidosAbertos(){
        Long result = entityManager.createQuery("SELECT COUNT(p.id) FROM Pedido p WHERE  p.statusPedido = 'ABERTO'"
                , Long.class).getSingleResult();

        return result.intValue() > 0;
    }

    public List<PedidoDto> pedidosFechados() {
        return entityManager.createQuery("SELECT new com.example.lanchonet.dtos.PedidoDto( " +
                "p.id, " +
                "p.pessoa.id, " +
                "p.mesa.id, " +
                "p.usuario.id, " +
                "concat(CASE WHEN p.pessoa IS NOT NULL THEN p.pessoa.nome ELSE '' END, " +
                "CASE WHEN p.nomeCliente IS NOT NULL THEN p.nomeCliente ELSE '' END), " +
                "p.valorTotal) " +
                "FROM Pedido p LEFT JOIN p.pessoa pessoa " +
                "WHERE p.statusPedido = 'FECHADO'", PedidoDto.class).getResultList();
    }

    public List<ItemPedidoDto> recuperItensComanda(Long id){
        return entityManager.createQuery("SELECT new com.example.lanchonet.dtos.ItemPedidoDto(" +
                "i.id," +
                "i.precoUnitario," +
                "i.quantidade," +
                "i.subTotal," +
                "i.produto.id," +
                "i.produto.nome" +
                ") from ItensPedido i WHERE i.pedido.id = :id", ItemPedidoDto.class).setParameter("id", id).getResultList();
    }

    public List<Pedido> pedidosRel(FiltroDto filtro) {
        String hql = "SELECT p FROM Pedido p LEFT JOIN p.pessoa pessoa ";

        String condicaoExtra = "WHERE 1=1 ";

        if (filtro.getDataFim() != null && filtro.getDataInicio() != null) {
            condicaoExtra += " AND p.dataPedido BETWEEN :dataInicio AND :dataFim ";
        }

        if (condicaoExtra.equals("WHERE 1=1 ")) {
            condicaoExtra = "";
        }

        TypedQuery<Pedido> query = entityManager.createQuery(hql + condicaoExtra, Pedido.class);

        if (filtro.getDataFim() != null && filtro.getDataInicio() != null) {
            query.setParameter("dataInicio", filtro.getDataInicio());
            query.setParameter("dataFim", filtro.getDataFim());
        }

        return query.getResultList();
    }
}
