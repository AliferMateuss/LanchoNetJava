package com.example.lanchonet.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "Pessoa")
public class Pessoa {
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
    @Temporal(TemporalType.DATE)
    private Date dataNascimento;

    @Getter
    @Setter
    private String telefone1;

    @Getter
    @Setter
    private String telefone2;

    @Getter
    @Setter
    private String email;

    @Getter
    @Setter
    private String cpf;

    @Getter
    @Setter
    private String cnpj;

    @Getter
    @Setter
    private String ie;

    @Getter
    @Setter
    private String rg;

    @Getter
    @Setter
    private String razaoSocial;

    @Getter
    @Setter
    private Boolean ativo;

    @Getter
    @Setter
    private Boolean cliente;

    @Getter
    @Setter
    private Boolean fornecedor;

    @Getter
    @Setter
    private Boolean funcionario;

    @Getter
    @Setter
    private BigDecimal salario;

    @Getter
    @Setter
    private String cargo;

    @Getter
    @Setter
    private String pis;

    @Getter
    @Setter
    @OneToMany(mappedBy = "pessoa")
    private List<Compra> compras;

    @Getter
    @Setter
    @OneToMany(mappedBy = "pessoa", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Endereco> enderecos;

    @Getter
    @Setter
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "usu_id", referencedColumnName = "id")
    private Usuario usuario;
}
