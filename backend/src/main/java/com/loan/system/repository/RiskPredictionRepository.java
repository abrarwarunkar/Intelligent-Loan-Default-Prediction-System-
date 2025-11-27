package com.loan.system.repository;

import com.loan.system.model.RiskPrediction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RiskPredictionRepository extends JpaRepository<RiskPrediction, Long> {
    RiskPrediction findByApplicationId(Long applicationId);
}
