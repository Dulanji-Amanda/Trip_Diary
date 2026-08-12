package com.tripdiary.profileservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "visited_places")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisitedPlace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String placeName;

    private String country;

    private LocalDate visitedDate;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
