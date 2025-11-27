package com.loan.system.controller;

import com.loan.system.model.User;
import com.loan.system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private UserService userService;

    @GetMapping("/{username}")
    public ResponseEntity<User> getProfile(@PathVariable String username) {
        User user = userService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{username}")
    public ResponseEntity<User> updateProfile(@PathVariable String username, @RequestBody User updatedUser) {
        User user = userService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Update fields
        if (updatedUser.getFullName() != null) user.setFullName(updatedUser.getFullName());
        if (updatedUser.getPhone() != null) user.setPhone(updatedUser.getPhone());
        if (updatedUser.getIncome() != null) user.setIncome(updatedUser.getIncome());
        if (updatedUser.getEmploymentType() != null) user.setEmploymentType(updatedUser.getEmploymentType());

        // Save via service (assuming simple save for now, or direct repo access if service doesn't have update)
        // Ideally UserService should have an update method, but for MVP we can reuse register or add a save method.
        // Let's check UserService first. For now, I'll assume I can save it back.
        // Actually, let's use the repository directly or add a method to UserService.
        // I'll add a generic save/update to UserService to be clean.
        return ResponseEntity.ok(userService.updateUser(user));
    }
}
