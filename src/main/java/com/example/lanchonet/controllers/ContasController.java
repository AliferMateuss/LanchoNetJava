package com.example.lanchonet.controllers;

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

    @GetMapping("/RecuperarContasPagar")

    public List<ContasAPagar> RecuperarContasPagar(){
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

    @PostMapping("DeletarContaAPagar")
    public void DeletarContaAPagar(@RequestBody Long id){
        contaAPagarNegocio.excluirContaAReceber(id);
    }

    @GetMapping("/RecuperarContasReceber")
    public List<ContasAReceber> RecuperarContaReceber(){
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

    @PostMapping("DeletarContaReceber")
    public void DeletarContaReceber(@RequestBody Long id){
        contaAReceberNegocio.excluirContaAReceber(id);
    }
}
