package com.dakshin.SpringEcom.repo;

import com.dakshin.SpringEcom.model.Order;
import com.dakshin.SpringEcom.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepo extends JpaRepository<Order,Integer> {
    Optional<Order> findByOrderId(String orderId);

}
