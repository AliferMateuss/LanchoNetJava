package com.example.lanchonet.enums;

import lombok.Getter;

public enum TipoCompra {
    BALCAO("Balção"),
    FORNECEDOR ("Fornecedor");

    @Getter
    private String descricao;

    TipoCompra(String descricao) {
        this.descricao = descricao;
    }
}
