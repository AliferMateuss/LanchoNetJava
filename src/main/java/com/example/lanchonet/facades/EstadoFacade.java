package com.example.lanchonet.facades;

import com.example.lanchonet.dtos.EstadoDto;
import com.example.lanchonet.entidades.Estado;
import com.example.lanchonet.entidades.Produto;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class EstadoFacade extends AbstractFacade<Estado, Long>{

    public EstadoFacade() {
        super(Estado.class);
    }

    @Transactional
    public List<EstadoDto> findAllDto(){
        return entityManager.createQuery("SELECT new com.example.lanchonet.dtos.EstadoDto(e.id, e.nome, e.uf)" +
                " FROM Estado e", EstadoDto.class).getResultList();
    }
}
