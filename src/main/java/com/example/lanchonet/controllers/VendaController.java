package com.example.lanchonet.controllers;

import com.example.lanchonet.dtos.ItemPedidoDto;
import com.example.lanchonet.dtos.ItemVendaDto;
import com.example.lanchonet.dtos.PedidoDto;
import com.example.lanchonet.dtos.VendaDto;
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

    @GetMapping("/RecuperarVendasFechadas")
    public List<VendaDto> recuperarVendasFechadas(){
        return vendaNegocio.recuperVendasFechadas();
    }

    @PostMapping("/RecuperarItensVenda")
    public List<ItemVendaDto> recuperarItensVendac(@RequestBody Long id){
        return vendaNegocio.recuperItensVenda(id);
    }
}
