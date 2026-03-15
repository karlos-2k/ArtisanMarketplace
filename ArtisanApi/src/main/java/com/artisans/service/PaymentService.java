package com.artisans.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.artisans.entity.Payment;
import com.artisans.repository.PaymentRepository;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public void updatePayment(String paymentId) {

        Payment payment = paymentRepository
                .findTopByStatusOrderByIdDesc("PENDING")
                .orElseThrow();

        payment.setStatus("SUCCESS");
        payment.setTransactionId(paymentId);

        paymentRepository.save(payment);
    }
}
