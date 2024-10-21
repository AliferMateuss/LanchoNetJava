package com.example.lanchonet.dtos;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

public class ProdutoDto {

    @Getter
    @Setter
    private Long id;

    @Getter
    @Setter
    private String nome;

    @Getter
    @Setter
    private String categoriaNome;

    @Getter
    @Setter
    private BigDecimal preco;

    @Getter
    @Setter
    private BigDecimal precoCompra;

    @Getter
    @Setter
    private Integer quantidade;

    public ProdutoDto(Long id, String nome, String categoriaNome, BigDecimal preco, BigDecimal precoCompra, Integer quantidade) {
        this.id = id;
        this.categoriaNome = categoriaNome;
        this.nome = nome;
        this.preco = preco;
        this.precoCompra = precoCompra;
        this.quantidade = quantidade;
    }
}
