package com.example.lanchonet.controllers;

import com.example.lanchonet.entidades.Produto;
import com.example.lanchonet.negocio.ProdutoNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/Produto")
@CrossOrigin("*")
public class ProdutoController {

    @Autowired
    private ProdutoNegocio produtoNegocio;

    @GetMapping("/RecuperarProdutos")

    public List<Produto> recuperarProdutos(){
        return produtoNegocio.buscarProdutos();
    }

    @PostMapping("/Salvar")

    public void salvar(@RequestBody Produto produto){
        produtoNegocio.salvarProduto(produto);
    }

    @PostMapping("/RertornaPorId")

    public Produto retornaPorId(@RequestBody Long id){
        return produtoNegocio.buscarProdutoPorId(id);
    }

    @PostMapping("Deletar")

    public void Deletar(@RequestBody Long id){
        produtoNegocio.excluirProduto(id);
    }
}
