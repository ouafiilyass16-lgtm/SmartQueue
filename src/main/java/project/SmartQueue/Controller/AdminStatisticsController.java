
package project.SmartQueue.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import project.SmartQueue.Service.StatisticsService;
import project.SmartQueue.dto.AdminStatisticsResponse;

@RestController
@RequestMapping("/api/admin/statistics")
public class AdminStatisticsController {

    private final StatisticsService statisticsService;

    public AdminStatisticsController(
            StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    @GetMapping
    public AdminStatisticsResponse getStatistics() {
        return statisticsService.getStatistics();
    }
}
