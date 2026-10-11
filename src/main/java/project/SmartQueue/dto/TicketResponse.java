package project.SmartQueue.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record TicketResponse(
	    UUID id,
	    String number,
	    String status,
	    LocalDateTime createdAt,
	    LocalDateTime calledAt,
	    UUID queueId,
	    String queueName
	) {
	}
