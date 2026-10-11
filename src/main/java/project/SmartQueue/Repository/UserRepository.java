package project.SmartQueue.Repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import project.SmartQueue.model.User;

public interface UserRepository  extends JpaRepository<User,UUID>{
	Optional<User> findByEmail(String email);
	boolean existsByEmail(String email);
}
