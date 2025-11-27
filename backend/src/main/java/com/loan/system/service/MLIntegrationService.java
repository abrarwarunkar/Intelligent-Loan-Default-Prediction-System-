package com.loan.system.service;

import com.loan.system.model.LoanApplication;
import com.loan.system.model.RiskPrediction;
import com.loan.system.repository.RiskPredictionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.HashMap;
import java.util.Map;

@Service
public class MLIntegrationService {

    @Value("${ml.engine.url}")
    private String mlEngineUrl;

    @Autowired
    private RiskPredictionRepository riskPredictionRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    public RiskPrediction predictRisk(LoanApplication application) {
        // Prepare payload
        Map<String, Object> payload = new HashMap<>();
        payload.put("age", application.getAge());
        payload.put("income", application.getIncome());
        payload.put("loan_amount", application.getLoanAmount());
        payload.put("credit_score", application.getCreditScore());
        payload.put("months_employed", application.getMonthsEmployed());
        payload.put("num_credit_lines", application.getNumCreditLines());
        payload.put("interest_rate", application.getInterestRate());
        payload.put("loan_term", application.getLoanTerm());
        payload.put("dti_ratio", application.getDtiRatio());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        try {
            // Call ML API
            Map<String, Object> response = restTemplate.postForObject(mlEngineUrl, request, Map.class);

            if (response != null) {
                RiskPrediction prediction = new RiskPrediction();
                prediction.setApplication(application);
                prediction.setDefaultProbability((Double) response.get("default_probability"));
                prediction.setRiskLevel((String) response.get("risk_level"));
                
                // Convert explanation map to JSON string (simplified)
                Object explanation = response.get("explanation");
                prediction.setExplanation(explanation != null ? explanation.toString() : "{}");

                return riskPredictionRepository.save(prediction);
            }
        } catch (Exception e) {
            e.printStackTrace();
            // Handle error (maybe retry or set status to ERROR)
        }
        return null;
    }
}
