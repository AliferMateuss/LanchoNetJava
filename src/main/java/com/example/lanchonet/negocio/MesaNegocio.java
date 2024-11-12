package com.example.lanchonet.negocio;

import com.example.lanchonet.entidades.Mesa;
import com.example.lanchonet.facades.MesaFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MesaNegocio {

    @Autowired
    private MesaFacade facade;

    public void salvarMesa(Mesa mesa) {
        facade.save(mesa);
    }

    public Mesa buscarMesaPorId(Long id) {
        return facade.findById(id);
    }

    public List<Mesa> buscarMesas() {
        return facade.recuperaMesas();
    }

    public List<Mesa> buscarMesasAbertas() {
        return facade.recuperaMesasAbertas();
    }

    public void excluirMesa(Mesa mesa) {
        facade.delete(mesa);
    }

    public void excluirMesa(Long id) {
        facade.deleteById(id);
    }
}
