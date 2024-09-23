package com.example.lanchonet.dtos;

import lombok.Getter;
import lombok.Setter;

public class PessoaDto {
    @Getter
    @Setter
    private Long id;

    @Getter
    @Setter
    private String nome;

    @Getter
    @Setter
    private String documento;

    @Getter
    @Setter
    private Boolean cliente;


    @Getter
    @Setter
    private Boolean fornecedor;

    @Getter
    @Setter
    private Boolean funcionario;

    public PessoaDto(Long id, String nome, String documento, Boolean cliente, Boolean fornecedor, Boolean funcionario) {
        this.id = id;
        this.nome = nome;
        this.documento = documento;
        this.cliente = cliente;
        this.fornecedor = fornecedor;
        this.funcionario = funcionario;
    }
}
