package com.example.lanchonet.enums;

import lombok.Getter;

public enum StatusConta {
    FECHADA("Fechada"),
    PARCIAL("Pagamento Parcial"),
    ABERTA("Aberta");

    @Getter
    private String descricao;

    StatusConta(String descricao) {
        this.descricao = descricao;
    }
}
