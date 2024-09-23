package com.example.lanchonet.enums;

import lombok.Getter;

public enum TipoVenda {
    BALCAO("Balção"),
    CLIENTE("Cliente"),
    FIADO("Fiado"),
    PEDIDO("Pedido");

    @Getter
    private String descricao;

    TipoVenda(String descricao) {
        this.descricao = descricao;
    }
}
