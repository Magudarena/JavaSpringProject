package com.example.demo.controller;

import com.example.demo.model.Item;
import com.example.demo.model.SubItem;
import com.example.demo.repository.ItemRepository;
import com.example.demo.repository.SubItemRepository;
import com.example.demo.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/items")
public class ItemController {

    private final ItemService itemService;

    @Autowired
    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping
    public List<Item> getItems() {
        return itemService.getAllItems();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Item> getItem(@PathVariable Long id) {
        Optional<Item> item = itemService.getItem(id);
        return item.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Item> createItem(@RequestBody Item item) {
        Item createdItem = itemService.createItem(item);
        return new ResponseEntity<>(createdItem, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Item> updateItem(@PathVariable Long id, @RequestBody Item item) {
        Item updatedItem = itemService.updateItem(id, item);
        return updatedItem != null ? ResponseEntity.ok(updatedItem) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        return itemService.deleteItem(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @Autowired
    private SubItemRepository subItemRepository;

    @Autowired
    private ItemRepository itemRepository;


/*
    @PostMapping
    public ResponseEntity<SubItem> createSubItem(@RequestBody SubItem subItem) {
        if (subItem.getItem() == null || subItem.getItem().getId() == null) {
            return ResponseEntity.badRequest().build();
        }

        Item item = itemRepository.findById(subItem.getItem().getId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        subItem.setItem(item);
        SubItem saved = subItemRepository.save(subItem);
        return ResponseEntity.ok(saved);
    }
*/



}

