
package project.SmartQueue.Service;

import org.springframework.stereotype.Service;

import project.SmartQueue.Repository.UserRepository;
import project.SmartQueue.Repository.TicketRepository;
import project.SmartQueue.Repository.QueueRepository;

import project.SmartQueue.dto.AdminStatisticsResponse;
import project.SmartQueue.model.TicketStatus;
import project.SmartQueue.model.QueueStatus;

@Service
public class StatisticsService {

    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;
    private final QueueRepository queueRepository;

    public StatisticsService(
            UserRepository userRepository,
            TicketRepository ticketRepository,
            QueueRepository queueRepository) {

        this.userRepository = userRepository;
        this.ticketRepository = ticketRepository;
        this.queueRepository = queueRepository;
    }

    public AdminStatisticsResponse getStatistics() {

        long totalUsers = userRepository.count();

        long totalTickets = ticketRepository.count();

        long servedTickets =
                ticketRepository.countByTicketStatus(
                        TicketStatus.SERVED
                );

        long waitingTickets =
                ticketRepository.countByTicketStatus(
                        TicketStatus.WAITING
                );

        long totalQueues = queueRepository.count();

        long activeQueues =
                queueRepository.countByQueueStatus(
                        QueueStatus.ACTIVE
                );

        return new AdminStatisticsResponse(
                totalUsers,
                totalTickets,
                servedTickets,
                waitingTickets,
                totalQueues,
                activeQueues
        );
    }
}
