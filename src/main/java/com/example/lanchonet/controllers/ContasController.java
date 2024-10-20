package com.example.lanchonet.controllers;

import com.example.lanchonet.dtos.ContasPagarDto;
import com.example.lanchonet.dtos.ContasReceberDto;
import com.example.lanchonet.entidades.ContasAPagar;
import com.example.lanchonet.entidades.ContasAReceber;
import com.example.lanchonet.entidades.Mesa;
import com.example.lanchonet.negocio.ContaAPagarNegocio;
import com.example.lanchonet.negocio.ContaAReceberNegocio;
import com.example.lanchonet.negocio.MesaNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/Contas")
@CrossOrigin("*")
public class ContasController {

    @Autowired
    private ContaAPagarNegocio contaAPagarNegocio;

    @Autowired
    private ContaAReceberNegocio contaAReceberNegocio;

    @PostMapping("/BaixarContasAPagar")
    public void baixar(@RequestBody ContasPagarDto conta){
        contaAPagarNegocio.baixar(conta);
    }

    @GetMapping("/RecuperarContasPagar")
    public List<ContasPagarDto> RecuperarContasPagar(){
        return contaAPagarNegocio.buscarContaAPagar();
    }

    @PostMapping("/SalvarContaPagar")
    public void SalvarContaPagar(@RequestBody ContasAPagar conta){
        contaAPagarNegocio.salvarContaAReceber(conta);
    }

    @PostMapping("/RertornaContaPagarPorId")
    public ContasAPagar RertornaContaPagarPorId(@RequestBody Long id){
        return contaAPagarNegocio.buscarContaAReceberPorId(id);
    }

    @PostMapping("/DeletarContaAPagar")
    public void DeletarContaAPagar(@RequestBody Long id){
        contaAPagarNegocio.excluirContaAReceber(id);
    }

    @PostMapping("/BaixarContasAReceber")
    public void baixar(@RequestBody ContasReceberDto conta){
        contaAReceberNegocio.baixar(conta);
    }

    @GetMapping("/RecuperarContasReceber")
    public List<ContasReceberDto> RecuperarContaReceber(){
        return contaAReceberNegocio.buscarContaARecebers();
    }

    @PostMapping("/SalvarContaReceber")
    public void SalvarContaReceber(@RequestBody ContasAReceber conta){
        contaAReceberNegocio.salvarContaAReceber(conta);
    }

    @PostMapping("/RertornaContaReceberPorId")
    public ContasAReceber RertornaContaReceberPorId(@RequestBody Long id){
        return contaAReceberNegocio.buscarContaAReceberPorId(id);
    }

    @PostMapping("/DeletarContaReceber")
    public void DeletarContaReceber(@RequestBody Long id){
        contaAReceberNegocio.excluirContaAReceber(id);
    }
}
