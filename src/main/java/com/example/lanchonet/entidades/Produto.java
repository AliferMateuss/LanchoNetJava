package com.example.lanchonet.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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

    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "id_categoria")
    private Categoria categoria;

    @Getter
    @Setter
    @Column(columnDefinition = "Text")
    private String imagem;

    @Getter
    @Setter
    @OneToMany(mappedBy = "produto", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<ItensCompra> itensCompras;

    @Getter
    @Setter
    @OneToMany(mappedBy = "produto", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<ItensVenda> itensVenda;
}
