
import { Client } from "@stomp/stompjs";

const stompClient = new Client({
  // Adresse du serveur WebSocket Spring Boot
  brokerURL: "ws://localhost:8080/ws",

  // Reconnexion automatique après une coupure
  reconnectDelay: 5000,

  // Afficher les erreurs dans la console
  onStompError: (frame) => {
    console.error("Erreur STOMP :", frame.headers["message"]);
  },

  onWebSocketError: (error) => {
    console.error("Erreur WebSocket :", error);
  },
});

export default stompClient;
