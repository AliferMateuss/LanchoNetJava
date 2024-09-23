package com.example.lanchonet.negocio;

import com.example.lanchonet.dtos.CidadeDto;
import com.example.lanchonet.entidades.Cidade;
import com.example.lanchonet.entidades.Estado;
import com.example.lanchonet.facades.CidadeFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CidadeNegocio {

    @Autowired
    private CidadeFacade facade;

    public List<CidadeDto> buscarCidadePorEstadoETermo(String termo, Long idEstado) {
        return facade.buscarCidadePorEstadoETermo(termo, idEstado);
    }

    public Cidade buscarCidadePorId(Long id) {
        return facade.findById(id);
    }
}
