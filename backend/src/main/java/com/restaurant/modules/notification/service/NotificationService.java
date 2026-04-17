package com.restaurant.modules.notification.service;

import com.restaurant.modules.notification.entity.FcmToken;
import com.restaurant.modules.notification.entity.FcmToken.DeviceType;
import com.restaurant.modules.notification.repository.FcmTokenRepository;
import com.restaurant.modules.order.entity.OrderStatus;
import com.restaurant.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final FcmTokenRepository fcmTokenRepository;
    private final SimpMessagingTemplate messagingTemplate;

    // Messages de notification par statut (CDC section 4.6)
    private static final Map<OrderStatus, String> STATUS_MESSAGES = Map.of(
        OrderStatus.PENDING,          "Commande reçue, en attente de confirmation...",
        OrderStatus.CONFIRMED,        "Votre commande a été acceptée par le restaurant !",
        OrderStatus.PREPARING,        "Le chef prépare votre commande 🍕 (env. 15 min)",
        OrderStatus.OUT_FOR_DELIVERY, "Votre commande est en route ! Suivi disponible.",
        OrderStatus.DELIVERED,        "Votre commande est arrivée ! Bon appétit 🍽",
        OrderStatus.CANCELLED,        "Commande annulée. Vous serez remboursé sous 3-5 jours."
    );

    /**
     * Enregistrer ou mettre à jour un token FCM
     */
    public void registerToken(User user, String token, DeviceType deviceType) {
        fcmTokenRepository.findByToken(token).ifPresentOrElse(
            existing -> {
                existing.setDeviceType(deviceType);
                fcmTokenRepository.save(existing);
            },
            () -> fcmTokenRepository.save(FcmToken.builder()
                .user(user).token(token).deviceType(deviceType).build())
        );
    }

    /**
     * Supprimer un token FCM (déconnexion)
     */
    public void removeToken(String token) {
        fcmTokenRepository.deleteByToken(token);
    }

    /**
     * Envoyer notification push FCM + WebSocket back-office
     */
    public void notifyOrderStatusChange(Long orderId, Long userId, OrderStatus newStatus) {
        String message = STATUS_MESSAGES.getOrDefault(newStatus, "Statut mis à jour");

        // 1. Push FCM vers le mobile client
        sendFcmToUser(userId, "Commande #" + orderId, message, orderId);

        // 2. WebSocket STOMP vers le back-office
        messagingTemplate.convertAndSend("/topic/orders", Map.of(
            "orderId", orderId,
            "status", newStatus.name(),
            "message", message
        ));

        log.info("Notification envoyée pour commande #{} → {}", orderId, newStatus);
    }

    /**
     * Alerte nouvelle commande vers le back-office uniquement
     */
    public void notifyNewOrder(Long orderId, int tableNumber) {
        messagingTemplate.convertAndSend("/topic/orders/new", Map.of(
            "orderId", orderId,
            "tableNumber", tableNumber,
            "message", "Nouvelle commande reçue !"
        ));
    }

    /**
     * Envoi FCM — intégration Firebase Admin SDK
     * Note: nécessite firebase-admin dans pom.xml + google-services.json
     */
    private void sendFcmToUser(Long userId, String title, String body, Long orderId) {
        List<FcmToken> tokens = fcmTokenRepository.findByUserId(userId);
        if (tokens.isEmpty()) {
            log.debug("Aucun token FCM pour userId={}", userId);
            return;
        }
        // TODO: Intégrer Firebase Admin SDK
        // FirebaseMessaging.getInstance().sendMulticast(...)
        // Pour l'instant, log de simulation
        tokens.forEach(t -> log.info("[FCM MOCK] → token={} | title='{}' | body='{}'",
            t.getToken().substring(0, Math.min(10, t.getToken().length())), title, body));
    }
}
