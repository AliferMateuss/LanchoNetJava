package com.example.lanchonet.entidades;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
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

    @JsonIgnore
    @Getter
    @Setter
    @OneToOne
    @JoinColumn(name = "id_pessoa", nullable = false, referencedColumnName = "id")
    private Pessoa pessoa;

    @JsonIgnore
    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "id_grupo_usuario", nullable = false)
    private GrupoUsuario grupoUsuario;

    @JsonProperty
    @Getter
    @Setter
    @Transient
    private Long pessoaId;


    @JsonProperty
    @Getter
    @Setter
    @Transient
    private Long grupoUsuarioId;

    @JsonProperty
    @Getter
    @Setter
    @Transient
    private String grupoNome;

    public Usuario() {}
    public Usuario(Long id, String usuarioNome, String grupoNome) {
        this.usuarioNome = usuarioNome;
        this.grupoNome = grupoNome;
        this.id = id;
    }
}
