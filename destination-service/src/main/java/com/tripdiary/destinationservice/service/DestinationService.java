package com.tripdiary.destinationservice.service;

import com.tripdiary.destinationservice.model.Blog;
import com.tripdiary.destinationservice.model.Destination;
import com.tripdiary.destinationservice.model.Review;
import com.tripdiary.destinationservice.repository.BlogRepository;
import com.tripdiary.destinationservice.repository.DestinationRepository;
import com.tripdiary.destinationservice.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DestinationService {

    private final DestinationRepository destinationRepository;
    private final BlogRepository blogRepository;
    private final ReviewRepository reviewRepository;

    // --- Destination Operations ---
    public Destination createDestination(Destination destination) {
        destination.setCreatedAt(LocalDateTime.now());
        return destinationRepository.save(destination);
    }

    public List<Destination> getAllDestinations() {
        return destinationRepository.findAll();
    }

    public Destination getDestinationById(String id) {
        return destinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found"));
    }

    public List<Destination> searchDestinationsByTag(String tag) {
        return destinationRepository.findByTagsContaining(tag);
    }

    // --- Blog Operations ---
    public Blog createBlog(Blog blog) {
        blog.setCreatedAt(LocalDateTime.now());
        return blogRepository.save(blog);
    }

    public List<Blog> getBlogsByDestination(String destinationId) {
        return blogRepository.findByDestinationId(destinationId);
    }

    public List<Blog> getBlogsByUser(Long userId) {
        return blogRepository.findByUserId(userId);
    }

    // --- Review Operations ---
    public Review addReview(Review review) {
        review.setCreatedAt(LocalDateTime.now());
        Review savedReview = reviewRepository.save(review);
        updateDestinationRating(review.getDestinationId());
        return savedReview;
    }

    public List<Review> getReviewsForDestination(String destinationId) {
        return reviewRepository.findByDestinationId(destinationId);
    }

    private void updateDestinationRating(String destinationId) {
        List<Review> reviews = reviewRepository.findByDestinationId(destinationId);
        if (!reviews.isEmpty()) {
            double average = reviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);
            Destination dest = getDestinationById(destinationId);
            dest.setRating(average);
            destinationRepository.save(dest);
        }
    }
}
