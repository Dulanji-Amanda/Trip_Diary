package com.tripdiary.destinationservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "destinations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Destination {

    @Id
    private String id;
    
    private String title;
    private String location;
    private String country;
    private String description;
    
    private List<String> tags; // e.g., ["#beach", "#budget"]
    
    private Double rating;
    private Long createdBy; // User ID from Profile Service
    private LocalDateTime createdAt;
}
