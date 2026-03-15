package com.artisans.service;

import org.json.JSONObject;
import org.springframework.stereotype.Service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;

@Service
public class RazorpayService {

    private static final String KEY = "rzp_test_SR6yxaUIjpZdFl";
    private static final String SECRET = "vuOX00rm8wCc2nLkyOIvDDaN";

    public Order createOrder(int amount) throws Exception {

        RazorpayClient client = new RazorpayClient(KEY, SECRET);

        JSONObject options = new JSONObject();
        options.put("amount", amount * 100); 
        options.put("currency", "INR");
        options.put("receipt", "order_rcptid_" + System.currentTimeMillis());

        return client.orders.create(options);
    }
}