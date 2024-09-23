package com.example.lanchonet.controllers;

import com.example.lanchonet.dtos.EstadoDto;
import com.example.lanchonet.entidades.Estado;
import com.example.lanchonet.entidades.Usuario;
import com.example.lanchonet.negocio.EstadoNegocio;
import com.example.lanchonet.negocio.UsuarioNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/Estado")
@CrossOrigin("*")
public class EstadoController {

    @Autowired
    private EstadoNegocio estadoNegocio;

    @GetMapping("/RecuperaEstados")
    public List<EstadoDto> recuperarEstados(){
        return estadoNegocio.buscarEstados();
    }
}
