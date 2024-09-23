package com.example.lanchonet.facades;

import com.example.lanchonet.entidades.Usuario;
import com.example.lanchonet.entidades.Venda;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Type;

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

}
