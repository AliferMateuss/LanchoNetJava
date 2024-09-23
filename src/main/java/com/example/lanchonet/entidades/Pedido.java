package com.example.lanchonet.entidades;
import com.example.lanchonet.enums.StatusVenda;
import com.example.lanchonet.enums.TipoCompra;
import com.example.lanchonet.enums.TipoVenda;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "venda")
public class Venda {
    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Setter
    @Temporal(TemporalType.DATE)
    private Date dataVenda;

    @Getter
    @Setter
    private Integer parcelas;

    @Getter
    @Setter
    private Double valorTotal;

    @Getter
    @Setter
    private Boolean vendaFiado;

    @Getter
    @Setter
    private Boolean vendaBalcao;

    @Getter
    @Setter
    private String nomeCliente = "Venda Balção";

    @Getter
    @Setter
    @Enumerated(EnumType.STRING)
    private TipoVenda tipoVenda;

    @Getter
    @Setter
    @Enumerated(EnumType.STRING)
    private StatusVenda statusVenda;

    @JsonIgnore
    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @JsonIgnore
    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "id_pessoa", nullable = false)
    private Pessoa pessoa;

    @JsonIgnore
    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "id_mesa", nullable = false)
    private Mesa mesa;

    @JsonIgnore
    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "id_tipo_pagamento", nullable = false)
    private TipoPagamento tipoPagamento;

    @JsonIgnore
    @Getter
    @Setter
    @OneToMany(mappedBy = "venda", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ContasAReceber> contasAReceber;

    @Getter
    @Setter
    @OneToMany(mappedBy = "venda", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItensVenda> itensVenda;
}
