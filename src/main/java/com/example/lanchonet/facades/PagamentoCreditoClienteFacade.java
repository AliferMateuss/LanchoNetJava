package com.example.lanchonet.facades;

import com.example.lanchonet.dtos.MovimentoCreditoDto;
import com.example.lanchonet.dtos.PagamentoCreditoDto;
import com.example.lanchonet.entidades.CreditoCliente;
import com.example.lanchonet.entidades.PagamentoCreditoCliente;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PagamentoCreditoClienteFacade extends AbstractFacade<PagamentoCreditoCliente, Long> {

    public PagamentoCreditoClienteFacade() {
        super(PagamentoCreditoCliente.class);
    }

    public List<PagamentoCreditoDto> retornaPagamentosPorId(Long id) {
        return entityManager.createQuery("SELECT new com.example.lanchonet.dtos.PagamentoCreditoDto(" +
                "c.id," +
                "c.dataMovimento," +
                "c.valor," +
                "c.tipoPagamento.nome" +
                ")" +
                "FROM PagamentoCreditoCliente c" +
                " WHERE c.creditoCliente.id = :id", PagamentoCreditoDto.class).setParameter("id", id).getResultList();
    }
    
}
