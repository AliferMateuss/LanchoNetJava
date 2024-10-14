package com.example.lanchonet.dtos;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

public class PedidoDto {

    @Getter
    @Setter
    private Long id;

    @Getter
    @Setter
    private String nomeCliente;

    @Getter
    @Setter
    private BigDecimal valorTotal;

    public PedidoDto(Long id, String nomeCliente, BigDecimal valorTotal) {
        this.id = id;
        this.nomeCliente = nomeCliente;
        this.valorTotal = valorTotal;
    }
}
