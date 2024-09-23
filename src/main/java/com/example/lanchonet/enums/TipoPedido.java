package com.example.lanchonet.enums;

import lombok.Getter;

public enum TipoPedido {
    PAGO("Pago"),
    FIADO("Fiado");

    @Getter
    private String descricao;

    TipoPedido(String descricao) {
        this.descricao = descricao;
    }
}
