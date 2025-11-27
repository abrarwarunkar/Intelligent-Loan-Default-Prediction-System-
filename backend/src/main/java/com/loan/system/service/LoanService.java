package com.loan.system.service;

import com.loan.system.model.LoanApplication;
import com.loan.system.model.RiskPrediction;
import com.loan.system.repository.LoanApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LoanService {
    @Autowired
    private LoanApplicationRepository loanApplicationRepository;

    @Autowired
    private MLIntegrationService mlIntegrationService;

    public LoanApplication applyForLoan(LoanApplication application) {
        LoanApplication savedApp = loanApplicationRepository.save(application);
        
        // Trigger ML prediction
        mlIntegrationService.predictRisk(savedApp);
        
        return savedApp;
    }

    public List<LoanApplication> getLoansByUser(Long userId) {
        return loanApplicationRepository.findByUserId(userId);
    }
    
    public List<LoanApplication> getAllLoans() {
        return loanApplicationRepository.findAll();
    }

    public Optional<LoanApplication> getLoanById(Long id) {
        return loanApplicationRepository.findById(id);
    }

    public LoanApplication updateLoanStatus(Long id, String status) {
        LoanApplication application = loanApplicationRepository.findById(id).orElseThrow(() -> new RuntimeException("Loan not found"));
        application.setStatus(status);
        return loanApplicationRepository.save(application);
    }

    @Autowired
    private com.loan.system.repository.RiskPredictionRepository riskPredictionRepository;

    public RiskPrediction getRiskPrediction(Long applicationId) {
        return riskPredictionRepository.findByApplicationId(applicationId);
    }
}
