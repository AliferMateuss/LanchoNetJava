package com.example.lanchonet.facades;

import com.example.lanchonet.dtos.ContasReceberDto;
import com.example.lanchonet.dtos.FiltroDto;
import com.example.lanchonet.entidades.ContasAPagar;
import com.example.lanchonet.entidades.ContasAReceber;
import com.example.lanchonet.entidades.Usuario;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public List<ContasAReceber> contasRel(FiltroDto filtro){

        String hql = "SELECT c " +
                " FROM ContasAReceber c ";

        String condicaoExtra = "WHERE 1=1 ";

        if (filtro.getPessoaId() != null ) {
            condicaoExtra += " AND c.pessoa.id = :id ";
        }

        if (filtro.getDataFim() != null && filtro.getDataInicio() != null) {
            condicaoExtra += " AND c.dataConta BETWEEN :dataInicio AND :dataFim ";
        }

        TypedQuery<ContasAReceber> query = entityManager.createQuery(hql + condicaoExtra, ContasAReceber.class);

        if (filtro.getPessoaId() != null) {
            query.setParameter("id", filtro.getPessoaId());
        }

        if (filtro.getDataFim() != null && filtro.getDataInicio() != null) {
            query.setParameter("dataInicio", filtro.getDataInicio());
            query.setParameter("dataFim", filtro.getDataFim());
        }

        return query.getResultList();
    }
}
