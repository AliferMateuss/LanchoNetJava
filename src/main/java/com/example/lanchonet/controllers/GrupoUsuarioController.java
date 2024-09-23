package com.example.lanchonet.controllers;

import com.example.lanchonet.entidades.GrupoUsuario;
import com.example.lanchonet.negocio.GrupoUsuarioNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/GrupoUsuario")
@CrossOrigin("*")
public class GrupoUsuarioController {

    @Autowired
    private GrupoUsuarioNegocio grupoUsuarioNegocio;

    @GetMapping("/RecuperarGrupoUsuarios")

    public List<GrupoUsuario> recuperarGrupoUsuarios(){
        return grupoUsuarioNegocio.buscarGrupoUsuarios();
    }

    @PostMapping("/Salvar")

    public void salvar(@RequestBody GrupoUsuario grupoUsuario){
        grupoUsuarioNegocio.salvarGrupoUsuario(grupoUsuario);
    }

    @PostMapping("/RertornaPorId")

    public GrupoUsuario retornaPorId(@RequestBody Long id){
        return grupoUsuarioNegocio.buscarGrupoUsuarioPorId(id);
    }

    @PostMapping("Deletar")
    public void Deletar(@RequestBody Long id){
        grupoUsuarioNegocio.excluirGrupoUsuario(id);
    }
}
