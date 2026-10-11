

package project.SmartQueue.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import project.SmartQueue.Repository.UserRepository;
import project.SmartQueue.model.Role;
import project.SmartQueue.model.User;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initUsers(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            // Créer l'agent uniquement s'il n'existe pas
            if (!userRepository.existsByEmail("agent@test.com")) {

                User agent = User.builder()
                        .firstName("Agent")
                        .lastName("Test")
                        .email("agent@test.com")
                        .password(passwordEncoder.encode("Agent123!"))
                        .role(Role.AGENT)
                        .build();

                userRepository.save(agent);
            }

            // Créer l'administrateur uniquement s'il n'existe pas
            if (!userRepository.existsByEmail("admin@test.com")) {

                User admin = User.builder()
                        .firstName("Admin")
                        .lastName("Test")
                        .email("admin@test.com")
                        .password(passwordEncoder.encode("Admin123!"))
                        .role(Role.ADMIN)
                        .build();

                userRepository.save(admin);
            }
        };
    }
}
