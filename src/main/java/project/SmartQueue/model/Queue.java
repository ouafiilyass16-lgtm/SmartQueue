package project.SmartQueue.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Data
@Builder
@Table(name = "queues")
@AllArgsConstructor
@NoArgsConstructor
public class Queue {
	@Id
	 @GeneratedValue
	 @Column(updatable = false, nullable = false)
	 private UUID id;
	
	 
	 
     @Column(name = "name", nullable = false)
	 private String name;
    
	 @Enumerated(EnumType.STRING)
	 @Column(nullable = false)
	 @Builder.Default
	 private QueueStatus queueStatus =QueueStatus.ACTIVE;


	 @Column(name = "created_at", nullable = false, updatable = false)
	 private LocalDateTime createdAt;
	 
	

	 @PrePersist
	 protected void onCreate() {
	      this.createdAt = LocalDateTime.now();
	  }
	 @JsonIgnore
	  @OneToMany(mappedBy = "queue")
	  private List<Ticket> tickets; 
	  
   
}
