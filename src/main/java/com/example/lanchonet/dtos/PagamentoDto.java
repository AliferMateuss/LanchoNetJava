package com.example.lanchonet.dtos;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

public class PagamentoDto {

    @Getter
    @Setter
    private BigDecimal valor;

    @Getter
    @Setter
    private Date data;

    @Getter
    @Setter
    private Long creditoId;

    @Getter
    @Setter
    private Long tipoPagamentoId;
}
