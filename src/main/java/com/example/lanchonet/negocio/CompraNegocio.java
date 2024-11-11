package com.example.lanchonet.negocio;

import com.example.lanchonet.dtos.CompraDto;
import com.example.lanchonet.dtos.ItemCompraDto;
import com.example.lanchonet.dtos.ItemVendaDto;
import com.example.lanchonet.dtos.VendaDto;
import com.example.lanchonet.entidades.*;
import com.example.lanchonet.enums.StatusConta;
import com.example.lanchonet.enums.TipoCompra;
import com.example.lanchonet.facades.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
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
    @Autowired
    private TipoPagamentoFacade tipoPagamentoFacade;

    public void salvarCompra(Compra compra) {
        try {
            if(compra.getPessoaId() == null){
                throw new Exception("Cliente não definido para compra, selecione o cliente ou clique em compra balção");
            }
            setPessoa(compra);
            setUsuario(compra);
            setTipoPagamento(compra);
            manipulaProdutos(compra);
            criaContasAPagar(compra);
            Compra compraSalva = compraFacade.save(compra);
            caixaNegocio.gerarMovimentacao(compraSalva);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    public List<CompraDto> recuperComprasFechadas() {
        return compraFacade.comprasFechadas();
    }

    public List<ItemCompraDto> recuperItensCompra(Long id) {
        return compraFacade.recuperItensCompra(id);
    }

    private void manipulaProdutos(Compra compra) throws Exception {
        try{
            compra.getItensCompra().forEach(item -> {
                Produto produto = produtoFacade.findById(item.getProdutoId());
                if (produto != null) {
                    produto.setQuantidade(produto.getQuantidade()  + item.getQuantidade());
                    produto.setPrecoCompra(item.getPrecoUnitario());
                    item.setProduto(produto);
                    item.setCompra(compra);
                } else {
                    throw new RuntimeException("Produto não encontrado!");
                }
            });
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    

    private void criaContasAPagar(Compra compra){
        if (compra.getParcelas() != null && compra.getParcelas() != 0) {
            List<ContasAPagar> contasAPagarList = new ArrayList<>();
            BigDecimal valorParcela = compra.getValorTotal().divide(new BigDecimal(compra.getParcelas()), 2, RoundingMode.HALF_UP);
            BigDecimal total = valorParcela.multiply(new BigDecimal(compra.getParcelas()));
            BigDecimal resto = compra.getValorTotal().subtract(total);
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

                contasAPagarList.add(contaAPagar);
            }
            compra.setContasAPagar(contasAPagarList);
        }
    }

    private void setPessoa(Compra compra)throws Exception{
        if(compra.getPessoaId() != null){
            Pessoa pessoa = pessoaFacade.findById(compra.getPessoaId());
            if(pessoa == null){
                throw new Exception("Cliente não encontrado!");
            }
            compra.setPessoa(pessoa);
        }
    }

    private void setUsuario(Compra compra)throws Exception{
        compra.setUsuarioId(1L);
        if(compra.getUsuarioId() != null){
            Usuario usuario = usuarioFacade.findById(compra.getUsuarioId());
            if(usuario == null){
                throw new Exception("Usuário não encontrado!");
            }
            compra.setUsuario(usuario);
        }
    }

    private void setTipoPagamento(Compra compra) throws Exception {
        if (compra.getTipoPagamentoId() != null) {
            TipoPagamento tp = tipoPagamentoFacade.findById(compra.getTipoPagamentoId());
            if (tp == null) {
                throw new Exception("Tipo Pagamento não encontrado!");
            }
            compra.setTipoPagamento(tp);
        }
    }
}