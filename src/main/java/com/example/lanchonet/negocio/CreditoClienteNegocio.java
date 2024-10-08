package com.example.lanchonet.negocio;

import com.example.lanchonet.dtos.PagamentoDto;
import com.example.lanchonet.entidades.*;
import com.example.lanchonet.facades.*;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CreditoClienteNegocio {

    @Autowired
    private CreditoClienteFacade facade;

    @Autowired
    private PessoaFacade pessoaFacade;

    @Autowired
    private TipoPagamentoFacade tipoPagamentoFacade;

    @Autowired
    private MovimentoCreditoClienteFacade movimentoCreditoClienteFacade;

    @Autowired
    private PagamentoCreditoClienteFacade pagamentoCreditoClienteFacade;

    public void geraMovimentoCreditoCliente(Venda venda) {
        try {
            CreditoCliente creditoCliente = facade.recuperaCreditoPorPessoa(venda.getPessoa().getId());

            if (creditoCliente == null)
                creditoCliente = new CreditoCliente();

            creditoCliente.setPessoa(venda.getPessoa());
            Hibernate.initialize(creditoCliente.getMovimentoCreditoClientes());

            MovimentoCreditoCliente movimentoCreditoCliente = montaMovimentoCreditoCliente(venda);
            movimentoCreditoCliente.setCreditoCliente(creditoCliente);

            creditoCliente.getMovimentoCreditoClientes().add(movimentoCreditoCliente);

            creditoCliente.setValorTotal(creditoCliente.getValorTotal().add(movimentoCreditoCliente.getValor()));

            facade.save(creditoCliente);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void geraPagamentoCreditoCliente(PagamentoDto pagamentoDto) {
        try {

            Pessoa pessoa = getPessoa(pagamentoDto.getPessoaId());
            CreditoCliente creditoCliente = facade.recuperaCreditoPorPessoa(pessoa.getId());

            if (creditoCliente == null)
                creditoCliente = new CreditoCliente();

            creditoCliente.setPessoa(pessoa);
            Hibernate.initialize(creditoCliente.getPagamentoCreditoClientes());

            PagamentoCreditoCliente pagamentoCreditoCliente = montaPagamentoCreditoCliente(pagamentoDto);
            pagamentoCreditoCliente.setCreditoCliente(creditoCliente);

            creditoCliente.getPagamentoCreditoClientes().add(pagamentoCreditoCliente);

            creditoCliente.setValorTotal(creditoCliente.getValorTotal().subtract(pagamentoCreditoCliente.getValor()));

            facade.save(creditoCliente);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private MovimentoCreditoCliente montaMovimentoCreditoCliente(Venda venda) {
        MovimentoCreditoCliente movimentoCreditoCliente = new MovimentoCreditoCliente();
        movimentoCreditoCliente.setValor(venda.getValorTotal());
        movimentoCreditoCliente.setVenda(venda);
        return movimentoCreditoCliente;
    }

    private PagamentoCreditoCliente montaPagamentoCreditoCliente(PagamentoDto dto) throws Exception {
        PagamentoCreditoCliente pagamentoCreditoCliente = new PagamentoCreditoCliente();
        pagamentoCreditoCliente.setValor(dto.getValor());

        TipoPagamento tipoPagamento = tipoPagamentoFacade.findById(dto.getTipoPagamentoId());

        if (tipoPagamento == null)
            throw new Exception("Tipo de pagamento no encontrado");

        pagamentoCreditoCliente.setTipoPagamento(tipoPagamento);
        return pagamentoCreditoCliente;
    }

    private Pessoa getPessoa(Long id) throws Exception {
        Pessoa pessoa = pessoaFacade.findById(id);

        if (pessoa == null) {
            throw new Exception("Cliente não encontrado!");
        }

        return pessoa;
    }


}
