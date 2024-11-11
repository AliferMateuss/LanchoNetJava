package com.example.lanchonet.dtos;

import com.example.lanchonet.enums.TipoMovimentoCaixa;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

public class MovimentoCaixaDto {

    @Getter
    @Setter
    private Long id;

    @Getter
    @Setter
    private String tipoMovimento;


    @Getter
    @Setter
    private Date dataMovimento;

    @Getter
    @Setter
    private String tipoPagamentoNome;

    @Getter
    @Setter
    private BigDecimal valor;

    public MovimentoCaixaDto(Long id, TipoMovimentoCaixa tipoMovimento, String tipoPagamentoNome, BigDecimal valor, Date dataMovimento) {
        this.id = id;
        this.tipoMovimento = tipoMovimento.name();
        this.tipoPagamentoNome = tipoPagamentoNome;
        this.valor = valor;
        this.dataMovimento = dataMovimento;
    }
}
