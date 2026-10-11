package project.SmartQueue.Controller;

import java.util.List;


import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import project.SmartQueue.Service.QueueService;
import project.SmartQueue.model.Queue;

@RestController
@RequestMapping("/api")
public class QueueController {
private QueueService queueService;

public QueueController(QueueService queueService) {
	this.queueService = queueService;
}

@GetMapping("/queues")
public List<Queue> queues(){
	return queueService.getAllQueues();
}
@GetMapping("/queues/{id}")
public Queue queue(@PathVariable UUID id) {
	return queueService.getQueueById(id);
	
}
@PostMapping("/queues")
public ResponseEntity<Queue> createQueu(@RequestParam String name) {
	Queue queue=   queueService.createQueue(name);
	 return ResponseEntity.ok(queue);
}
@PutMapping("/queues/{id}/close")
public ResponseEntity<Queue>FeremerQueue(@PathVariable UUID id) {
	Queue queue = queueService.FermerQueue(id);
	return ResponseEntity.ok(queue);
}
@PutMapping("/queues/{id}/open")
public ResponseEntity<Queue>OuverirQueue(@PathVariable UUID id) {
	Queue queue = queueService.OuvrireQueue(id);
	return ResponseEntity.ok(queue);
}
@DeleteMapping("/queues/{id}")
public ResponseEntity<Void> deleteQueue(@PathVariable UUID id){
	 queueService.deleteQueue(id);
	 return ResponseEntity.noContent().build();
}

}
