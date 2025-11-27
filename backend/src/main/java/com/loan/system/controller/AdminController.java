package com.loan.system.controller;

import com.loan.system.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/analytics/monthly")
    public ResponseEntity<Map<String, Long>> getMonthlyTrends() {
        return ResponseEntity.ok(adminService.getMonthlyApplicationTrends());
    }

    @GetMapping("/analytics/risk")
    public ResponseEntity<Map<String, Long>> getRiskDistribution() {
        return ResponseEntity.ok(adminService.getRiskDistribution());
    }

    @GetMapping("/export")
    public ResponseEntity<String> exportData() {
        String csvData = adminService.exportLoanApplications();
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=loan_applications.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }
}
