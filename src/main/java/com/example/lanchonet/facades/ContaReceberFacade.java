package com.example.lanchonet.facades;

import com.example.lanchonet.dtos.ContasReceberDto;
import com.example.lanchonet.entidades.ContasAPagar;
import com.example.lanchonet.entidades.ContasAReceber;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ContaReceberFacade extends AbstractFacade<ContasAReceber, Long>  {

    public ContaReceberFacade() {
        super(ContasAReceber.class);
    }

    public List<ContasReceberDto> findAllDto(){
        return entityManager.createQuery("SELECT new com.example.lanchonet.dtos.ContasReceberDto(" +
                "c.id," +
                "c.venda.id," +
                "c.dataCompetencia," +
                "c.dataVencimento," +
                "c.dataConta," +
                "c.parcela," +
                "c.valor," +
                "c.status," +
                "c.pessoa.nome," +
                "c.pessoa.id" +
                ") FROM ContasAReceber c", ContasReceberDto.class).getResultList();
    }
}
