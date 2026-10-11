package project.SmartQueue.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {

        // Les messages envoyés vers /topic
        // seront distribués aux clients abonnés
        config.enableSimpleBroker("/topic");

        // Les messages envoyés par React vers Spring
        // doivent commencer par /app
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {

        // Point d'entrée WebSocket
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*");
    }
}