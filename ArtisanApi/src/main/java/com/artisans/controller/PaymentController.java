package com.artisans.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.artisans.service.PaymentService;
import com.artisans.service.RazorpayService;
import com.razorpay.Order;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin
public class PaymentController {

    @Autowired
    private RazorpayService razorpayService;
    
    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-order")
    public Map<String, Object> createOrder(@RequestParam int amount) throws Exception {

        Order order = razorpayService.createOrder(amount);

        return Map.of(
            "id", order.get("id"),
            "amount", order.get("amount"),
            "currency", order.get("currency")
        );
    }
    @PostMapping("/verify")
    public String verifyPayment(@RequestBody Map<String, String> payload) {

        String paymentId = payload.get("razorpay_payment_id");

        paymentService.updatePayment(paymentId);

        return "Payment verified";
    }
}