package com.example.lanchonet.entidades;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "usuario")
public class Usuario {
    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Setter
    private String usuarioNome;

    @Getter
    @Setter
    private String senha;

    @Getter
    @Setter
    private Date dataSenha;

    @Getter
    @Setter
    @OneToOne
    @JoinColumn(name = "id_pessoa", nullable = false, referencedColumnName = "id")
    private Pessoa pessoa;

    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "id_grupo_usuario", nullable = false)
    private GrupoUsuario grupoUsuario;
}
