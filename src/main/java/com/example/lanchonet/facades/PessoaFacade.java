package com.example.lanchonet.facades;

import com.example.lanchonet.dtos.PessoaDto;
import com.example.lanchonet.entidades.Pessoa;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class PessoaFacade extends AbstractFacade<Pessoa, Long> {

    public PessoaFacade() {
        super(Pessoa.class);
    }

    @Transactional
    public List<PessoaDto> findAllDto(){
        return entityManager.createQuery("SELECT new com.example.lanchonet.dtos.PessoaDto(p.id, p.nome," +
                " concat(CASE WHEN p.cpf IS NOT NULL THEN p.cpf ELSE '' END, CASE WHEN p.cnpj IS NOT NULL THEN p.cnpj ELSE '' END) , p.cliente, " +
                "p.fornecedor, p.funcionario) from Pessoa p ", PessoaDto.class).getResultList();
    }
}
