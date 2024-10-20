package com.example.lanchonet.controllers;

import com.example.lanchonet.dtos.CaixaDto;
import com.example.lanchonet.dtos.MovimentoCaixaDto;
import com.example.lanchonet.entidades.Caixa;
import com.example.lanchonet.negocio.CaixaNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/Caixa")
@CrossOrigin("*")
public class CaixaController {

    @Autowired
    private CaixaNegocio caixaNegocio;

    @GetMapping("/RecuperarCaixas")

    public List<Caixa> recuperarCaixas(){
        return caixaNegocio.buscarCaixas();
    }

    @PostMapping("/AbreCaixa")
    public void abreCaixa(@RequestBody Caixa caixa){
        caixaNegocio.abreCaixa(caixa);
    }

    @PostMapping("/FechaCaixa")
    public void fechaCaixa(@RequestBody Long id){
        caixaNegocio.fechaCaixa(id);
    }

    @PostMapping("/RertornaPorId")
    public Caixa retornaPorId(@RequestBody Long id){
        return caixaNegocio.buscarCaixaPorId(id);
    }

    @GetMapping("/RetornaCaixaAberto")
    public CaixaDto rertornaMovimentos(){
        return caixaNegocio.retornaCaixaAberto();
    }

    @PostMapping("/Deletar")
    public void Deletar(@RequestBody Long id){
        caixaNegocio.excluirCaixa(id);
    }
}
