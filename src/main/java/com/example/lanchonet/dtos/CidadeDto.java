package com.example.lanchonet.dtos;

import lombok.Getter;
import lombok.Setter;

public class CidadeDto {

    @Getter
    @Setter
    private Long id;

    @Getter
    @Setter
    private String nome;

    public CidadeDto(Long id, String nome) {
        this.id = id;
        this.nome = nome;
    }
}
