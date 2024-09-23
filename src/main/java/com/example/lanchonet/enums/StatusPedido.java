package com.example.lanchonet.enums;

import lombok.Getter;

public enum StatusPedido {
    FECHADO("Fechado"),
    ABERTO("Aberto");

    @Getter
    private String descricao;

    StatusPedido(String descricao) {
        this.descricao = descricao;
    }
}
