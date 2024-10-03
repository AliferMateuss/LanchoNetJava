package com.example.lanchonet.entidades;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity
@Table(name = "grupo_usuario")
public class GrupoUsuario {
    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Setter
    private String nome;

    @JsonIgnore
    @Getter
    @Setter
    @OneToMany(mappedBy = "grupoUsuario")
    private List<Usuario> usuarios;
}
