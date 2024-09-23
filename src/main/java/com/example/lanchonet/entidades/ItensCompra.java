package com.example.lanchonet.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "itens_compra")
public class ItensCompra {

    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "id_compra", nullable = false)
    private Compra compra;

    @Getter
    @Setter
    @ManyToOne
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
}
