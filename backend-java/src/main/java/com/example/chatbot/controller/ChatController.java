package com.example.chatbot.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class ChatController {

    private List<Map<String, Object>> knowledgeBase = new ArrayList<>();
    private final Map<String, List<Map<String, String>>> conversationHistories = new HashMap<>();

    @PostConstruct
    public void loadData() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        InputStream is = getClass().getResourceAsStream("/knowledge_base.json");
        if (is != null) {
            knowledgeBase = mapper.readValue(is, new TypeReference<>() {});
        }
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of(
                "status", "healthy",
                "message", "Java chat backend running",
                "knowledge_base_size", knowledgeBase.size(),
                "embeddings_loaded", false
        ));
    }

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody Map<String, String> body) {
        String message = Optional.ofNullable(body.get("message")).orElse("").trim();
        String sessionId = Optional.ofNullable(body.get("session_id")).orElse("default");

        if (message.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No message provided"));
        }

        conversationHistories.computeIfAbsent(sessionId, k -> new ArrayList<>());
        List<Map<String, String>> history = conversationHistories.get(sessionId);

        List<Map<String, Object>> docs = keywordSearch(message, 3);

        String answer = "Thanks for your question. We are reviewing the details and will respond shortly.";

        history.add(Map.of("question", message, "answer", answer));
        if (history.size() > 10) {
            conversationHistories.put(sessionId, history.subList(history.size()-10, history.size()));
        }

        List<String> sources = docs.stream()
                .map(d -> (String) d.getOrDefault("source", "unknown"))
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("response", answer, "sources", sources));
    }

    @PostMapping("/clear")
    public ResponseEntity<?> clear(@RequestBody Map<String, String> body) {
        String sessionId = Optional.ofNullable(body.get("session_id")).orElse("default");
        conversationHistories.remove(sessionId);
        return ResponseEntity.ok(Map.of("message", "Conversation history cleared"));
    }

    private List<Map<String, Object>> keywordSearch(String query, int topK) {
        String q = query.toLowerCase(Locale.ROOT);
        return knowledgeBase.stream()
                .map(doc -> {
                    String content = Optional.ofNullable((String) doc.get("content")).orElse("").toLowerCase(Locale.ROOT);
                    int score = q.split(" ").length;
                    return Map.of("doc", doc, "score", score);
                })
                .sorted((a, b) -> Integer.compare((Integer) b.get("score"), (Integer) a.get("score")))
                .limit(topK)
                .map(m -> (Map<String, Object>) m.get("doc"))
                .collect(Collectors.toList());
    }
}
