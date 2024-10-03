package com.example.lanchonet.entidades;
import com.example.lanchonet.enums.StatusVenda;
import com.example.lanchonet.enums.TipoCompra;
import com.example.lanchonet.enums.TipoVenda;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
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
    private BigDecimal valorTotal;

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
    @OneToOne(cascade = {CascadeType.MERGE , CascadeType.PERSIST})
    @JoinColumn(name = "id_pedido")
    private Pedido pedido;

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
    @JoinColumn(name = "id_pessoa")
    private Pessoa pessoa;

    @JsonIgnore
    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "id_tipo_pagamento")
    private TipoPagamento tipoPagamento;

    @JsonIgnore
    @Getter
    @Setter
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_movimento_caixa")
    private MovimentoCaixa movimentoCaixa;

    @JsonIgnore
    @Getter
    @Setter
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_credito_cliente")
    private CreditoCliente creditoCliente;

    @JsonIgnore
    @Getter
    @Setter
    @OneToMany(mappedBy = "venda", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ContasAReceber> contasAReceber;

    @Getter
    @Setter
    @OneToMany(mappedBy = "venda", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItensVenda> itensVenda;

    @JsonProperty
    @Transient
    @Getter
    @Setter
    private Long pessoaId;


    @JsonProperty
    @Transient
    @Getter
    @Setter
    private Long tipoPagamentoId;

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
