package com.example.lanchonet.facades;

import com.example.lanchonet.dtos.ContasPagarDto;
import com.example.lanchonet.dtos.ContasReceberDto;
import com.example.lanchonet.dtos.FiltroDto;
import com.example.lanchonet.entidades.ContasAPagar;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public List<ContasAPagar> contasRel(FiltroDto filtro){

        String hql = "SELECT c " +
                " FROM ContasAPagar c ";

        String condicaoExtra = "WHERE 1=1 ";

        if (filtro.getPessoaId() != null ) {
            condicaoExtra += " AND c.fornecedor.id = :id ";
        }

        if (filtro.getDataFim() != null && filtro.getDataInicio() != null) {
            condicaoExtra += " AND c.dataConta BETWEEN :dataInicio AND :dataFim ";
        }

        TypedQuery<ContasAPagar> query = entityManager.createQuery(hql + condicaoExtra, ContasAPagar.class);

        if (filtro.getPessoaId() != null ) {
            query.setParameter("id", filtro.getPessoaId());
        }

        if (filtro.getDataFim() != null && filtro.getDataInicio() != null) {
            query.setParameter("dataInicio", filtro.getDataInicio());
            query.setParameter("dataFim", filtro.getDataFim());
        }

        return query.getResultList();
    }
}
