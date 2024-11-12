package com.example.lanchonet.facades;

import com.example.lanchonet.dtos.CaixaDto;
import com.example.lanchonet.entidades.Caixa;
import com.example.lanchonet.entidades.Mesa;
import com.example.lanchonet.entidades.Venda;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class CaixaFacade extends AbstractFacade<Caixa, Long> {

    public CaixaFacade() {
        super(Caixa.class);
    }


    @Transactional
    public Caixa recuperaCaixaAberto() throws NoResultException {
        return entityManager.createQuery("FROM Caixa c WHERE c.status = 'ABERTO'", Caixa.class).getSingleResult();
    }


    @Transactional
    public CaixaDto recuperaCaixaAbertoDto(){
        return entityManager.createQuery("SELECT new com.example.lanchonet.dtos.CaixaDto(" +
                "c.id," +
                "c.dataAbertura," +
                "c.dataFechamento," +
                "c.valorTotal," +
                "c.valorInicial" +
                ") FROM Caixa c WHERE c.status = 'ABERTO'", CaixaDto.class).getSingleResult();
    }

    @Transactional
    public CaixaDto recuperaCaixaPorId(Long id){
        return entityManager.createQuery("SELECT new com.example.lanchonet.dtos.CaixaDto(" +
                "c.id," +
                "c.dataAbertura," +
                "c.dataFechamento," +
                "c.valorTotal," +
                "c.valorInicial" +
                ") FROM Caixa c WHERE  c.id = " + id, CaixaDto.class).getSingleResult();
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
