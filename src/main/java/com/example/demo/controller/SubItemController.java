package com.example.demo.controller;

import com.example.demo.model.Item;
import com.example.demo.model.SubItem;
import com.example.demo.service.ItemService;
import com.example.demo.service.SubItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/items/{itemId}/subitems")
public class SubItemController {
    private final SubItemService subItemService;
    private final ItemService    itemService;

    public SubItemController(SubItemService subItemService, ItemService itemService) {
        this.subItemService = subItemService;
        this.itemService    = itemService;
    }

    @GetMapping
    public List<SubItem> list(@PathVariable Long itemId) {
        return subItemService.getByItem(itemId);
    }

    @PostMapping
    public ResponseEntity<SubItem> create(
            @PathVariable Long itemId,
            @RequestBody SubItem sub
    ) {
        SubItem saved = subItemService.create(itemId, sub);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubItem> update(
            @PathVariable Long itemId,
            @PathVariable Long id,
            @RequestBody SubItem sub
    ) {
        // opcjonalnie weryfikacja, czy sub.getItem().getId()==itemId
        SubItem updated = subItemService.update(id, sub);
        return updated != null
                ? ResponseEntity.ok(updated)
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long itemId,
            @PathVariable Long id
    ) {
        boolean deleted = subItemService.delete(id);
        return deleted
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
