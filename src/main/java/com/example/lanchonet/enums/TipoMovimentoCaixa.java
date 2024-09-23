package com.example.lanchonet.enums;

import lombok.Getter;

public enum TipoMovimentoCaixa {
    ENTRADA("Entrada"),
    FIADO("Fiado"),
    FORNECEDOR("Compra de fornecedor à prazo"),
    SAIDA("Saída");

    @Getter
    private String descricao;

    TipoMovimentoCaixa(String descricao) {
        this.descricao = descricao;
    }

}
