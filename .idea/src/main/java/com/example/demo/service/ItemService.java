package com.example.demo.service;

import com.example.crudapp.model.Item;
import com.example.crudapp.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItemService {

    private final ItemRepository itemRepository;

    @Autowired
    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Optional<Item> getItem(Long id) {
        return itemRepository.findById(id);
    }

    public Item createItem(Item item) {
        return itemRepository.save(item);
    }

    public Item updateItem(Long id, Item item) {
        if (itemRepository.findById(id).isPresent()) {
            item.setId(id);
            return itemRepository.save(item);
        }
        return null;
    }

    public boolean deleteItem(Long id) {
        return itemRepository.delete(id);
    }
}
