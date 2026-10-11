package project.SmartQueue.Service;

import java.util.List;


import java.util.UUID;

import org.springframework.stereotype.Service;

import project.SmartQueue.Repository.QueueRepository;
import project.SmartQueue.exception.QueueNotFoundException;
import project.SmartQueue.model.Queue;
import project.SmartQueue.model.QueueStatus;

@Service
public class QueueService {

private QueueRepository queueRepository;

public QueueService(QueueRepository queueRepository) {
	this.queueRepository = queueRepository;
	
}
public Queue createQueue(String name) {
	Queue queue = Queue.builder() 
			.name(name) 
			.build();  
return queueRepository.save(queue); 
}
public List<Queue> getAllQueues() { 
	return queueRepository.findAll(); 
	}
public Queue getQueueById(UUID id) {

    return queueRepository.findById(id)
            .orElseThrow(() ->
                    new QueueNotFoundException( "Queue introuvable : " + id));
}
public Queue FermerQueue(UUID id) {
	
	Queue queue = getQueueById(id); 
	queue.setQueueStatus(QueueStatus.CLOSED);
	return queueRepository.save(queue);
}
public Queue OuvrireQueue(UUID id) {
	 Queue queue=getQueueById(id);
	 queue.setQueueStatus(QueueStatus.ACTIVE);
	return  queueRepository.save(queue);
}
public void deleteQueue(UUID id) {
	Queue queue=queueRepository.findById(id).orElseThrow(() -> 
	new RuntimeException("Queue not found")); 
	queueRepository.delete(queue);
}

}
