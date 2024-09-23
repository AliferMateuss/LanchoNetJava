package com.example.lanchonet.negocio;

import com.example.lanchonet.entidades.ContasAPagar;
import com.example.lanchonet.entidades.ContasAReceber;
import com.example.lanchonet.facades.ContaPagarFacade;
import com.example.lanchonet.facades.ContaReceberFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContaAPagarNegocio {

    @Autowired
    private ContaPagarFacade facade;

    public void salvarContaAReceber(ContasAPagar contasAPagar) {
        facade.save(contasAPagar);
    }

    public ContasAPagar buscarContaAReceberPorId(Long id) {
        return facade.findById(id);
    }

    public List<ContasAPagar> buscarContaAPagar() {
        return facade.findAll();
    }

    public void excluirContaAReceber(ContasAPagar contasAPagar) {
        facade.delete(contasAPagar);
    }

    public void excluirContaAReceber(Long id) {
        facade.deleteById(id);
    }
}
