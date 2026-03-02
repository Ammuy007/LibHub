package com.example.lms.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class BookInfoServiceImpl implements BookInfoService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String fetchDescriptionByIsbn(String isbn) {

        try {
            // STEP 1: ISBN (edition) lookup
            
            String isbnUrl = "https://openlibrary.org/isbn/" + isbn + ".json";
            Map<?, ?> isbnResponse = restTemplate.getForObject(isbnUrl, Map.class);

            if (isbnResponse == null) return "Description not available1";

            // ✅ NEW: try edition description first
            String editionDesc = extractDescription(isbnResponse);
            if (editionDesc != null) return editionDesc;
            
            // STEP 2: fallback → work lookup
            Object worksObj = isbnResponse.get("works");
            if (!(worksObj instanceof List<?> works) || works.isEmpty())
                return "Description not available2";

            Object firstWork = works.get(0);
            if (!(firstWork instanceof Map<?, ?> workMap))
                return "Description not available3";

            String workKey = (String) workMap.get("key");
            if (workKey == null)
                return "Description not available4";

            String workUrl = "https://openlibrary.org" + workKey + ".json";
            Map<?, ?> workResponse = restTemplate.getForObject(workUrl, Map.class);

            if (workResponse == null)
                return "Description not available6";

            String workDesc = extractDescription(workResponse);
            if (workDesc != null) return workDesc;

        } catch (Exception ignored) {}

        return "Description not available7";
    }

    // ✅ NEW helper method
    private String extractDescription(Map<?, ?> json) {

        Object desc = json.get("description");

        if (desc instanceof String s)
            return s;

        if (desc instanceof Map<?, ?> m) {
            Object value = m.get("value");
            if (value instanceof String s)
                return s;
        }

        return null;
    }
}