package com.example.lanchonet.facades;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public abstract class AbstractFacade<T, ID> {

    @PersistenceContext
    protected EntityManager entityManager;

    private Class<T> entityClass;

    public AbstractFacade(Class<T> entityClass) {
        this.entityClass = entityClass;
    }

    public T save(T entity) {
        return entityManager.merge(entity);
    }

    public T findById(ID id) {
        return entityManager.find(entityClass, id);
    }


    public void deleteById(ID id) {
        T entity = findById(id);
        if (entity != null) {
            entityManager.remove(entity);
        }
    }

    public void delete(T entity) {
        if (entity != null) {
            entityManager.remove(entity);
        }
    }

    public List<T> findAll() {
        String jpql = "SELECT e FROM " + entityClass.getSimpleName() + " e";
        return entityManager.createQuery(jpql, entityClass).getResultList();
    }
}
