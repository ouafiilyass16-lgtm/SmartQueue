package project.SmartQueue.Repository;

import java.util.UUID;


import org.springframework.data.jpa.repository.JpaRepository;

import project.SmartQueue.model.Queue;
import project.SmartQueue.model.QueueStatus;

public interface QueueRepository extends JpaRepository<Queue,UUID>{
	long countByQueueStatus(QueueStatus queueStatus);
}
