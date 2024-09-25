package com.example.lanchonet.negocio;

import com.example.lanchonet.dtos.ProdutoDto;
import com.example.lanchonet.entidades.ItensCompra;
import com.example.lanchonet.entidades.ItensVenda;
import com.example.lanchonet.entidades.Produto;
import com.example.lanchonet.facades.ProdutoFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoNegocio {

    @Autowired
    private ProdutoFacade facade;

    public void salvarProduto(Produto produto) {
        facade.save(produto);
    }

    public Produto buscarProdutoPorId(Long id) {
        return facade.findById(id);
    }

    public List<ProdutoDto> buscarProdutos() {
        return facade.findAllDto();
    }

    public void excluirProduto(Produto produto) {
        facade.delete(produto);
    }

    public void excluirProduto(Long id) {
        facade.deleteById(id);
    }
}
