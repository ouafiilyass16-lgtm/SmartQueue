package project.SmartQueue.websockets;



import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
public class QueueWebSocketController {

    @MessageMapping("/test")
    public String test() {
        return "WebSocket fonctionne";
    }
}