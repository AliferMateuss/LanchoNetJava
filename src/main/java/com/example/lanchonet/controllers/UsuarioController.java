package com.example.lanchonet.controllers;

import com.example.lanchonet.dtos.LoginDto;
import com.example.lanchonet.dtos.PessoaDto;
import com.example.lanchonet.entidades.Pessoa;
import com.example.lanchonet.entidades.Usuario;
import com.example.lanchonet.negocio.UsuarioNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/Usuario")
@CrossOrigin("*")
public class UsuarioController {

    @Autowired
    private UsuarioNegocio usuarioNegocio;

    @GetMapping("/RecuperarUsuarios")

    public List<Usuario> recuperarUsuarios(){
        return usuarioNegocio.buscarUsuarios();
    }

    @PostMapping("/Salvar")

    public void salvar(@RequestBody Usuario usuario){
        usuarioNegocio.salvarUsuario(usuario);
    }

    @PostMapping("/RertornaPorId")
    public Usuario retornaPorId(@RequestBody Long id){
        return usuarioNegocio.buscarUsuarioPorId(id);
    }

    @PostMapping("/Deletar")
    public void Deletar(@RequestBody Long id){
        usuarioNegocio.excluirUsuario(id);
    }

    @PostMapping("/Logar")
    public Boolean logar(@RequestBody LoginDto dto ){
        return usuarioNegocio.logar(dto);
    }
}
