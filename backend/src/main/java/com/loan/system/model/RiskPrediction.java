package com.loan.system.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "risk_predictions")
public class RiskPrediction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "application_id", nullable = false)
    private LoanApplication application;

    private double defaultProbability;
    private String riskLevel;
    
    @Column(columnDefinition = "TEXT")
    private String explanation; // JSON string of SHAP values

    private LocalDateTime predictionDate;

    @PrePersist
    protected void onCreate() {
        predictionDate = LocalDateTime.now();
    }
}
