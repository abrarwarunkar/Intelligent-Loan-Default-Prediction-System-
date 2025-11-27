package com.loan.system.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "loan_applications")
public class LoanApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Personal Details
    private Integer age;
    private String maritalStatus;
    private Integer dependents;
    private String jobType;

    // Financial Details
    private Double income; // Monthly Income
    private Double existingEmis;
    private Double monthlyExpenses;
    private Integer creditScore;
    private Integer monthsEmployed;
    private Integer numCreditLines;
    private Double dtiRatio;

    // Loan Details
    private Double loanAmount;
    private Integer loanTerm; // In months
    private Double interestRate;
    private String loanPurpose; // HOME, EDUCATION, PERSONAL, BUSINESS

    private String status; // PENDING, APPROVED, REJECTED
    
    private LocalDateTime applicationDate;

    @PrePersist
    protected void onCreate() {
        applicationDate = LocalDateTime.now();
        status = "PENDING";
    }
}
