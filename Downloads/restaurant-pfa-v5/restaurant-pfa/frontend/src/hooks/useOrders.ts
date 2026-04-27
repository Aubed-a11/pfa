"use client";
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WS_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:8080";

export function useOrdersWebSocket() {
  const queryClient = useQueryClient();
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`${WS_URL}/api/ws`),
      reconnectDelay: 5000,
      onConnect: () => {
        // Nouvelle commande
        client.subscribe("/topic/orders/new", () => {
          queryClient.invalidateQueries({ queryKey: ["orders", "active"] });
        });
        // Mise à jour de statut
        client.subscribe("/topic/orders/updated", () => {
          queryClient.invalidateQueries({ queryKey: ["orders", "active"] });
          queryClient.invalidateQueries({ queryKey: ["orders", "my"] });
        });
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [queryClient]);
}
