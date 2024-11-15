package com.example.lanchonet.negocio;

import com.example.lanchonet.dtos.LoginDto;
import com.example.lanchonet.entidades.GrupoUsuario;
import com.example.lanchonet.entidades.Pessoa;
import com.example.lanchonet.entidades.Usuario;
import com.example.lanchonet.entidades.Venda;
import com.example.lanchonet.facades.GrupoUsuarioFacade;
import com.example.lanchonet.facades.PessoaFacade;
import com.example.lanchonet.facades.UsuarioFacade;
import jakarta.persistence.NoResultException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class UsuarioNegocio {

    @Autowired
    private UsuarioFacade facade;

    @Autowired
    private PessoaFacade pessoaFacade;

    @Autowired
    private GrupoUsuarioFacade grupoUsuarioFacade;

    public Boolean logar(LoginDto dto){
        try{
            Usuario usuario = facade.recuperaPorLogin(dto.getLogin());
            return usuario.getSenha().equals(dto.getSenha());
        }
        catch (NoResultException e){
            new RuntimeException("Usuario não encontrado");
        }
        catch (Exception e){
            new RuntimeException(e.getMessage());
        }
        return false;
    }


    public void salvarUsuario(Usuario usuario) {
        try{
            setGrupoUsuario(usuario);
            setPessoa(usuario);
            usuario.setDataSenha(new Date());
            facade.save(usuario);
        } catch (Exception e){
            new RuntimeException(e.getMessage());
        }
    }

    public Usuario buscarUsuarioPorId(Long id) {
        Usuario usu =  facade.findById(id);
        usu.setGrupoUsuarioId(usu.getGrupoUsuario().getId());
        usu.setPessoaId(usu.getPessoa().getId());
        return usu;
    }

    public List<Usuario> buscarUsuarios() {
        return facade.findAll();
    }

    public void excluirUsuario(Usuario usuario) {
        facade.delete(usuario);
    }

    public void excluirUsuario(Long id) {
        facade.deleteById(id);
    }

    private void setPessoa(Usuario usuario)throws Exception{
        if(usuario.getPessoaId() != null){
            Pessoa pessoa = pessoaFacade.findById(usuario.getPessoaId());
            if(pessoa == null){
                throw new Exception("Cliente não encontrado!");
            }
            usuario.setPessoa(pessoa);
        }
    }

    private void setGrupoUsuario(Usuario usuario)throws Exception{
        if(usuario.getGrupoUsuarioId() != null){
            GrupoUsuario gp = grupoUsuarioFacade.findById(usuario.getGrupoUsuarioId());
            if(gp == null){
                throw new Exception("Grupo usuário não encontrado!");
            }
            usuario.setGrupoUsuario(gp);
        }
    }
}
