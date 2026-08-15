package com.tripdiary.destinationservice.controller;

import com.tripdiary.destinationservice.model.Blog;
import com.tripdiary.destinationservice.model.Destination;
import com.tripdiary.destinationservice.model.Review;
import com.tripdiary.destinationservice.service.DestinationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DestinationController {

    private final DestinationService destinationService;

    // --- Destinations ---
    @PostMapping("/destinations")
    public ResponseEntity<Destination> createDestination(@RequestBody Destination destination) {
        return ResponseEntity.ok(destinationService.createDestination(destination));
    }

    @GetMapping("/destinations")
    public ResponseEntity<List<Destination>> getAllDestinations(@RequestParam(required = false) String tag) {
        if (tag != null && !tag.isEmpty()) {
            return ResponseEntity.ok(destinationService.searchDestinationsByTag(tag));
        }
        return ResponseEntity.ok(destinationService.getAllDestinations());
    }

    @GetMapping("/destinations/{id}")
    public ResponseEntity<Destination> getDestinationById(@PathVariable String id) {
        return ResponseEntity.ok(destinationService.getDestinationById(id));
    }

    @PutMapping("/destinations/{id}")
    public ResponseEntity<Destination> updateDestination(@PathVariable String id, @RequestBody Destination destination) {
        return ResponseEntity.ok(destinationService.updateDestination(id, destination));
    }

    @DeleteMapping("/destinations/{id}")
    public ResponseEntity<Void> deleteDestination(@PathVariable String id) {
        destinationService.deleteDestination(id);
        return ResponseEntity.noContent().build();
    }

    // --- Blogs ---
    @PostMapping("/blogs")
    public ResponseEntity<Blog> createBlog(@RequestBody Blog blog) {
        return ResponseEntity.ok(destinationService.createBlog(blog));
    }

    @GetMapping("/destinations/{destinationId}/blogs")
    public ResponseEntity<List<Blog>> getBlogsByDestination(@PathVariable String destinationId) {
        return ResponseEntity.ok(destinationService.getBlogsByDestination(destinationId));
    }

    @GetMapping("/blogs/user/{userId}")
    public ResponseEntity<List<Blog>> getBlogsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(destinationService.getBlogsByUser(userId));
    }

    @PutMapping("/blogs/{id}")
    public ResponseEntity<Blog> updateBlog(@PathVariable String id, @RequestBody Blog blog) {
        return ResponseEntity.ok(destinationService.updateBlog(id, blog));
    }

    @DeleteMapping("/blogs/{id}")
    public ResponseEntity<Void> deleteBlog(@PathVariable String id) {
        destinationService.deleteBlog(id);
        return ResponseEntity.noContent().build();
    }

    // --- Reviews ---
    @PostMapping("/destinations/{destinationId}/reviews")
    public ResponseEntity<Review> addReview(@PathVariable String destinationId, @RequestBody Review review) {
        review.setDestinationId(destinationId);
        return ResponseEntity.ok(destinationService.addReview(review));
    }

    @GetMapping("/destinations/{destinationId}/reviews")
    public ResponseEntity<List<Review>> getReviewsForDestination(@PathVariable String destinationId) {
        return ResponseEntity.ok(destinationService.getReviewsForDestination(destinationId));
    }

    @PutMapping("/reviews/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable String id, @RequestBody Review review) {
        return ResponseEntity.ok(destinationService.updateReview(id, review));
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable String id) {
        destinationService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}
