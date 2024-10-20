package com.example.lanchonet.dtos;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

public class CaixaDto {

    @Getter
    @Setter
    private Long id;

    @Getter
    @Setter
    private Date dataAbertura;

    @Getter
    @Setter
    private Date dataFechamento;

    @Getter
    @Setter
    private BigDecimal valorTotal;

    @Getter
    @Setter
    private BigDecimal valorInicial;

    @Getter
    @Setter
    private List<MovimentoCaixaDto> movimentos;

    public CaixaDto(Long id, Date dataAbertura, Date dataFechamento, BigDecimal valorTotal, BigDecimal valorInicial) {
        this.id = id;
        this.dataAbertura = dataAbertura;
        this.dataFechamento = dataFechamento;
        this.valorTotal = valorTotal;
        this.valorInicial = valorInicial;
    }
}
