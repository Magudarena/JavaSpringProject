package com.example.demo.repository;

import com.example.crudapp.model.Item;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class ItemRepository {
    private List<Item> items = new ArrayList<>();
    private Long currentId = 1L;

    public List<Item> findAll() {
        return items;
    }

    public Optional<Item> findById(Long id) {
        return items.stream().filter(item -> item.getId().equals(id)).findFirst();
    }

    public Item save(Item item) {
        if (item.getId() == null) {
            item.setId(currentId++);
        }
        items.add(item);
        return item;
    }

    public boolean delete(Long id) {
        return items.removeIf(item -> item.getId().equals(id));
    }
}
