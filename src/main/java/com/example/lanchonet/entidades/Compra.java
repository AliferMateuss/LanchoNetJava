package com.example.lanchonet.entidades;

import com.example.lanchonet.enums.TipoCompra;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "compra")
public class Compra {

    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Setter
    @Temporal(TemporalType.DATE)
    private Date dataCompra;

    @Getter
    @Setter
    private Integer parcelas;

    @Getter
    @Setter
    private BigDecimal valorTotal;

    @Getter
    @Setter
    private Boolean compraBalcao;

    @Getter
    @Setter
    private String nomeFornecedor = "Venda Balção";

    @Getter
    @Setter
    @Enumerated(EnumType.STRING)
    private TipoCompra tipoCompra;

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
    @JoinColumn(name = "id_tipo_pagamento", nullable = false)
    private TipoPagamento tipoPagamento;

    @Getter
    @Setter
    @OneToMany(mappedBy = "compra")
    private List<ContasAPagar> contasAPagar;

    @Getter
    @Setter
    @OneToMany(mappedBy = "compra")
    private List<ItensCompra> itensCompra;

    @JsonProperty
    @Transient
    @Getter
    @Setter
    private Long pessoaId;

    @JsonProperty
    @Transient
    @Getter
    @Setter
    private Long usuarioId;

    @JsonProperty
    @Transient
    @Getter
    @Setter
    private Long pedidoId;

    @Override
    public String toString() {
        return id.toString();
    }
}
