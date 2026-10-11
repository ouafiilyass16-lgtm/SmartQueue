package project.SmartQueue.Controller;

import java.util.List;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import project.SmartQueue.Service.TicketService;
import project.SmartQueue.dto.TicketRequest;
import project.SmartQueue.dto.TicketResponse;

@RestController
@RequestMapping("/api/tickets")
@Validated
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }
    @GetMapping("/my")
    public ResponseEntity<List<TicketResponse>> getMyTickets(
            Authentication authentication) {

        return ResponseEntity.ok(
                ticketService.getMyTickets(authentication.getName())
        );
    }
    @GetMapping
    public ResponseEntity<List<TicketResponse>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }
    // =========================
    // CREATE
    // =========================

    @PostMapping
    public ResponseEntity<TicketResponse> createTicket(
            @Valid @RequestBody TicketRequest request,
            Authentication authentication) {

        TicketResponse response = ticketService.createTicket(
                request,
                authentication.getName());

        return ResponseEntity.ok(response);
    }


    // =========================
    // GET BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicket(
            @PathVariable UUID id) {

        TicketResponse response =
                ticketService.getTicketById(id);

        return ResponseEntity.ok(response);
    }


    // =========================
    // CANCEL
    // =========================

    @PutMapping("/{id}/cancel")
    public ResponseEntity<TicketResponse> cancelTicket(
            @PathVariable UUID id) {

        TicketResponse response =
                ticketService.cancelTicket(id);

        return ResponseEntity.ok(response);
    }


    // =========================
    // CALL
    // =========================

    @PutMapping("/{id}/call")
    public ResponseEntity<TicketResponse> callTicket(
            @PathVariable UUID id) {

        TicketResponse response =
                ticketService.callTicket(id);

        return ResponseEntity.ok(response);
    }


    // =========================
    // SERVE
    // =========================

    @PutMapping("/{id}/serve")
    public ResponseEntity<TicketResponse> serveTicket(
            @PathVariable UUID id) {

        TicketResponse response =
                ticketService.serveTicket(id);

        return ResponseEntity.ok(response);
    }


    // =========================
    // NO SHOW
    // =========================

    @PutMapping("/{id}/no-show")
    public ResponseEntity<TicketResponse> noShowTicket(
            @PathVariable UUID id) {

        TicketResponse response =
                ticketService.noShowTicket(id);

        return ResponseEntity.ok(response);
    }
}