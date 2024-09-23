package com.example.lanchonet.facades;

import com.example.lanchonet.dtos.CidadeDto;
import com.example.lanchonet.dtos.EstadoDto;
import com.example.lanchonet.entidades.Cidade;
import com.example.lanchonet.entidades.Estado;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class CidadeFacade extends AbstractFacade<Cidade, Long>{

    public CidadeFacade() {
        super(Cidade.class);
    }

    @Transactional
    public List<CidadeDto> buscarCidadePorEstadoETermo(String termo, Long idEstado) {
        TypedQuery<CidadeDto> query = entityManager.createQuery("SELECT new com.example.lanchonet.dtos.CidadeDto(c.id, c.nome) FROM Cidade c WHERE c.estado.id = :estado" +
                " AND LOWER(c.nome) LIKE :termo", CidadeDto.class);
        query.setParameter("estado", idEstado);
        query.setParameter("termo", "%" + termo.toLowerCase() + "%");
        return query.getResultList();
    }
}
