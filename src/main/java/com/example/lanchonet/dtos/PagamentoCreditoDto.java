package com.example.lanchonet.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Transient;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

public class PagamentoCreditoDto {

    @Getter
    @Setter
    private Long id;

    @Getter
    @Setter
    private Date dataMovimento;

    @Getter
    @Setter
    private BigDecimal valor;

    @Getter
    @Setter
    private String tipoPagamento ;

    public PagamentoCreditoDto(Long id, Date dataMovimento, BigDecimal valor, String tipoPagamento) {
        this.id = id;
        this.dataMovimento = dataMovimento;
        this.valor = valor;
        this.tipoPagamento = tipoPagamento;
    }
}
