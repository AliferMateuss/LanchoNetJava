package com.example.lanchonet.facades;

import com.example.lanchonet.entidades.Caixa;
import com.example.lanchonet.entidades.Compra;
import com.example.lanchonet.entidades.MovimentoCaixa;
import com.example.lanchonet.entidades.Venda;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class MovimentoCaixaFacade extends AbstractFacade<MovimentoCaixa, Long> {

    public MovimentoCaixaFacade() {
        super(MovimentoCaixa.class);
    }


    @Transactional
    public void excluiMovimentacaoPorCompra(Compra compra){
        TypedQuery<MovimentoCaixa> q = entityManager.createQuery("DELETE FROM MovimentoCaixa v WHERE v.compra = :compra", MovimentoCaixa.class);
        q.setParameter("compra", compra);
        q.executeUpdate();
    }

    @Transactional
    public void excluiMovimentacaoPorVenda(Venda venda){
        TypedQuery<MovimentoCaixa> q = entityManager.createQuery("DELETE FROM MovimentoCaixa v WHERE v.venda = :venda", MovimentoCaixa.class);
        q.setParameter("venda", venda);
        q.executeUpdate();
    }
}
