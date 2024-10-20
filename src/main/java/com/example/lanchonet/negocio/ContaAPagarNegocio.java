package com.example.lanchonet.negocio;

import com.example.lanchonet.dtos.ContasPagarDto;
import com.example.lanchonet.dtos.ContasReceberDto;
import com.example.lanchonet.entidades.ContasAPagar;
import com.example.lanchonet.entidades.ContasAReceber;
import com.example.lanchonet.entidades.TipoPagamento;
import com.example.lanchonet.entidades.Venda;
import com.example.lanchonet.enums.StatusConta;
import com.example.lanchonet.facades.ContaPagarFacade;
import com.example.lanchonet.facades.ContaReceberFacade;
import com.example.lanchonet.facades.TipoPagamentoFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ContaAPagarNegocio {

    @Autowired
    private ContaPagarFacade facade;
    @Autowired
    private CaixaNegocio caixaNegocio;
    @Autowired
    private TipoPagamentoFacade tipoPagamentoFacade;


    public void baixar(ContasPagarDto conta) {
        try {
            ContasAPagar contaSalva = facade.findById(conta.getId());
            contaSalva.setTipoPagamentoId(conta.getTipoPagamentoId());
            contaSalva.setCompraId(conta.getCompraId());
            setTipoPagamento(contaSalva);

            if(conta.getValor().equals(BigDecimal.ZERO)){
                contaSalva.setStatus(StatusConta.FECHADA);
                contaSalva.setValor(conta.getValor());
            } else {
                contaSalva.setValor(conta.getValor());
                contaSalva.setStatus(StatusConta.PARCIAL);
            }

            facade.save(contaSalva);
            caixaNegocio.gerarMovimentacao(contaSalva);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void salvarContaAReceber(ContasAPagar contasAPagar) {
        facade.save(contasAPagar);
    }

    public ContasAPagar buscarContaAReceberPorId(Long id) {
        return facade.findById(id);
    }

    public List<ContasPagarDto> buscarContaAPagar() {
        return facade.findAllDto();
    }

    public void excluirContaAReceber(ContasAPagar contasAPagar) {
        facade.delete(contasAPagar);
    }

    public void excluirContaAReceber(Long id) {
        facade.deleteById(id);
    }

    private void setTipoPagamento(ContasAPagar conta) throws Exception {
        if (conta.getTipoPagamentoId() != null) {
            TipoPagamento tp = tipoPagamentoFacade.findById(conta.getTipoPagamentoId());
            if (tp == null) {
                throw new Exception("Tipo pagamento não encontrado!");
            }
            conta.setTipoPagamento(tp);
        } else {
            throw  new Exception("Tipo Pagamento não informado!");
        }
    }
}
