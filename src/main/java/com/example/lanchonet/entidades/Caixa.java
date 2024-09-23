package com.example.lanchonet.entidades;

import com.example.lanchonet.enums.StatusCaixa;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "caixa")
public class Caixa {

    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Setter
    @Temporal(TemporalType.DATE)
    @Column(name="data_abertura")
    private Date dataAbertura;

    @Getter
    @Setter
    @Temporal(TemporalType.DATE)
    @Column(name="data_fechamento")
    private Date dataFechamento;

    @Getter
    @Setter
    private BigDecimal valorTotal;

    @Getter
    @Setter
    @Enumerated(EnumType.STRING)
    private StatusCaixa status = StatusCaixa.ABERTO;


}
