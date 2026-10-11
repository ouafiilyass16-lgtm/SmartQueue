package project.SmartQueue.dto;



public record LoginResponse(
        String token,
        String email,
        String role
) {}