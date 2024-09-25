package com.example.lanchonet.entidades;
import com.example.lanchonet.enums.StatusPedido;
import com.example.lanchonet.enums.StatusVenda;
import com.example.lanchonet.enums.TipoPedido;
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
@Table(name = "pedido")
public class Pedido {
    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Setter
    @Temporal(TemporalType.DATE)
    private Date dataPedido = new Date();

    @Getter
    @Setter
    @Temporal(TemporalType.DATE)
    private Date dataFechamentoPedido;

    @Getter
    @Setter
    private Integer parcelas;

    @Getter
    @Setter
    private BigDecimal valorTotal;

    @Getter
    @Setter
    private String nomeCliente;

    @Getter
    @Setter
    @Enumerated(EnumType.STRING)
    private StatusPedido statusPedido;

    @Getter
    @Setter
    @Enumerated
    private TipoPedido tipoPedido;

    @JsonIgnore
    @Getter
    @Setter
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_venda")
    private Venda venda;

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
    @JoinColumn(name = "id_mesa", nullable = false)
    private Mesa mesa;

    @Getter
    @Setter
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItensPedido> itensPedido;

    @Transient
    private Date dataPermanencia;

    @Getter
    @Setter
    @Transient
    @JsonProperty
    private Boolean pedidoFechado;

    @Getter
    @Setter
    @Transient
    @JsonProperty
    private Boolean pedidoPago;


    @JsonProperty
    @Transient
    @Getter
    @Setter
    private Long pessoaId;

    @JsonProperty
    @Transient
    @Getter
    @Setter
    private Long usuarioId;

    @JsonProperty
    @Transient
    @Getter
    @Setter
    private Long mesaId;

    @JsonProperty
    @Transient
    @Getter
    @Setter
    private Long vendaId;

    public Date getDataPermanencia() {
        return dataPermanencia;
    }
}
