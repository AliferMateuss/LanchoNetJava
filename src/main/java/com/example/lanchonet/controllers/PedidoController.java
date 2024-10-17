package com.example.lanchonet.controllers;

import com.example.lanchonet.dtos.*;
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

    @PostMapping("/Excluir")
    public void excluir(@RequestBody Long id){
        pedidoNegocio.excluirPedido(id);
    }

    @PostMapping("/FecharPedido")
    public void fecharPedido(@RequestBody FechamentoPedidoDto pedido){
        pedidoNegocio.fecharPedido(pedido);
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
    public void salvaItemPedido(@RequestBody ItemPedidoDto itemPedidoDto){
        pedidoNegocio.salvaItemPedido(itemPedidoDto);
    }

    @PostMapping("/ExcluiItemPedido")
    public void excluiItemPedido(@RequestBody ExcluiItemDto dto){
        pedidoNegocio.excluirItemPedido(dto);
    }
}
