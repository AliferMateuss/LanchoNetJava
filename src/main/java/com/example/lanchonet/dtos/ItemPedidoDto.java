package com.example.lanchonet.dtos;

import com.example.lanchonet.entidades.Pedido;
import com.example.lanchonet.entidades.Produto;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

public class ItemPedidoDto {

    @Getter
    @Setter
    private Long id;

    @Getter
    @Setter
    private Long idPedido;

    @Getter
    @Setter
    private BigDecimal precoUnitario;

    @Getter
    @Setter
    private Integer quantidade;

    @Getter
    @Setter
    private BigDecimal subTotal;

    @JsonProperty
    @Getter
    @Setter
    @Transient
    private Long produtoId;

    @JsonProperty
    @Getter
    @Setter
    @Transient
    private String produtoNome;

    public ItemPedidoDto(Long id, BigDecimal precoUnitario, Integer quantidade, BigDecimal subTotal, Long produtoId, String produtoNome) {
        this.id = id;
        this.precoUnitario = precoUnitario;
        this.quantidade = quantidade;
        this.subTotal = subTotal;
        this.produtoId = produtoId;
        this.produtoNome = produtoNome;
    }
}
