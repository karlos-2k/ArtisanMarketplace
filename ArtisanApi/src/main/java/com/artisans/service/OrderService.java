package com.artisans.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.artisans.dto.CreateOrderRequest;
import com.artisans.dto.OrderItemRequest;
import com.artisans.entity.Order;
import com.artisans.entity.OrderItem;
import com.artisans.entity.Payment;
import com.artisans.entity.Product;
import com.artisans.entity.User;
import com.artisans.repository.OrderItemRepository;
import com.artisans.repository.OrderRepository;
import com.artisans.repository.PaymentRepository;
import com.artisans.repository.ProductRepository;
import com.artisans.repository.UserRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public Order createOrder(CreateOrderRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setStatus("PLACED");
        order.setPlacedAt(LocalDateTime.now());

        BigDecimal total = BigDecimal.ZERO;

        order = orderRepository.save(order);

        for (OrderItemRequest itemReq : request.getItems()) {

            Product product = productRepository
                    .findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setPrice(itemReq.getPrice());

            orderItemRepository.save(item);

            total = total.add(
                    itemReq.getPrice().multiply(
                            BigDecimal.valueOf(itemReq.getQuantity())));
        }

        order.setTotalAmount(total);
        orderRepository.save(order);

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setStatus("PENDING");

        paymentRepository.save(payment);

        return order;
    }
}