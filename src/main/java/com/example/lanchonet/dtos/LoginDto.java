package com.example.lanchonet.dtos;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

public class LoginDto {
    @Getter
    @Setter
    private String login;

    @Getter
    @Setter
    private String senha;
}
