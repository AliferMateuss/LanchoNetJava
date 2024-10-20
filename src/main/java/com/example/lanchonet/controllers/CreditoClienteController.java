package com.example.lanchonet.controllers;

import com.example.lanchonet.dtos.CreditoClienteDto;
import com.example.lanchonet.dtos.MovimentoCreditoDto;
import com.example.lanchonet.dtos.PagamentoCreditoDto;
import com.example.lanchonet.dtos.PagamentoDto;
import com.example.lanchonet.entidades.TipoPagamento;
import com.example.lanchonet.negocio.CreditoClienteNegocio;
import com.example.lanchonet.negocio.TipoPagamentoNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/CreditoCliente")
@CrossOrigin("*")
public class CreditoClienteController {

    @Autowired
    private CreditoClienteNegocio creditoClienteNegocio;

    @GetMapping("/RecuperaCreditos")
    public List<CreditoClienteDto> recuperaCreditos(){
        return creditoClienteNegocio.recuperaCreditos();
    }

    @PostMapping("/RetornaMovimentosPorId")
    public List<MovimentoCreditoDto> retornaMovimentosPorId(@RequestBody Long id) {
        return creditoClienteNegocio.retornaMovimentosPorId(id);
    }

    @PostMapping("/RetornaPagamentosPorId")
    public List<PagamentoCreditoDto> retornaPagamentosPorId(@RequestBody Long id) {
        return creditoClienteNegocio.retornaPagamentosPorId(id);
    }

    @PostMapping("/GerarPagamentoCredito")
    public void gerarPagamentoCredito(@RequestBody PagamentoDto dto) {
        creditoClienteNegocio.geraPagamentoCreditoCliente(dto);
    }
}
