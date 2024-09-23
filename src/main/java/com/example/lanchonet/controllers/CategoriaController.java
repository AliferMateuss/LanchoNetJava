package com.example.lanchonet.controllers;

import com.example.lanchonet.entidades.Categoria;
import com.example.lanchonet.negocio.CategoriaNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/Categoria")
@CrossOrigin("*")
public class CategoriaController {

    @Autowired
    private CategoriaNegocio categoriaNegocio;

    @GetMapping("/RecuperarCategorias")

    public List<Categoria> recuperarCategorias(){
        return categoriaNegocio.buscarCategorias();
    }

    @PostMapping("/Salvar")
    public void salvar(@RequestBody Categoria categoria){
        categoriaNegocio.salvarCategoria(categoria);
    }

    @PostMapping("/RertornaPorId")
    public Categoria retornaPorId(@RequestBody Long id){
        return categoriaNegocio.buscarCategoriaPorId(id);
    }

    @PostMapping("Deletar")
    public void Deletar(@RequestBody Long id){
        categoriaNegocio.excluirCategoria(id);
    }
}
