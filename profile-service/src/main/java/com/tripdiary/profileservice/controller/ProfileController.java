package com.tripdiary.profileservice.controller;

import com.tripdiary.profileservice.model.Favorite;
import com.tripdiary.profileservice.model.User;
import com.tripdiary.profileservice.model.VisitedPlace;
import com.tripdiary.profileservice.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    // --- User Endpoints ---
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(profileService.createUser(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(profileService.getUserById(id));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        return ResponseEntity.ok(profileService.getUserByEmail(email));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(profileService.updateUser(id, user));
    }

    // --- Favorites Endpoints ---
    @PostMapping("/{userId}/favorites")
    public ResponseEntity<Favorite> addFavorite(@PathVariable Long userId, @RequestParam String destinationId) {
        return ResponseEntity.ok(profileService.addFavorite(userId, destinationId));
    }

    @GetMapping("/{userId}/favorites")
    public ResponseEntity<List<Favorite>> getUserFavorites(@PathVariable Long userId) {
        return ResponseEntity.ok(profileService.getUserFavorites(userId));
    }

    @DeleteMapping("/favorites/{favoriteId}")
    public ResponseEntity<Void> removeFavorite(@PathVariable Long favoriteId) {
        profileService.removeFavorite(favoriteId);
        return ResponseEntity.ok().build();
    }

    // --- Visited Places Endpoints ---
    @PostMapping("/{userId}/visited")
    public ResponseEntity<VisitedPlace> addVisitedPlace(@PathVariable Long userId, @RequestBody VisitedPlace visitedPlace) {
        visitedPlace.setUserId(userId);
        return ResponseEntity.ok(profileService.addVisitedPlace(visitedPlace));
    }

    @GetMapping("/{userId}/visited")
    public ResponseEntity<List<VisitedPlace>> getUserVisitedPlaces(@PathVariable Long userId) {
        return ResponseEntity.ok(profileService.getUserVisitedPlaces(userId));
    }

    @DeleteMapping("/visited/{placeId}")
    public ResponseEntity<Void> removeVisitedPlace(@PathVariable Long placeId) {
        profileService.removeVisitedPlace(placeId);
        return ResponseEntity.ok().build();
    }
}
