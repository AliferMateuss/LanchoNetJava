package com.example.lanchonet.negocio;

import com.example.lanchonet.dtos.ContasPagarDto;
import com.example.lanchonet.dtos.ContasReceberDto;
import com.example.lanchonet.entidades.ContasAPagar;
import com.example.lanchonet.entidades.ContasAReceber;
import com.example.lanchonet.entidades.TipoPagamento;
import com.example.lanchonet.entidades.Venda;
import com.example.lanchonet.enums.StatusConta;
import com.example.lanchonet.facades.ContaReceberFacade;
import com.example.lanchonet.facades.TipoPagamentoFacade;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ContaAReceberNegocio {

    @Autowired
    private ContaReceberFacade facade;
    @Autowired
    private CaixaNegocio caixaNegocio;
    @Autowired
    private TipoPagamentoFacade tipoPagamentoFacade;

    public void baixar(ContasReceberDto dto) {

        try {
            ContasAReceber contaSalva = facade.findById(dto.getId());
            contaSalva.setTipoPagamentoId(dto.getTipoPagamentoId());
            contaSalva.setVendaId(dto.getVendaId());
            setTipoPagamento(contaSalva);
            if(dto.getValor().equals(BigDecimal.ZERO)){
                contaSalva.setStatus(StatusConta.FECHADA);
                contaSalva.setValor(dto.getValor());
            } else {
                contaSalva.setValor(dto.getValor());
                contaSalva.setStatus(StatusConta.PARCIAL);
            }
            facade.save(contaSalva);
            caixaNegocio.gerarMovimentacao(contaSalva);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void salvarContaAReceber(ContasAReceber contaAReceber) {
        facade.save(contaAReceber);
    }

    public ContasAReceber buscarContaAReceberPorId(Long id) {
        return facade.findById(id);
    }

    public List<ContasReceberDto> buscarContaARecebers() {
        return facade.findAllDto();
    }

    public void excluirContaAReceber(ContasAReceber contaAReceber) {
        facade.delete(contaAReceber);
    }

    public void excluirContaAReceber(Long id) {
        facade.deleteById(id);
    }


    private void setTipoPagamento(ContasAReceber conta) throws Exception {
        if (conta.getTipoPagamentoId() != null) {
            TipoPagamento tp = tipoPagamentoFacade.findById(conta.getTipoPagamentoId());
            if (tp == null) {
                throw new Exception("Tipo Pagamento não encontrado!");
            }
            conta.setTipoPagamento(tp);
        } else {
            throw  new Exception("Tipo Pagamento não informado!");
        }
    }

}
