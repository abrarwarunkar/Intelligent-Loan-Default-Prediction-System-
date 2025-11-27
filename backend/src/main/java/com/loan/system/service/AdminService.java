package com.loan.system.service;

import com.loan.system.model.LoanApplication;
import com.loan.system.model.RiskPrediction;
import com.loan.system.repository.LoanApplicationRepository;
import com.loan.system.repository.RiskPredictionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private LoanApplicationRepository loanApplicationRepository;

    @Autowired
    private RiskPredictionRepository riskPredictionRepository;

    public Map<String, Long> getMonthlyApplicationTrends() {
        List<LoanApplication> allLoans = loanApplicationRepository.findAll();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

        return allLoans.stream()
                .collect(Collectors.groupingBy(
                        loan -> loan.getApplicationDate().format(formatter),
                        Collectors.counting()
                ));
    }

    public Map<String, Long> getRiskDistribution() {
        List<RiskPrediction> allPredictions = riskPredictionRepository.findAll();
        
        Map<String, Long> distribution = new HashMap<>();
        distribution.put("High", 0L);
        distribution.put("Medium", 0L);
        distribution.put("Low", 0L);

        for (RiskPrediction prediction : allPredictions) {
            String riskLevel = prediction.getRiskLevel();
            distribution.put(riskLevel, distribution.getOrDefault(riskLevel, 0L) + 1);
        }
        return distribution;
    }

    public String exportLoanApplications() {
        List<LoanApplication> loans = loanApplicationRepository.findAll();
        StringBuilder csv = new StringBuilder();
        csv.append("ID,User,Amount,Status,Date,Risk Level\n");

        for (LoanApplication loan : loans) {
            RiskPrediction risk = riskPredictionRepository.findByApplicationId(loan.getId());
            String riskLevel = (risk != null) ? risk.getRiskLevel() : "N/A";
            
            csv.append(String.format("%d,%s,%.2f,%s,%s,%s\n",
                    loan.getId(),
                    loan.getUser().getUsername(),
                    loan.getLoanAmount(),
                    loan.getStatus(),
                    loan.getApplicationDate().toString(),
                    riskLevel
            ));
        }
        return csv.toString();
    }
}
