package com.example.lanchonet.entidades;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "pagamento_credito_cliente")
public class PagamentoCreditoCliente {
    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Setter
    @Temporal(TemporalType.DATE)
    private Date dataMovimento = new Date();

    @Getter
    @Setter
    private BigDecimal valor;

    @JsonIgnore
    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "id_tipo_pagamento")
    private TipoPagamento tipoPagamento;

    @JsonIgnore
    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "id_credito")
    private CreditoCliente creditoCliente;
}
