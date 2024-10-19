package com.example.lanchonet.dtos;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

public class VendaDto {

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
    private String nomeCliente;

    @Getter
    @Setter
    private BigDecimal valorTotal;

    public VendaDto(Long id, Long idPessoa, Long idUsuario, String nomeCliente, BigDecimal valorTotal) {
        this.id = id;
        this.idPessoa = idPessoa;
        this.idUsuario = idUsuario;
        this.nomeCliente = nomeCliente;
        this.valorTotal = valorTotal;
    }
}
