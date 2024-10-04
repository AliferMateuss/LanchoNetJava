package com.example.lanchonet.facades;

import com.example.lanchonet.entidades.Caixa;
import com.example.lanchonet.entidades.CreditoCliente;
import com.example.lanchonet.entidades.Pessoa;
import com.example.lanchonet.entidades.Venda;
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

}
