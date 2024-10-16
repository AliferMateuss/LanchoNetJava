package com.example.lanchonet.entidades;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "itens_pedido")
public class ItensPedido {

    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "id_pedido", nullable = false)
    private Pedido pedido;

    @JsonIgnore
    @Getter
    @Setter
    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "id_produto", nullable = false)
    private Produto produto;

    @Getter
    @Setter
    private BigDecimal precoUnitario;

    @Getter
    @Setter
    private Integer quantidade;

    @Getter
    @Setter
    private BigDecimal subTotal;

    @JsonProperty
    @Getter
    @Setter
    @Transient
    private Long produtoId;
}
