package com.example.lanchonet.negocio;

import com.example.lanchonet.entidades.*;
import com.example.lanchonet.enums.StatusConta;
import com.example.lanchonet.enums.StatusMesa;
import com.example.lanchonet.enums.StatusVenda;
import com.example.lanchonet.enums.TipoVenda;
import com.example.lanchonet.facades.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class VendaNegocio {

    @Autowired
    private VendaFacade vendaFacade;
    @Autowired
    private ProdutoFacade produtoFacade;
    @Autowired
    private PessoaFacade pessoaFacade;
    @Autowired
    private UsuarioFacade usuarioFacade;
    @Autowired
    private TipoPagamentoFacade tipoPagamentoFacade;
    @Autowired
    private CaixaNegocio caixaNegocio;
    private static final String ERRO_ESTOQUE = "Estoque insuficiente para o produto - \n %s!! Quantidade da venda: %d, Quantidade em estoque: %d";

    public void salvarVenda(Venda venda) {
        try {
            setPessoa(venda);
            setUsuario(venda);
            setTipoPagamento(venda);
            if(venda.getPessoa() == null && !venda.getVendaBalcao()){
                throw new Exception("Cliente não definida para venda, selecione o cliente ou clique em venda balção");
            }
            validaEstoque(venda);
            if(venda.getVendaBalcao()){
                venda.setTipoVenda(TipoVenda.BALCAO);
            } else if (venda.getVendaFiado()){
                venda.setTipoVenda(TipoVenda.FIADO);
            }else{
                venda.setTipoVenda(TipoVenda.CLIENTE);
                criaContasAReceber(venda);
            }
            venda.setStatusVenda(StatusVenda.FECHADA);
            Venda vendaSalva = vendaFacade.save(venda);
            caixaNegocio.gerarMovimentacao(vendaSalva);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    public void salvarVendaPedido(Venda venda){
        try{
            venda.setTipoVenda(TipoVenda.FIADO);
            venda.setStatusVenda(StatusVenda.FECHADA);
            venda.setDataVenda(new Date());
            venda = vendaFacade.save(venda);
            caixaNegocio.gerarMovimentacao(venda);
        }catch (Exception e){
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    private void validaEstoque(Venda venda) throws Exception {
        try{
            venda.getItensVenda().forEach(item -> {
                Produto produto = produtoFacade.findById(item.getProdutoId());
                if (produto != null) {
                    if (produto.getQuantidade() < item.getQuantidade()) {
                        throw new RuntimeException(String.format(ERRO_ESTOQUE, item.getProduto().getNome(), item.getQuantidade(), produto.getQuantidade()));
                    } else {
                        produto.setQuantidade(produto.getQuantidade() - item.getQuantidade());
                    }
                    item.setVenda(venda);
                    item.setProduto(produto);
                } else {
                    throw new RuntimeException("Produto inexistente");
                }
            });
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    private void criaContasAReceber(Venda venda){
        if (venda.getParcelas() != null && venda.getParcelas() != 0) {
            List<ContasAReceber> contasAReceber = new ArrayList<>();
            BigDecimal valorParcela = new BigDecimal(Math.floor(venda.getValorTotal().doubleValue() / venda.getParcelas().doubleValue()));
            BigDecimal resto = new BigDecimal(venda.getValorTotal().doubleValue() % venda.getParcelas().doubleValue());
            BigDecimal ultimaParcela = valorParcela.add(resto);

            for (int i = 1; i <= venda.getParcelas(); i++) {
                ContasAReceber contaAReceber = new ContasAReceber();
                contaAReceber.setPessoa(venda.getPessoa());
                contaAReceber.setVenda(venda);
                contaAReceber.setParcela(i);
                contaAReceber.setDataConta(venda.getDataVenda());
                LocalDate data = venda.getDataVenda().toInstant().atZone(ZoneId.systemDefault())
                        .toLocalDate();
                Date dataVencimento = Date.from(data.plusMonths(i).atStartOfDay()
                        .atZone(ZoneId.systemDefault())
                        .toInstant());
                contaAReceber.setDataVencimento(dataVencimento);
                LocalDate LocaldataComp = dataVencimento.toInstant().atZone(ZoneId.systemDefault())
                        .toLocalDate();
                Date dataComp = Date.from(LocaldataComp.plusMonths(i).atStartOfDay()
                        .atZone(ZoneId.systemDefault())
                        .toInstant());
                contaAReceber.setDataCompetencia(data.getDayOfMonth() > 25
                        ? dataComp
                        : venda.getDataVenda());
                contaAReceber.setValor(i == venda.getParcelas() ? ultimaParcela : valorParcela);
                contaAReceber.setStatus(StatusConta.ABERTA);

                contasAReceber.add(contaAReceber);
            }
            venda.setContasAReceber(contasAReceber);
        }
    }

    private void setPessoa(Venda venda)throws Exception{
        if(venda.getPessoaId() != null){
            Pessoa pessoa = pessoaFacade.findById(venda.getPessoaId());
            if(pessoa == null){
                throw new Exception("Cliente não encontrado!");
            }
            venda.setPessoa(pessoa);
        }
    }

    private void setUsuario(Venda venda)throws Exception{
        if(venda.getUsuarioId() != null){
            Usuario usuario = usuarioFacade.findById(venda.getUsuarioId());
            if(usuario == null){
                throw new Exception("Usuário não encontrado!");
            }
            venda.setUsuario(usuario);
        }
    }

    private void setTipoPagamento(Venda venda)throws Exception{
        if(venda.getTipoPagamentoId() != null){
            TipoPagamento tp = tipoPagamentoFacade.findById(venda.getTipoPagamentoId());
            if(tp == null){
                throw new Exception("Cliente não encontrado!");
            }
            venda.setTipoPagamento(tp);
        }
    }
}