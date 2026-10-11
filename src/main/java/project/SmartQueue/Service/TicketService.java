package project.SmartQueue.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import project.SmartQueue.Repository.QueueRepository;
import project.SmartQueue.Repository.TicketRepository;
import project.SmartQueue.Repository.UserRepository;
import project.SmartQueue.dto.TicketRequest;
import project.SmartQueue.dto.TicketResponse;
import project.SmartQueue.exception.TicketNotFoundException;
import project.SmartQueue.model.Queue;
import project.SmartQueue.model.QueueStatus;
import project.SmartQueue.model.Ticket;
import project.SmartQueue.model.TicketStatus;
import project.SmartQueue.model.User;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final QueueRepository queueRepository;
    private final NotificationService notificationService;
    private UserRepository userRepository;
    public TicketService(TicketRepository ticketRepository, QueueRepository queueRepository,
			NotificationService notificationService, UserRepository userRepository) {
	
		this.ticketRepository = ticketRepository;
		this.queueRepository = queueRepository;
		this.notificationService = notificationService;
		this.userRepository = userRepository;
	}

	

    // =========================
    // CREATE TICKET
    // =========================
    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

public TicketResponse createTicket(
        TicketRequest request,
        String email) {

    // 1. Trouver le client connecté
    User user = userRepository.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("Utilisateur introuvable"));

    // 2. Trouver la file demandée
    Queue queue = queueRepository.findById(request.queueId())
            .orElseThrow(() ->
                    new RuntimeException("File introuvable"));

    // 3. Vérifier que la file est active
    if (queue.getQueueStatus() != QueueStatus.ACTIVE) {
        throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Cette file est fermée."
        );
    }

    // 4. Vérifier si le client possède déjà un ticket actif
    // dans cette file
    List<TicketStatus> activeStatuses = List.of(
            TicketStatus.WAITING,
            TicketStatus.CALLED
    );

    boolean alreadyHasTicket =
            ticketRepository.existsByUserIdAndQueueIdAndTicketStatusIn(
                    user.getId(),
                    queue.getId(),
                    activeStatuses
            );

    if (alreadyHasTicket) {
        throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Vous avez déjà un ticket actif dans cette file."
        );
    }

    // 5. Créer le ticket en associant le client et la file
    Ticket ticket = Ticket.builder()
            .number(generateTicketNumber())
            .ticketStatus(TicketStatus.WAITING)
            .queue(queue)
            .user(user)
            .build();

    // 6. Enregistrer et retourner le ticket
    Ticket savedTicket = ticketRepository.save(ticket);

    return convertToResponse(savedTicket);
}


    // =========================
    // GET TICKET
    // =========================

    public TicketResponse getTicketById(UUID id) {

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() ->
                        new  TicketNotFoundException("Ticket introuvable : " + id));

        return convertToResponse(ticket);
    }


    // =========================
    // CANCEL TICKET
    // =========================

    public TicketResponse cancelTicket(UUID id) {

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Ticket not found"));

        ticket.setTicketStatus(TicketStatus.CANCELLED);

        Ticket savedTicket = ticketRepository.save(ticket);
        TicketResponse response = convertToResponse(savedTicket);
        notificationService.notifyTicketUpdate(response);
        return response ;
    }


    // =========================
    // CALL TICKET
    // =========================


public TicketResponse callTicket(UUID id) {

    // 1. Rechercher le ticket
    Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() ->
                    new TicketNotFoundException(
                            "Ticket introuvable : " + id
                    ));

    // 2. Modifier le statut
    ticket.setTicketStatus(TicketStatus.CALLED);
    ticket.setCalledAt(LocalDateTime.now());

    // 3. Enregistrer le changement en base de données
    Ticket savedTicket = ticketRepository.save(ticket);

    // 4. Convertir le ticket en réponse API
    TicketResponse response = convertToResponse(savedTicket);

    // 5. Notifier les clients abonnés aux mises à jour
    notificationService.notifyTicketUpdate(response);

    return response;
}



    // =========================
    // SERVE TICKET
    // =========================

    public TicketResponse serveTicket(UUID id) {

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Ticket not found"));

        ticket.setTicketStatus(TicketStatus.SERVED);

        Ticket savedTicket = ticketRepository.save(ticket);

        return convertToResponse(savedTicket);
    }


    // =========================
    // NO SHOW
    // =========================

    public TicketResponse noShowTicket(UUID id) {

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Ticket not found"));

        ticket.setTicketStatus(TicketStatus.NO_SHOW);

        Ticket savedTicket = ticketRepository.save(ticket);

        return convertToResponse(savedTicket);
    }


    // =========================
    // GENERATE NUMBER
    // =========================

    private String generateTicketNumber() {

        long count = ticketRepository.count();

        long nextNumber = count + 1;

        return String.format("A%03d", nextNumber);
    }
    public List<TicketResponse> getMyTickets(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Utilisateur introuvable"));

        return ticketRepository.findByUserId(user.getId())
                .stream()
                .map(this::convertToResponse)
                .toList();
    }
 
    // =========================
    // CONVERT ENTITY → DTO
    // =========================

    private TicketResponse convertToResponse(Ticket ticket) {

        return new TicketResponse(
                ticket.getId(),
                ticket.getNumber(),
                ticket.getTicketStatus().name(),
                ticket.getCreatedAt(),
                ticket.getCalledAt(),
                ticket.getQueue().getId(),
                ticket.getQueue().getName()
        );
    }
}