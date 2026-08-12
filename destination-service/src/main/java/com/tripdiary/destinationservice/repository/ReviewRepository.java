package com.tripdiary.destinationservice.repository;

import com.tripdiary.destinationservice.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByDestinationId(String destinationId);
}
