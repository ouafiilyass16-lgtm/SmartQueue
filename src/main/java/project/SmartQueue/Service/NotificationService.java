package project.SmartQueue.Service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import project.SmartQueue.dto.TicketResponse;

@Service
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void notifyTicketUpdate(TicketResponse ticket) {

        messagingTemplate.convertAndSend(
                "/topic/tickets",
                ticket
        );
    }
}