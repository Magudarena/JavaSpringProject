package com.example.demo.service;

import com.example.demo.model.Item;
import com.example.demo.model.SubItem;
import com.example.demo.repository.ItemRepository;
import com.example.demo.repository.SubItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SubItemService {

    private final SubItemRepository subItemRepository;
    private final ItemRepository itemRepository;

    public SubItemService(SubItemRepository subItemRepository,
                          ItemRepository itemRepository) {
        this.subItemRepository = subItemRepository;
        this.itemRepository = itemRepository;
    }

    /**
     * Pobiera wszystkie SubItemy powiązane z danym Itemem.
     */
    @Transactional(readOnly = true)
    public List<SubItem> getByItem(Long itemId) {
        // upewniamy się, że Item istnieje
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item o id " + itemId + " nie istnieje"));
        // filtrujemy po przypisaniu
        return subItemRepository.findAll().stream()
                .filter(s -> s.getItem().getId().equals(itemId))
                .collect(Collectors.toList());
    }

    /**
     * Tworzy nowy SubItem i przypisuje go do istniejącego Itemu.
     */
    @Transactional
    public SubItem create(Long itemId, SubItem subItem) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item o id " + itemId + " nie istnieje"));
        subItem.setItem(item);
        return subItemRepository.save(subItem);
    }

    /**
     * Aktualizuje nazwę i opis istniejącego SubItemu.
     * Zwraca zaktualizowany obiekt lub null, jeśli go nie ma.
     */
    @Transactional
    public SubItem update(Long id, SubItem data) {
        Optional<SubItem> existingOpt = subItemRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return null;
        }
        SubItem existing = existingOpt.get();
        existing.setName(data.getName());
        existing.setDescription(data.getDescription());
        return subItemRepository.save(existing);
    }

    /**
     * Usuwa SubItem o podanym ID.
     * Zwraca true jeśli istniał i został usunięty, false jeśli nie znaleziono.
     */
    @Transactional
    public boolean delete(Long id) {
        if (!subItemRepository.existsById(id)) {
            return false;
        }
        subItemRepository.deleteById(id);
        return true;
    }
}
