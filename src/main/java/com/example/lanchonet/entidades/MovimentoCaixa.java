package com.example.lanchonet.entidades;

import com.example.lanchonet.enums.TipoMovimentoCaixa;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "movimento_caixa")
public class MovimentoCaixa {
    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Setter
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_movimento")
    private TipoMovimentoCaixa tipoMovimento;

    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "id_tipo_pagamento")
    private TipoPagamento tipoPagamento;

    @Getter
    @Setter
    private BigDecimal valor;

    @Getter
    @Setter
    @Temporal(TemporalType.TIMESTAMP)
    private Date dataMovimento;

    @JsonIgnore
    @Getter
    @Setter
    @OneToOne(mappedBy = "movimentoCaixa", cascade = CascadeType.MERGE)
    @JoinColumn(name = "id_venda")
    private Venda venda;

    @JsonIgnore
    @Getter
    @Setter
    @OneToOne(mappedBy = "movimentoCaixa", cascade = CascadeType.MERGE)
    @JoinColumn(name = "id_compra")
    private Compra compra;

    @JsonIgnore
    @Getter
    @Setter
    @OneToOne(mappedBy = "movimentoCaixa", cascade = CascadeType.MERGE)
    @JoinColumn(name = "id_conta_receber")
    private ContasAReceber contasAReceber;

    @JsonIgnore
    @Getter
    @Setter
    @OneToOne(mappedBy = "movimentoCaixa", cascade = CascadeType.MERGE)
    @JoinColumn(name = "id_conta_pagar")
    private ContasAPagar contasAPagar;

    @Getter
    @Setter
    @ManyToOne(fetch = FetchType.EAGER)
    private Caixa caixa;
}
