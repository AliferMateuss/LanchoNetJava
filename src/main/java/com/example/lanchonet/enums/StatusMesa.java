package com.example.lanchonet.enums;

import lombok.Getter;

public enum StatusMesa {
    FECHADA("Fechada"),
    OCUPADA("Ocupada"),
    ABERTA("Aberta");

    @Getter
    private String descricao;

    StatusMesa(String descricao) {
        this.descricao = descricao;
    }


}
