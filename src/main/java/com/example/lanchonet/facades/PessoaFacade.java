package com.example.lanchonet.facades;

import com.example.lanchonet.dtos.CreditoClienteDto;
import com.example.lanchonet.dtos.FiltroDto;
import com.example.lanchonet.dtos.PessoaDto;
import com.example.lanchonet.entidades.Pessoa;
import jakarta.persistence.TypedQuery;
import lombok.Getter;
import lombok.Setter;
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
        return entityManager.createQuery("SELECT new com.example.lanchonet.dtos.PessoaDto(p.id, " +
                "concat(CASE WHEN p.nome IS NOT NULL THEN p.nome ELSE '' END, CASE WHEN p.razaoSocial IS NOT NULL THEN p.razaoSocial ELSE '' END)," +
                " concat(CASE WHEN p.cpf IS NOT NULL THEN p.cpf ELSE '' END, CASE WHEN p.cnpj IS NOT NULL THEN p.cnpj ELSE '' END) , p.cliente, " +
                "p.fornecedor, p.funcionario) from Pessoa p ", PessoaDto.class).getResultList();
    }

    @Transactional
    public List<PessoaDto> findAllDto(FiltroDto filtro){

        String hql = "SELECT new com.example.lanchonet.dtos.PessoaDto(p.id, " +
                "concat(CASE WHEN p.nome IS NOT NULL THEN p.nome ELSE '' END, CASE WHEN p.razaoSocial IS NOT NULL THEN p.razaoSocial ELSE '' END)," +
                " concat(CASE WHEN p.cpf IS NOT NULL THEN p.cpf ELSE '' END, CASE WHEN p.cnpj IS NOT NULL THEN p.cnpj ELSE '' END) , p.cliente, " +
                "p.fornecedor, p.funcionario) from Pessoa p  ";

        String condicaoExtra = "WHERE 1=1 ";

        if (filtro.getCliente()) {
            condicaoExtra += " AND p.cliente = :cliente ";
        }

        if (filtro.getFornecedor()) {
            condicaoExtra += " AND p.fornecedor = :fornecedor ";
        }

        if (filtro.getFuncionario()) {
            condicaoExtra += " AND p.funcionario = :funcionario ";
        }

        if (condicaoExtra.equals("WHERE 1=1 ")) {
            condicaoExtra = "";
        }

        TypedQuery<PessoaDto> query = entityManager.createQuery(hql + condicaoExtra, PessoaDto.class);

        if (filtro.getCliente()) {
            query.setParameter("cliente", filtro.getCliente());
        }

        if (filtro.getFornecedor()) {
            query.setParameter("fornecedor", filtro.getFornecedor());
        }

        if (filtro.getFuncionario()) {
            query.setParameter("funcionario", filtro.getFuncionario());
        }

        return query.getResultList();
    }
}
