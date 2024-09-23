package com.example.lanchonet.dtos;

import lombok.Getter;
import lombok.Setter;

public class EstadoDto {
    @Getter
    @Setter
    private Long id;

    @Getter
    @Setter
    private String nome;

    @Getter
    @Setter
    private String uf;

    public EstadoDto(Long id, String nome, String uf) {
        this.id = id;
        this.nome = nome;
        this.uf = uf;
    }
}
