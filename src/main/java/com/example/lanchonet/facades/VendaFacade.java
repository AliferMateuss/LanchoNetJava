package com.example.lanchonet.facades;

import com.example.lanchonet.dtos.ItemPedidoDto;
import com.example.lanchonet.dtos.ItemVendaDto;
import com.example.lanchonet.dtos.PedidoDto;
import com.example.lanchonet.dtos.VendaDto;
import com.example.lanchonet.entidades.Usuario;
import com.example.lanchonet.entidades.Venda;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Type;
import java.util.List;

@Repository
public class VendaFacade extends AbstractFacade<Venda, Long> {

    public VendaFacade() {
        super(Venda.class);
    }

    @Transactional
    public void excluiVendaPorPedido(Long id){
        TypedQuery<Venda> q = entityManager.createQuery("DELETE FROM Venda v WHERE v.pedido = :pedido", Venda.class);
        q.setParameter("pedido", id);
        q.executeUpdate();
    }

    public List<VendaDto> vendasFechadas() {
        return entityManager.createQuery("SELECT new com.example.lanchonet.dtos.VendaDto( " +
                "v.id, " +
                "v.pessoa.id, " +
                "v.usuario.id, " +
                "concat(CASE WHEN v.pessoa IS NOT NULL THEN v.pessoa.nome ELSE '' END, " +
                "CASE WHEN v.nomeCliente IS NOT NULL THEN v.nomeCliente ELSE '' END), " +
                "v.valorTotal) " +
                "FROM Venda v LEFT JOIN v.pessoa pessoa " +
                "WHERE v.statusVenda = 'FECHADA'", VendaDto.class).getResultList();
    }

    public List<ItemVendaDto> recuperItensVenda(Long id){
        return entityManager.createQuery("SELECT new com.example.lanchonet.dtos.ItemVendaDto(" +
                "i.id," +
                "i.precoUnitario," +
                "i.quantidade," +
                "i.subTotal," +
                "i.produto.id," +
                "i.produto.nome" +
                ") from ItensVenda i WHERE i.venda.id = :id", ItemVendaDto.class).setParameter("id", id).getResultList();
    }

}
