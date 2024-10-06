package com.example.lanchonet.negocio;

import com.example.lanchonet.entidades.ContasAPagar;
import com.example.lanchonet.entidades.ContasAReceber;
import com.example.lanchonet.enums.StatusConta;
import com.example.lanchonet.facades.ContaPagarFacade;
import com.example.lanchonet.facades.ContaReceberFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ContaAPagarNegocio {

    @Autowired
    private ContaPagarFacade facade;

    public void baixar(ContasAPagar conta) {

        ContasAPagar contaSalva = facade.findById(conta.getId());
        if(conta.getValor().equals(BigDecimal.ZERO)){
            contaSalva.setValor(BigDecimal.ZERO);
            contaSalva.setStatus(StatusConta.FECHADA);
        } else {
            contaSalva.setValor(conta.getValor());
            contaSalva.setStatus(StatusConta.PARCIAL);
        }

        facade.save(contaSalva);
    }

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
