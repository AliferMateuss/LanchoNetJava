package com.example.lanchonet.entidades;

import com.example.lanchonet.enums.StatusConta;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "contas_a_receber")
public class ContasAPagar {

    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Setter
    @Temporal(TemporalType.DATE)
    private Date dataCompetencia;

    @Getter
    @Setter
    @Temporal(TemporalType.DATE)
    private Date dataConta;

    @Getter
    @Setter
    @Temporal(TemporalType.DATE)
    private Date dataVencimento;

    @Getter
    @Setter
    private BigDecimal valor;

    @Getter
    @Setter
    private Integer parcela;

    @Getter
    @Setter
    private StatusConta status;

    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "id_compra", nullable = false)
    private Compra compra;

    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "id_pessoa", nullable = false)
    private Pessoa fornecedor;
}
