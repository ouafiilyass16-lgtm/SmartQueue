
package project.SmartQueue.dto;

public record AdminStatisticsResponse(
        long totalUsers,
        long totalTickets,
        long servedTickets,
        long waitingTickets,
        long totalQueues,
        long activeQueues
) {
}
