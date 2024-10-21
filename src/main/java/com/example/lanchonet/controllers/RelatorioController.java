package com.example.lanchonet.controllers;

import com.example.lanchonet.dtos.FiltroDto;
import com.example.lanchonet.dtos.ProdutoDto;
import com.example.lanchonet.negocio.ProdutoNegocio;
import com.example.lanchonet.negocio.RelatorioNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/Relatorio")
@CrossOrigin("*")
public class RelatorioController {

    @Autowired
    private RelatorioNegocio relatorioNegocio;

    @PostMapping("/GerarRelVendas")
    public String gerarRelVendas(@RequestBody FiltroDto filtro){
        return relatorioNegocio.geraRelatorioVendas(filtro);
    }

    @PostMapping("/GerarRelCompra")
    public String gerarRelCompras(@RequestBody FiltroDto filtro){
        return relatorioNegocio.geraRelatorioCompras(filtro);
    }

    @PostMapping("/GerarRelPedidos")
    public String gerarRelPedidos(@RequestBody FiltroDto filtro){
        return relatorioNegocio.geraRelatorioPedidos(filtro);
    }

    @PostMapping("/GerarRelCreditos")
    public String gerarRelCreditos(@RequestBody FiltroDto filtro){
        return relatorioNegocio.geraRelatorioCredito(filtro);
    }

    @PostMapping("/GerarRelPessoas")
    public String gerarRelPessoas(@RequestBody FiltroDto filtro){
        return relatorioNegocio.geraRelPessoas(filtro);
    }

    @PostMapping("/GerarRelProdutos")
    public String gerarRelProdutos(@RequestBody FiltroDto filtro){
        return relatorioNegocio.geraRelProdutos(filtro);
    }

    @PostMapping("/GerarRelUsuarios")
    public String gerarRelUsuarios(@RequestBody FiltroDto filtro){
        return relatorioNegocio.geraRelUsuario(filtro);
    }

    @PostMapping("/GerarRelContasPagar")
    public String gerarRelContasPagar(@RequestBody FiltroDto filtro){
        return relatorioNegocio.geraRelContasPagar(filtro);
    }

    @PostMapping("/GerarRelContasReceber")
    public String gerarRelContasReceber(@RequestBody FiltroDto filtro){
        return relatorioNegocio.geraRelContasReceber(filtro);
    }

}
