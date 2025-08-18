package com.example.demo.repository;

import com.example.demo.model.Item;
import com.example.demo.model.SubItem;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubItemRepository extends JpaRepository<SubItem, Long> {

}
