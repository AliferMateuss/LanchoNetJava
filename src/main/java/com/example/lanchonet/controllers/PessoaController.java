package com.example.lanchonet.controllers;

import com.example.lanchonet.dtos.PessoaDto;
import com.example.lanchonet.entidades.Pessoa;
import com.example.lanchonet.negocio.PessoaNegocio;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/Pessoas")
@CrossOrigin("*")
public class PessoaController {

    @Autowired
    private PessoaNegocio pessoaNegocio;

    @GetMapping("/RecuperarPessoas")

    public List<PessoaDto> recuperarPessoas(){
        return pessoaNegocio.buscarPessoas();
    }

    @PostMapping("/SalvarPessoa")
    public void SalvarPessoa(@RequestBody Pessoa pessoa){
        pessoaNegocio.salvarPessoa(pessoa);
    }

    @PostMapping("/RetornaPessoaPorId")

    public Pessoa RetornaPessoaPorId(@RequestBody Long id){
        return pessoaNegocio.buscarPessoaPorId(id);
    }

    @PostMapping("Deletar")

    public void Deletar(@RequestBody Long id){
        pessoaNegocio.excluirPessoa(id);
    }

}
