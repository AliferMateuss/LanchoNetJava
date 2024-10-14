package com.example.lanchonet.facades;

import com.example.lanchonet.dtos.PedidoDto;
import com.example.lanchonet.entidades.Pedido;
import com.example.lanchonet.entidades.Venda;
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
}
