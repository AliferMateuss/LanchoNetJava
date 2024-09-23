package com.example.lanchonet.facades;

import com.example.lanchonet.entidades.Caixa;
import com.example.lanchonet.entidades.Mesa;
import com.example.lanchonet.entidades.Venda;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class CaixaFacade extends AbstractFacade<Caixa, Long> {

    public CaixaFacade() {
        super(Caixa.class);
    }


    @Transactional
    public Caixa recuperaCaixaAberto(){
        return entityManager.createQuery("FROM Caixa c WHERE c.status = 'ABERTO'", Caixa.class).getSingleResult();
    }


    @Transactional
    public void excluiMovimentacaoPorCompra(Long id){
        TypedQuery<Venda> q = entityManager.createQuery("DELETE FROM Venda v WHERE v.pedido = :pedido", Venda.class);
        q.setParameter("pedido", id);
        q.executeUpdate();
    }

    @Transactional
    public void excluiMovimentacaoPorVenda(Long id){
        TypedQuery<Venda> q = entityManager.createQuery("DELETE FROM Venda v WHERE v.pedido = :pedido", Venda.class);
        q.setParameter("pedido", id);
        q.executeUpdate();
    }
}
