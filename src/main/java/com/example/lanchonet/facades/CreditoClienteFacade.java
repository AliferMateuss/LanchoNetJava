package com.example.lanchonet.facades;

import com.example.lanchonet.dtos.CreditoClienteDto;
import com.example.lanchonet.dtos.FiltroDto;
import com.example.lanchonet.entidades.*;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class CreditoClienteFacade extends AbstractFacade<CreditoCliente, Long> {

    public CreditoClienteFacade() {
        super(CreditoCliente.class);
    }

    @Transactional
    public CreditoCliente recuperaCreditoPorPessoa(Long id) throws NoResultException {
        List<CreditoCliente> resultados = entityManager.createQuery("from CreditoCliente cc where cc.pessoa.id = :pessoaId", CreditoCliente.class)
                .setParameter("pessoaId", id)
                .getResultList();

        return resultados.isEmpty() ? null : resultados.get(0);
    }

    @Transactional
    public CreditoCliente recuperaCreditoPorId(Long id) throws NoResultException {
        List<CreditoCliente> resultados = entityManager.createQuery("from CreditoCliente cc where cc.id = :id", CreditoCliente.class)
                .setParameter("id", id)
                .getResultList();

        return resultados.isEmpty() ? null : resultados.get(0);
    }

    public List<CreditoClienteDto> findAllDto(){
        return entityManager.createQuery("SELECT new com.example.lanchonet.dtos.CreditoClienteDto(" +
                "c.pessoa.id," +
                "c.pessoa.nome," +
                "c.id," +
                "c.valorTotal" +
                ") FROM CreditoCliente c", CreditoClienteDto.class).getResultList();
    }

    @Transactional
    public List<CreditoClienteDto> creditoRel(FiltroDto filtro){

        String hql = "SELECT new com.example.lanchonet.dtos.CreditoClienteDto(" +
                "                c.pessoa.id," +
                "                c.pessoa.nome," +
                "                c.id,"  +
                "                c.valorTotal" +
                " ) FROM CreditoCliente c ";

        String condicaoExtra = "WHERE 1=1 ";

        if (filtro.getPessoaId() != null ) {
            condicaoExtra += " AND c.pessoa.id = :id ";
        }

        if (condicaoExtra.equals("WHERE 1=1 ")) {
            condicaoExtra = "";
        }

        TypedQuery<CreditoClienteDto> query = entityManager.createQuery(hql + condicaoExtra, CreditoClienteDto.class);

        if (filtro.getPessoaId() != null ) {
            query.setParameter("id", filtro.getPessoaId());
        }

        return query.getResultList();
    }

}
