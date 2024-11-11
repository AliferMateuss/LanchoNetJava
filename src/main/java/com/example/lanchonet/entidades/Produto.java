package com.example.lanchonet.entidades;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Base64;
import java.util.List;

@Entity
@Table(name = "produto")
public class Produto {
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
    private Integer quantidade;

    @Getter
    @Setter
    private BigDecimal preco;

    @Getter
    @Setter
    private BigDecimal precoCompra;

    @JsonIgnore
    @Getter
    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_categoria")
    private Categoria categoria;

    @Getter
    @Setter
    @Column(columnDefinition = "Text")
    private String imagem;

    @JsonProperty
    @Transient
    @Getter
    @Setter
    private Long categoriaId;
}
