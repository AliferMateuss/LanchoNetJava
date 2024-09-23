package com.example.lanchonet.negocio;

import com.example.lanchonet.dtos.EstadoDto;
import com.example.lanchonet.entidades.Estado;
import com.example.lanchonet.entidades.Usuario;
import com.example.lanchonet.facades.EstadoFacade;
import com.example.lanchonet.facades.UsuarioFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EstadoNegocio {

    @Autowired
    private EstadoFacade facade;

    public List<EstadoDto> buscarEstados() {
        return facade.findAllDto();
    }
}
