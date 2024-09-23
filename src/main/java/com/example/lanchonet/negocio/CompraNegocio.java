package com.example.lanchonet.negocio;

import com.example.lanchonet.entidades.*;
import com.example.lanchonet.enums.StatusConta;
import com.example.lanchonet.enums.TipoCompra;
import com.example.lanchonet.facades.PessoaFacade;
import com.example.lanchonet.facades.ProdutoFacade;
import com.example.lanchonet.facades.UsuarioFacade;
import com.example.lanchonet.facades.CompraFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class CompraNegocio {

    @Autowired
    private CompraFacade compraFacade;
    @Autowired
    private ProdutoFacade produtoFacade;
    @Autowired
    private PessoaFacade pessoaFacade;
    @Autowired
    private UsuarioFacade usuarioFacade;
    @Autowired
    private CaixaNegocio caixaNegocio;
    private static final String ERRO_ESTOQUE = "Estoque insuficiente para o produto - \n %s!! Quantidade da compra: %d, Quantidade em estoque: %d";

    public void salvarCompra(Compra compra) {
        try {
            setPessoa(compra);
            setUsuario(compra);
            if(compra.getPessoa() == null && !compra.getCompraBalcao()){
                throw new Exception("Cliente não definida para compra, selecione o cliente ou clique em compra balção");
            }
            manipulaProdutos(compra);
            criaContasAPagar(compra);
            caixaNegocio.gerarMovimentacao(compra);
            compraFacade.save(compra);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    private void manipulaProdutos(Compra compra) throws Exception {
        try{
            compra.getItensCompra().forEach(item -> {
                Produto produto = produtoFacade.findById(item.getProduto().getId());
                if (produto != null) {
                    produto.setQuantidade(produto.getQuantidade() - item.getQuantidade());
                    produto.setPrecoCompra(item.getPrecoUnitario());
                    item.setCompra(compra);

                } else {
                    throw new RuntimeException("Produto inexistente");
                }
            });
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    

    private void criaContasAPagar(Compra compra){
        if (compra.getParcelas() != null && compra.getParcelas() != 0) {
            List<ContasAPagar> contasAReceber = new ArrayList<>();
            BigDecimal valorParcela = new BigDecimal(Math.floor(compra.getValorTotal().doubleValue() / compra.getParcelas().doubleValue()));
            BigDecimal resto = new BigDecimal(compra.getValorTotal().doubleValue() % compra.getParcelas().doubleValue());
            BigDecimal ultimaParcela = valorParcela.add(resto);

            for (int i = 1; i <= compra.getParcelas(); i++) {
                ContasAPagar contaAPagar = new ContasAPagar();
                contaAPagar.setFornecedor(compra.getPessoa());
                contaAPagar.setCompra(compra);
                contaAPagar.setParcela(i);
                contaAPagar.setDataConta(compra.getDataCompra());
                LocalDate data = compra.getDataCompra().toInstant().atZone(ZoneId.systemDefault())
                        .toLocalDate();
                Date dataVencimento = Date.from(data.plusMonths(i).atStartOfDay()
                        .atZone(ZoneId.systemDefault())
                        .toInstant());
                contaAPagar.setDataVencimento(dataVencimento);
                LocalDate LocaldataComp = dataVencimento.toInstant().atZone(ZoneId.systemDefault())
                        .toLocalDate();
                Date dataComp = Date.from(LocaldataComp.plusMonths(i).atStartOfDay()
                        .atZone(ZoneId.systemDefault())
                        .toInstant());
                contaAPagar.setDataCompetencia(data.getDayOfMonth() > 25
                        ? dataComp
                        : compra.getDataCompra());
                contaAPagar.setValor(i == compra.getParcelas() ? ultimaParcela : valorParcela);
                contaAPagar.setStatus(StatusConta.ABERTA);

                contasAReceber.add(contaAPagar);
            }
            compra.setContasAPagar(contasAReceber);
        }
    }

    private void setPessoa(Compra compra)throws Exception{
        if(compra.getId() != null){
            Pessoa pessoa = pessoaFacade.findById(compra.getPessoaId());
            if(pessoa == null){
                throw new Exception("Cliente não encontrado!");
            }
            compra.setPessoa(pessoa);
        }
    }

    private void setUsuario(Compra compra)throws Exception{
        if(compra.getId() != null){
            Usuario usuario = usuarioFacade.findById(compra.getUsuarioId());
            if(usuario == null){
                throw new Exception("Usuário não encontrado!");
            }
            compra.setUsuario(usuario);
        }
    }
}