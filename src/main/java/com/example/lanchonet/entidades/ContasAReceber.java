package com.example.lanchonet.entidades;

import com.example.lanchonet.enums.StatusConta;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "conta_receber")
public class ContasAReceber {

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
    @Enumerated(EnumType.STRING)
    private StatusConta status;

    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "id_venda", nullable = false)
    private Venda venda;

    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "id_pessoa", nullable = false)
    private Pessoa pessoa;

    @Transient
    @JsonProperty
    @Getter
    @Setter
    private String clienteNome;

    @Transient
    @JsonProperty
    @Getter
    @Setter
    private Long idCliente;

    @JsonProperty
    @Getter
    @Setter
    @Transient
    private Long idVenda;
}
