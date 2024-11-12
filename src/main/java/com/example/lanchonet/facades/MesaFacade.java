package com.example.lanchonet.facades;

import com.example.lanchonet.entidades.Mesa;
import com.example.lanchonet.entidades.Venda;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class MesaFacade extends AbstractFacade<Mesa, Long> {

    public MesaFacade() {
        super(Mesa.class);
    }

    @Transactional
    public List<Mesa> recuperaMesasAbertas(){
        return entityManager.createQuery("FROM Mesa m  ").getResultList();
    }

    @Transactional
    public List<Mesa> recuperaMesas(){
        return entityManager.createQuery("FROM Mesa m ").getResultList();
    }
}
