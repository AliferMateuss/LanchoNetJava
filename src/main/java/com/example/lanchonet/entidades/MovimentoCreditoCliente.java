package com.example.lanchonet.entidades;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "movimento_credito_cliente")
public class MovimentoCreditoCliente {

    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Setter
    @Temporal(TemporalType.DATE)
    private Date dataMovimento = new Date();

    @Getter
    @Setter
    private BigDecimal valor;

    @JsonIgnore
    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "id_credito")
    private CreditoCliente creditoCliente;

    @JsonIgnore
    @Getter
    @Setter
    @OneToOne(mappedBy = "creditoCliente", cascade = CascadeType.MERGE)
    @JoinColumn(name = "id_venda")
    private Venda venda;
}
