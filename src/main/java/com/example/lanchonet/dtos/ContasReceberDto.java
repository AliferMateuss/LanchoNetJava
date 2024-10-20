package com.example.lanchonet.dtos;

import com.example.lanchonet.enums.StatusConta;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

public class ContasReceberDto {
    @Getter
    @Setter
    private Long id;

    @Getter
    @Setter
    private Long vendaId;

    @Getter
    @Setter
    private Date dataCompetencia;

    @Getter
    @Setter
    private Date dataVencimento;

    @Getter
    @Setter
    private Date dataConta;

    @Getter
    @Setter
    private Integer parcela;

    @Getter
    @Setter
    private BigDecimal valor;

    @Getter
    @Setter
    private String status;

    @Getter
    @Setter
    private String clienteNome;

    @Getter
    @Setter
    private Long clienteId;

    @Getter
    @Setter
    private Long tipoPagamentoId;

    public ContasReceberDto(Long id, Long vendaId, Date dataCompetencia, Date dataVencimento, Date dataConta, Integer parcela, BigDecimal valor, StatusConta status, String clienteNome, Long clienteId) {
        this.id = id;
        this.vendaId = vendaId;
        this.dataCompetencia = dataCompetencia;
        this.dataVencimento = dataVencimento;
        this.dataConta = dataConta;
        this.parcela = parcela;
        this.valor = valor;
        this.status = status.name();
        this.clienteNome = clienteNome;
        this.clienteId = clienteId;
    }
}
