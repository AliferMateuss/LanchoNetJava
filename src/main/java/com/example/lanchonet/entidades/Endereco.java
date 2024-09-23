package com.example.lanchonet.entidades;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "endereco")
public class Endereco {
    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "id_pessoa")
    private Pessoa pessoa;

    @JsonIgnore
    @Getter
    @Setter
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_cidade")
    private Cidade cidade;

    @Getter
    @Setter
    private Integer cep;

    @Getter
    @Setter
    private String rua;

    @Getter
    @Setter
    private Integer numero;

    @Getter
    @Setter
    private String complemento;

    @Getter
    @Setter
    private String bairro;

    @Getter
    @Setter
    @Transient
    @JsonProperty("idCidade")
    private Long idCidade;

    @Getter
    @Setter
    @Transient
    @JsonProperty("idPessoa")
    private Long idPessoa;

    @Getter
    @Setter
    @Transient
    @JsonProperty("cidadeNome")
    private String cidadeNome;

    @Getter
    @Setter
    @Transient
    @JsonProperty("idEstado")
    private Long idEstado;
}
