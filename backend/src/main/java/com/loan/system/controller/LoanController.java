package com.loan.system.controller;

import com.loan.system.model.LoanApplication;
import com.loan.system.model.User;
import com.loan.system.service.LoanService;
import com.loan.system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loan")
@CrossOrigin(origins = "*")
public class LoanController {

    @Autowired
    private LoanService loanService;
    
    @Autowired
    private UserService userService;

    @PostMapping("/apply")
    public ResponseEntity<?> applyForLoan(@RequestBody LoanApplication application, @RequestParam String username) {
        User user = userService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        application.setUser(user);
        return ResponseEntity.ok(loanService.applyForLoan(application));
    }

    @GetMapping("/my-loans")
    public ResponseEntity<List<LoanApplication>> getMyLoans(@RequestParam String username) {
        User user = userService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(loanService.getLoansByUser(user.getId()));
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<LoanApplication>> getAllLoans() {
        return ResponseEntity.ok(loanService.getAllLoans());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoanApplication> getLoanById(@PathVariable Long id) {
        return loanService.getLoanById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<LoanApplication> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(loanService.updateLoanStatus(id, status));
    }

    @GetMapping("/{id}/risk")
    public ResponseEntity<com.loan.system.model.RiskPrediction> getRiskPrediction(@PathVariable Long id) {
        com.loan.system.model.RiskPrediction prediction = loanService.getRiskPrediction(id);
        if (prediction == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(prediction);
    }
}
