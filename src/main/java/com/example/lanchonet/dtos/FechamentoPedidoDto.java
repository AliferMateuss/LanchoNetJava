package com.example.lanchonet.dtos;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

public class FechamentoPedidoDto {
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
    private Long idTipoPagamento;

    @Getter
    @Setter
    private String nomeCliente;

    @Getter
    @Setter
    private BigDecimal valorTotal;

    @Getter
    @Setter
    private Integer parcelas;

    @Getter
    @Setter
    private Boolean pedidoFiado;

}
