package project.SmartQueue.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public record TicketRequest(
    @NotNull
    UUID queueId
) {
}
