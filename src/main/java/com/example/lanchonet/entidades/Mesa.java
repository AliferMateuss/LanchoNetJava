package com.example.lanchonet.entidades;
import com.example.lanchonet.enums.StatusMesa;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "mesa")
public class Mesa {

    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Setter
    private Integer numero;

    @Getter
    @Setter
    @Enumerated(EnumType.STRING)
    private StatusMesa status = StatusMesa.ABERTA;

    @Getter
    @Setter
    private Integer capacidade;

    @Getter
    @Setter
    private Integer totalPessoas = 0;

    @JsonIgnore
    @Getter
    @Setter
    @OneToMany(mappedBy = "mesa", fetch = FetchType.LAZY)
    private List<Pedido> pedidos = new ArrayList<>();
}
