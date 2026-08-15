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

    public Destination updateDestination(String id, Destination updatedDestination) {
        Destination existing = getDestinationById(id);
        existing.setTitle(updatedDestination.getTitle());
        existing.setLocation(updatedDestination.getLocation());
        existing.setCountry(updatedDestination.getCountry());
        existing.setDescription(updatedDestination.getDescription());
        existing.setTags(updatedDestination.getTags());
        return destinationRepository.save(existing);
    }

    public void deleteDestination(String id) {
        destinationRepository.deleteById(id);
        // Also delete associated blogs and reviews
        blogRepository.deleteAll(blogRepository.findByDestinationId(id));
        reviewRepository.deleteAll(reviewRepository.findByDestinationId(id));
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

    public Blog updateBlog(String id, Blog updatedBlog) {
        Blog existing = blogRepository.findById(id).orElseThrow(() -> new RuntimeException("Blog not found"));
        existing.setTitle(updatedBlog.getTitle());
        existing.setContent(updatedBlog.getContent());
        existing.setTravelTips(updatedBlog.getTravelTips());
        return blogRepository.save(existing);
    }

    public void deleteBlog(String id) {
        blogRepository.deleteById(id);
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

    public Review updateReview(String id, Review updatedReview) {
        Review existing = reviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Review not found"));
        existing.setRating(updatedReview.getRating());
        existing.setComment(updatedReview.getComment());
        Review saved = reviewRepository.save(existing);
        updateDestinationRating(saved.getDestinationId());
        return saved;
    }

    public void deleteReview(String id) {
        Review existing = reviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Review not found"));
        String destId = existing.getDestinationId();
        reviewRepository.deleteById(id);
        updateDestinationRating(destId);
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
