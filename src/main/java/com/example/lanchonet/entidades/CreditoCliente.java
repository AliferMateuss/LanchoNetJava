package com.example.lanchonet.entidades;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "credito_cliente")
public class CreditoCliente {

    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Setter
    private BigDecimal valorTotal = BigDecimal.ZERO;

    @JsonIgnore
    @Getter
    @Setter
    @OneToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "id_pessoa")
    private Pessoa pessoa;

    @JsonIgnore
    @Getter
    @Setter
    @OneToMany(mappedBy = "creditoCliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MovimentoCreditoCliente> movimentoCreditoClientes = new ArrayList<>();

    @JsonIgnore
    @Getter
    @Setter
    @OneToMany(mappedBy = "creditoCliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PagamentoCreditoCliente> pagamentoCreditoClientes = new ArrayList<>();
}
