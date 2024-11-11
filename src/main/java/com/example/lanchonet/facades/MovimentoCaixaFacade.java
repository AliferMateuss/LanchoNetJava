package com.example.lanchonet.facades;

import com.example.lanchonet.dtos.MovimentoCaixaDto;
import com.example.lanchonet.entidades.Caixa;
import com.example.lanchonet.entidades.Compra;
import com.example.lanchonet.entidades.MovimentoCaixa;
import com.example.lanchonet.entidades.Venda;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class MovimentoCaixaFacade extends AbstractFacade<MovimentoCaixa, Long> {

    public MovimentoCaixaFacade() {
        super(MovimentoCaixa.class);
    }

    public List<MovimentoCaixaDto> retornaMovimentoPorId(Long id){
        return entityManager.createQuery("SELECT new com.example.lanchonet.dtos.MovimentoCaixaDto(" +
                        "m.id," +
                        "m.tipoMovimento," +
                        "CASE WHEN tp IS NULL THEN 'N/A' ELSE tp.nome END," +
                        "m.valor," +
                        "m.dataMovimento" +
                        ") FROM MovimentoCaixa m LEFT JOIN m.tipoPagamento tp WHERE m.caixa.id = :id ", MovimentoCaixaDto.class)
                .setParameter("id", id)
                .getResultList();
    }

    @Transactional
    public void excluiMovimentacaoPorCompra(Compra compra){
        TypedQuery<MovimentoCaixa> q = entityManager.createQuery("DELETE FROM MovimentoCaixa v WHERE v.compra = :compra", MovimentoCaixa.class);
        q.setParameter("compra", compra);
        q.executeUpdate();
    }

    @Transactional
    public void excluiMovimentacaoPorVenda(Venda venda){
        TypedQuery<MovimentoCaixa> q = entityManager.createQuery("DELETE FROM MovimentoCaixa v WHERE v.venda = :venda", MovimentoCaixa.class);
        q.setParameter("venda", venda);
        q.executeUpdate();
    }
}
