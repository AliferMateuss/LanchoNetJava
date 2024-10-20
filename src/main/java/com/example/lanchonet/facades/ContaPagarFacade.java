package com.example.lanchonet.facades;

import com.example.lanchonet.dtos.ContasPagarDto;
import com.example.lanchonet.entidades.ContasAPagar;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ContaPagarFacade extends AbstractFacade<ContasAPagar, Long>  {

    public ContaPagarFacade() {
        super(ContasAPagar.class);
    }

    public List<ContasPagarDto> findAllDto(){
        return entityManager.createQuery("SELECT new com.example.lanchonet.dtos.ContasPagarDto(" +
                "c.id," +
                "c.compra.id," +
                "c.dataCompetencia," +
                "c.dataVencimento," +
                "c.dataConta," +
                "c.parcela," +
                "c.valor," +
                "c.status," +
                "c.fornecedor.nome," +
                "c.fornecedor.id" +
                ") FROM ContasAPagar c", ContasPagarDto.class).getResultList();
    }
}
