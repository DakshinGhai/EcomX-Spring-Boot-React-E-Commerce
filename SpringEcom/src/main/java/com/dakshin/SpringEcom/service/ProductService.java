package com.dakshin.SpringEcom.service;


import com.dakshin.SpringEcom.model.Product;
import com.dakshin.SpringEcom.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepo productRepo;
    public List<Product> getAllProducts(){
        return productRepo.findAll();
    };
}
