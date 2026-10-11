package project.SmartQueue.Repository;

import java.util.UUID;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import project.SmartQueue.model.Ticket;
import project.SmartQueue.model.TicketStatus;

public interface TicketRepository extends JpaRepository<Ticket,UUID> {

    List<Ticket> findByUserId(UUID userId);

    boolean existsByUserIdAndQueueIdAndTicketStatusIn(
            UUID userId,
            UUID queueId,
            List<TicketStatus> statuses
    );
    long countByTicketStatus(TicketStatus ticketStatus);
}
