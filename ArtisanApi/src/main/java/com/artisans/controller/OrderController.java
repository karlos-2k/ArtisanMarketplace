package com.artisans.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.artisans.dto.CreateOrderRequest;
import com.artisans.entity.Order;
import com.artisans.service.OrderService;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/create")
    public Order createOrder(@RequestBody CreateOrderRequest request) {

        return orderService.createOrder(request);
    }
}