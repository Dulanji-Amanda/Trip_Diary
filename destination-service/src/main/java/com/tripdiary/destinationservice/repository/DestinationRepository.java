package com.tripdiary.destinationservice.repository;

import com.tripdiary.destinationservice.model.Destination;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DestinationRepository extends MongoRepository<Destination, String> {
    List<Destination> findByTagsContaining(String tag);
}
