package com.example.lanchonet.controllers;

import com.example.lanchonet.dtos.ItemPedidoDto;
import com.example.lanchonet.dtos.PedidoDto;
import com.example.lanchonet.dtos.PessoaDto;
import com.example.lanchonet.entidades.ItensPedido;
import com.example.lanchonet.entidades.Pedido;
import com.example.lanchonet.negocio.PedidoNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/Pedido")
@CrossOrigin("*")
public class PedidoController {

    @Autowired
    private PedidoNegocio pedidoNegocio;

    @GetMapping("/RecuperPedidosAbertos")
    public List<PedidoDto> recuperPedidosAbertos(){
        return pedidoNegocio.recuperPedidosAbertos();
    }

    @GetMapping("/RecuperPedidosFechados")
    public List<PedidoDto> recuperPedidosFechados(){
        return pedidoNegocio.recuperPedidosFechados();
    }

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

    @PostMapping("/RecuperarItensComanda")
    public List<ItemPedidoDto> recuperItensComanda(@RequestBody Long id){
        return pedidoNegocio.recuperItensComanda(id);
    }

    @PostMapping("/SalvaItemPedido")
    public void salvaItemPedido(ItemPedidoDto itemPedidoDto){
        pedidoNegocio.salvaItemPedido(itemPedidoDto);
    }
}
