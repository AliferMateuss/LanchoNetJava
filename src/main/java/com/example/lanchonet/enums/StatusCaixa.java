package com.example.lanchonet.enums;

import lombok.Getter;

public enum StatusCaixa {
    FECHADO("Fechado"),
    ABERTO("Aberto");

    @Getter
    private String descricao;

    StatusCaixa(String descricao) {
        this.descricao = descricao;
    }


}
