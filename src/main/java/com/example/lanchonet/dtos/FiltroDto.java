package com.example.lanchonet.dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

public class FiltroDto {

    @Getter
    @Setter
    private Date dataInicio = new Date();

    @Getter
    @Setter
    private Date dataFim = new Date();

    @Getter
    @Setter
    private Long pessoaId;

    @Getter
    @Setter
    private Long produtoId;

    @Getter
    @Setter
    private Long categoriaId;

    @Getter
    @Setter
    private Long grupoUsuarioId;

    @Getter
    @Setter
    private Boolean vendaBalcao;

    @Getter
    @Setter
    private Boolean cliente;

    @Getter
    @Setter
    private Boolean fornecedor;

    @Getter
    @Setter
    private Boolean funcionario;
}
