// com.artisans.dto.UserMeResponse.java
package com.artisans.dto;

import java.util.List;

public class UserMeResponse {

    private Integer id;
    private String email;
    private String name;
    private List<String> roles;

    public UserMeResponse(Integer id, String email, String name, List<String> roles) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.roles = roles;
    }

    public Integer getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public List<String> getRoles() {
        return roles;
    }
}
