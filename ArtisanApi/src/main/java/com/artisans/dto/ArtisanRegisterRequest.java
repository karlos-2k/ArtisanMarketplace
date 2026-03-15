package com.artisans.dto;

public class ArtisanRegisterRequest {

	 private String name;
    private String email;
    private String password;
    private String bio;
    private String instagramLink;

    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getName() { return name; }
    public String getBio() { return bio; }
    public String getInstagramLink() { return instagramLink; }
}
