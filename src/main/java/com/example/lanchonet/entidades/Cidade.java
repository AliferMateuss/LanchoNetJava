package com.example.lanchonet.entidades;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity
@Table(name = "cidade")
public class Cidade {

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
    private Integer ibge;

    @Getter
    @Setter
    private BigDecimal latitude;

    @Getter
    @Setter
    private BigDecimal longitude;

    @Getter
    @Setter
    private Short codTom;

    @JsonIgnore
    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "estado_id")
    private Estado estado;

    @JsonIgnore
    @Getter
    @Setter
    @OneToMany(mappedBy = "cidade")
    private List<Endereco> enderecos;
}
