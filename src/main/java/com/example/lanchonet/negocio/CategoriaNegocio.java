package com.example.lanchonet.negocio;

import com.example.lanchonet.entidades.Categoria;
import com.example.lanchonet.entidades.GrupoUsuario;
import com.example.lanchonet.facades.CategoriaFacade;
import com.example.lanchonet.facades.GrupoUsuarioFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaNegocio {

    @Autowired
    private CategoriaFacade facade;

    public void salvarCategoria(Categoria categoria) {
        facade.save(categoria);
    }

    public Categoria buscarCategoriaPorId(Long id) {
        return facade.findById(id);
    }

    public List<Categoria> buscarCategorias() {
        return facade.findAll();
    }

    public void excluirCategoria(Categoria categoria) {
        facade.delete(categoria);
    }

    public void excluirCategoria(Long id) {
        facade.deleteById(id);
    }
}
