//given an isbm get the book details from open library api and return the details as a response
package com.example.lms.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.List;
@RestController
@RequestMapping("v1/books")
public class HomeController {

    private final RestTemplate restTemplate;

    public HomeController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @GetMapping("/isbn/{isbn}")
    @PreAuthorize("hasRole('ADMIN')")
    public void getBookByIsbn(@PathVariable String isbn) {

        String url = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn;

        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        if (response == null || ((List<?>) response.get("items")) == null) {
            throw new RuntimeException("No book found for ISBN: " + isbn);
        }

        System.out.println(response);
    }
} 
