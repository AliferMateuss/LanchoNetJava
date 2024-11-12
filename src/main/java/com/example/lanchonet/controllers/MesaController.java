package com.example.lanchonet.controllers;

import com.example.lanchonet.entidades.Mesa;
import com.example.lanchonet.negocio.MesaNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/Mesa")
@CrossOrigin("*")
public class MesaController {

    @Autowired
    private MesaNegocio mesaNegocio;

    @GetMapping("/RecuperarMesas")
    public List<Mesa> recuperarMesas(){
        return mesaNegocio.buscarMesas();
    }

    @GetMapping("/RecuperarMesasAbertas")
    public List<Mesa> recuperarMesasAbertas(){
        return mesaNegocio.buscarMesasAbertas();
    }

    @PostMapping("/Salvar")

    public void salvar(@RequestBody Mesa mesa){
        mesaNegocio.salvarMesa(mesa);
    }

    @PostMapping("/RertornaPorId")

    public Mesa retornaPorId(@RequestBody Long id){
        return mesaNegocio.buscarMesaPorId(id);
    }

    @PostMapping("Deletar")
    public void Deletar(@RequestBody Long id){
        mesaNegocio.excluirMesa(id);
    }
}
