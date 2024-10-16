package com.example.lanchonet.facades;

import com.example.lanchonet.dtos.ItemPedidoDto;
import com.example.lanchonet.dtos.PedidoDto;
import com.example.lanchonet.entidades.ItensPedido;
import com.example.lanchonet.entidades.Pedido;
import com.example.lanchonet.entidades.Venda;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PedidoFacade extends AbstractFacade<Pedido, Long> {

    public PedidoFacade() {
        super(Pedido.class);
    }

    public List<PedidoDto> pedidosAbertos() {
       return entityManager.createQuery("SELECT new com.example.lanchonet.dtos.PedidoDto( " +
                "p.id, " +
                "concat(CASE WHEN p.pessoa IS NOT NULL THEN p.pessoa.nome ELSE '' END, " +
                "CASE WHEN p.nomeCliente IS NOT NULL THEN p.nomeCliente ELSE '' END), " +
                "p.valorTotal) " +
                "FROM Pedido p LEFT JOIN p.pessoa pessoa " +
                "WHERE p.statusPedido = 'ABERTO'", PedidoDto.class).getResultList();

    }

    public List<PedidoDto> pedidosFechados() {
        return entityManager.createQuery("SELECT new com.example.lanchonet.dtos.PedidoDto( " +
                "p.id, " +
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
}
