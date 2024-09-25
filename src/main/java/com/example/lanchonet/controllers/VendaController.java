package com.example.lanchonet.controllers;

import com.example.lanchonet.entidades.Pedido;
import com.example.lanchonet.entidades.Usuario;
import com.example.lanchonet.entidades.Venda;
import com.example.lanchonet.negocio.UsuarioNegocio;
import com.example.lanchonet.negocio.VendaNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/Venda")
@CrossOrigin("*")
public class VendaController {

    @Autowired
    private VendaNegocio vendaNegocio;

    @PostMapping("/Salvar")
    public void salvar(@RequestBody Venda venda){
        vendaNegocio.salvarVenda(venda);
    }
}
