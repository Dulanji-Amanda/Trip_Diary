package com.tripdiary.galleryservice.controller;

import com.tripdiary.galleryservice.model.PhotoMetadata;
import com.tripdiary.galleryservice.service.GalleryService;
import com.tripdiary.galleryservice.service.GcsStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/gallery")
@RequiredArgsConstructor
public class GalleryController {

    private final GalleryService galleryService;
    private final GcsStorageService gcsStorageService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadPhoto(
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String destinationId) {
        try {
            String photoUrl = gcsStorageService.uploadFile(file);
            PhotoMetadata metadata = galleryService.saveMetadata(file, userId, destinationId, photoUrl);
            return ResponseEntity.ok(metadata);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("File upload failed: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deletePhoto(@RequestParam("url") String url) {
        try {
            gcsStorageService.deleteFile(url);
            return ResponseEntity.ok("File deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("File deletion failed: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PhotoMetadata>> getPhotosByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(galleryService.getPhotosByUser(userId));
    }

    @GetMapping("/destination/{destinationId}")
    public ResponseEntity<List<PhotoMetadata>> getPhotosByDestination(@PathVariable String destinationId) {
        return ResponseEntity.ok(galleryService.getPhotosByDestination(destinationId));
    }

    // Endpoint to serve local files for testing
    @GetMapping("/files/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path file = Paths.get("uploads/").resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
