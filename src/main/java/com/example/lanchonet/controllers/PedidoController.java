package com.example.lanchonet.controllers;

import com.example.lanchonet.entidades.Pedido;
import com.example.lanchonet.negocio.PedidoNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/Pedido")
@CrossOrigin("*")
public class PedidoController {

    @Autowired
    private PedidoNegocio pedidoNegocio;

    @PostMapping("/Salvar")
    public void salvar(@RequestBody Pedido pedido){
        pedidoNegocio.salvarPedido(pedido);
    }

    @PostMapping("/FecharPedidoPago")
    public void fecharPedidoPago(@RequestBody Pedido pedido){
        pedidoNegocio.fecharPedidoPago(pedido);
    }

    @PostMapping("/FecharPedidoFiado")
    public void fecharPedidoFiado(@RequestBody Pedido pedido){
        pedidoNegocio.fecharPedidoFiado(pedido);
    }

    @PostMapping("/CancelarFechamentoPedido")
    public void cancelarFechamentoPedido(@RequestBody Pedido pedido){
        pedidoNegocio.cancelarFechamentoPedido(pedido);
    }
}
