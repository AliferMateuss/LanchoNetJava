package com.example.lanchonet.negocio;

import com.example.lanchonet.dtos.PessoaDto;
import com.example.lanchonet.entidades.Cidade;
import com.example.lanchonet.entidades.Pessoa;
import com.example.lanchonet.facades.CidadeFacade;
import com.example.lanchonet.facades.PessoaFacade;
import jakarta.persistence.EntityNotFoundException;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PessoaNegocio {
    @Autowired
    private PessoaFacade facade;

    @Autowired
    private CidadeFacade cidadeFacade;

    public void salvarPessoa(Pessoa pessoa) {
        ajustaEndereco(pessoa);
        facade.save(pessoa);
    }

    public Pessoa buscarPessoaPorId(Long id) {
        Pessoa pessoa =  facade.findById(id);
        ajustaRetornoEndereco(pessoa);
        return  pessoa;
    }

    public List<PessoaDto> buscarPessoas() {
        return facade.findAllDto();
    }

    public void excluirPessoa(Pessoa pessoa) {
        facade.delete(pessoa);
    }

    public void excluirPessoa(Long id) {
        facade.deleteById(id);
    }

    private void ajustaEndereco(Pessoa pessoa) {
        try {
            if (pessoa.getEnderecos() != null) {
                pessoa.getEnderecos().forEach(endereco -> {
                    endereco.setPessoa(pessoa);
                    Cidade cidade = cidadeFacade.findById(endereco.getIdCidade());
                    if (cidade == null) {
                        throw new EntityNotFoundException("Cidade não encontrada: " + endereco.getIdCidade());
                    } else {
                        endereco.setCidade(cidade);
                    }
                });
            }
        } catch (EntityNotFoundException e) {
            System.out.println("Erro ao buscar cidade:" + e.getMessage());
        } catch (Exception e) {
            System.out.println("Erro inesperado ao ajustar endereços: {}" + e.getMessage());
        }
    }

    private void ajustaRetornoEndereco(Pessoa pessoa) {
        try {
            if (pessoa.getEnderecos() != null) {
                pessoa.getEnderecos().forEach(endereco -> {
                    Hibernate.initialize(endereco.getCidade());
                    endereco.setIdCidade(endereco.getCidade().getId());
                    endereco.setCidadeNome(endereco.getCidade().getNome());
                    Hibernate.initialize(endereco.getCidade().getEstado());
                    endereco.setIdEstado(endereco.getCidade().getEstado().getId());
                });
            }
        } catch (Exception e) {
            System.out.println("Erro inesperado ao ajustar endereços: {}" + e.getMessage());
        }
    }
}
