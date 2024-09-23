package com.example.lanchonet.controllers;

import com.example.lanchonet.dtos.CidadeDto;
import com.example.lanchonet.entidades.Cidade;
import com.example.lanchonet.entidades.Usuario;
import com.example.lanchonet.negocio.CidadeNegocio;
import com.example.lanchonet.negocio.UsuarioNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/Cidade")
@CrossOrigin("*")
public class CiadadeController {

    @Autowired
    private CidadeNegocio cidadeNegocio;

    @GetMapping("/BuscaCidadesPorEstadoETermo")
    public List<CidadeDto> buscaCidadesPorEstadoETermo(Long estadoId, String termo){
        return cidadeNegocio.buscarCidadePorEstadoETermo(termo, estadoId);
    }

    @PostMapping("/RecuperaCidadePorId")
    public Cidade recuperaCidadePorId(@RequestBody Long id){
        return cidadeNegocio.buscarCidadePorId(id);
    }
}
