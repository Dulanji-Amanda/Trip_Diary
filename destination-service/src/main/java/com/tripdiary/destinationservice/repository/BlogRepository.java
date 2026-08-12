package com.tripdiary.destinationservice.repository;

import com.tripdiary.destinationservice.model.Blog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogRepository extends MongoRepository<Blog, String> {
    List<Blog> findByDestinationId(String destinationId);
    List<Blog> findByUserId(Long userId);
}
