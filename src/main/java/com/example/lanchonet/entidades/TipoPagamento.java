package com.example.lanchonet.entidades;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tipo_pagamento")
public class TipoPagamento {
    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Setter
    private String nome;

    @Getter
    @Setter
    private Integer juros;

    @Getter
    @Setter
    private Integer parcelas;

    @JsonProperty
    @Getter
    @Setter
    private Boolean aVista;


    @JsonIgnore
    @Getter
    @Setter
    @OneToMany(mappedBy = "tipoPagamento", fetch = FetchType.LAZY)
    private List<Compra> compras = new ArrayList<>();

    @JsonIgnore
    @Getter
    @Setter
    @OneToMany(mappedBy = "tipoPagamento", fetch = FetchType.LAZY)
    private List<Venda> vendas = new ArrayList<>();
}
