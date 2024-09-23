package com.example.lanchonet.enums;

import lombok.Getter;

public enum StatusVenda {
    FECHADA("Fechada"),
    ABERTA("Aberta");

    @Getter
    private String descricao;

    StatusVenda(String descricao) {
        this.descricao = descricao;
    }
}
