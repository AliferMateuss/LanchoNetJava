package com.example.lanchonet.dtos;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

public class CreditoClienteDto {
    @Getter
    @Setter
    private Long idCliente;

    @Getter
    @Setter
    private String nome;

    @Getter
    @Setter
    private Long idCredito;

    @Getter
    @Setter
    private BigDecimal valorTotal;

    public CreditoClienteDto(Long idCliente, String nome, Long idCredito, BigDecimal valorTotal) {
        this.idCliente = idCliente;
        this.nome = nome;
        this.idCredito = idCredito;
        this.valorTotal = valorTotal;
    }
}
