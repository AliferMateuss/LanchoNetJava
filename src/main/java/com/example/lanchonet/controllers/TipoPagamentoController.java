package com.example.lanchonet.controllers;

import com.example.lanchonet.entidades.TipoPagamento;
import com.example.lanchonet.negocio.TipoPagamentoNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/TipoPagamento")
@CrossOrigin("*")
public class TipoPagamentoController {

    @Autowired
    private TipoPagamentoNegocio tipoPagamentoNegocio;

    @GetMapping("/RecuperarTipoPagamentos")

    public List<TipoPagamento> recuperarTipoPagamentos(){
        return tipoPagamentoNegocio.buscarTipoPagamentos();
    }

    @PostMapping("/Salvar")

    public void salvar(@RequestBody TipoPagamento tipoPagamento){
        tipoPagamentoNegocio.salvarTipoPagamento(tipoPagamento);
    }

    @PostMapping("/RertornaPorId")

    public TipoPagamento retornaPorId(@RequestBody Long id){
        return tipoPagamentoNegocio.buscarTipoPagamentoPorId(id);
    }

    @PostMapping("Deletar")

    public void Deletar(@RequestBody Long id){
        tipoPagamentoNegocio.excluirTipoPagamento(id);
    }
}
