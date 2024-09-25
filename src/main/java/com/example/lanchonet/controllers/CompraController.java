package com.example.lanchonet.controllers;

import com.example.lanchonet.entidades.Compra;
import com.example.lanchonet.negocio.CompraNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/Compra")
@CrossOrigin("*")
public class CompraController {

    @Autowired
    private CompraNegocio compraNegocio;

    @PostMapping("/Salvar")
    public void salvar(@RequestBody Compra compra){
        compraNegocio.salvarCompra(compra);
    }
}
