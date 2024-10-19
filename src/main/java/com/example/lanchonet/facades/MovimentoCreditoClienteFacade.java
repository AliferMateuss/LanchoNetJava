package com.example.lanchonet.facades;

import com.example.lanchonet.dtos.CreditoClienteDto;
import com.example.lanchonet.dtos.MovimentoCreditoDto;
import com.example.lanchonet.entidades.CreditoCliente;
import com.example.lanchonet.entidades.MovimentoCreditoCliente;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class MovimentoCreditoClienteFacade extends AbstractFacade<MovimentoCreditoCliente, Long> {

    public MovimentoCreditoClienteFacade() {
        super(MovimentoCreditoCliente.class);
    }

    public List<MovimentoCreditoDto> retornaMovimentosPorId(Long id) {
        return entityManager.createQuery("SELECT new com.example.lanchonet.dtos.MovimentoCreditoDto(" +
                "c.id," +
                "c.dataMovimento," +
                "c.valor," +
                "c.venda.id" +
                ")" +
                "FROM MovimentoCreditoCliente c" +
                " WHERE c.creditoCliente.id = :id", MovimentoCreditoDto.class).setParameter("id", id).getResultList();
    }

}
