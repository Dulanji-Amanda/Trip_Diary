package com.tripdiary.galleryservice.service;

import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.tripdiary.galleryservice.model.PhotoMetadata;
import com.tripdiary.galleryservice.repository.PhotoMetadataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GalleryService {

    private final PhotoMetadataRepository photoMetadataRepository;
    public PhotoMetadata saveMetadata(MultipartFile file, Long userId, String destinationId, String photoUrl) {
        String fileName = photoUrl.substring(photoUrl.lastIndexOf("/") + 1);

        PhotoMetadata metadata = PhotoMetadata.builder()
                .userId(userId)
                .destinationId(destinationId)
                .fileName(fileName)
                .contentType(file.getContentType())
                .photoUrl(photoUrl)
                .build();

        return photoMetadataRepository.save(metadata);
    }

    public List<PhotoMetadata> getPhotosByUser(Long userId) {
        return photoMetadataRepository.findByUserId(userId);
    }

    public List<PhotoMetadata> getPhotosByDestination(String destinationId) {
        return photoMetadataRepository.findByDestinationId(destinationId);
    }
}
