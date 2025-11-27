package com.loan.system.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private String role; // USER, ADMIN

    // Profile Details
    private String fullName;
    private String phone;
    private Double income;
    private String employmentType; // e.g., SALARIED, SELF_EMPLOYED
}
