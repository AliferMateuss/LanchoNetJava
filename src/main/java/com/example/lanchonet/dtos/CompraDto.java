package com.example.lanchonet.dtos;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

public class CompraDto {

    @Getter
    @Setter
    private Long id;

    @Getter
    @Setter
    private Long idPessoa;

    @Getter
    @Setter
    private Long idUsuario;

    @Getter
    @Setter
    private String fornecedor;

    @Getter
    @Setter
    private BigDecimal valorTotal;

    public CompraDto(Long id, Long idPessoa, Long idUsuario, String fornecedor, BigDecimal valorTotal) {
        this.id = id;
        this.idPessoa = idPessoa;
        this.idUsuario = idUsuario;
        this.fornecedor = fornecedor;
        this.valorTotal = valorTotal;
    }
}
