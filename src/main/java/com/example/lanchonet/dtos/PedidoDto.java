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
    private Long idPessoa;

    @Getter
    @Setter
    private Long idMesa;

    @Getter
    @Setter
    private Long idUsuario;

    @Getter
    @Setter
    private String nomeCliente;

    @Getter
    @Setter
    private BigDecimal valorTotal;

    public PedidoDto(Long id, Long idPessoa, Long idMesa, Long idUsuario, String nomeCliente, BigDecimal valorTotal) {
        this.id = id;
        this.idPessoa = idPessoa;
        this.idUsuario = idUsuario;
        this.idMesa = idMesa;
        this.nomeCliente = nomeCliente;
        this.valorTotal = valorTotal;
    }
}
