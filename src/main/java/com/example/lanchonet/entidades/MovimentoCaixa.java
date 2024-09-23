package com.example.lanchonet.entidades;

import com.example.lanchonet.enums.TipoMovimentoCaixa;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

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

    @JsonIgnore
    @Getter
    @Setter
    @OneToOne
    @Column(name = "id_venda")
    private Venda venda;

    @JsonIgnore
    @Getter
    @Setter
    @OneToOne
    @Column(name = "id_compra")
    private Compra compra;
}
