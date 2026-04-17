import { useEffect, useRef, useCallback } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { useQueryClient } from '@tanstack/react-query'

export function useOrdersWebSocket() {
  const clientRef = useRef<Client | null>(null)
  const queryClient = useQueryClient()

  const connect = useCallback(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8081/api/ws'),
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: () => {
        client.subscribe('/topic/orders', () => {
          queryClient.invalidateQueries({ queryKey: ['orders'] })
        })
      },
      reconnectDelay: 5000,
    })

    client.activate()
    clientRef.current = client
  }, [queryClient])

  useEffect(() => {
    connect()
    return () => { clientRef.current?.deactivate() }
  }, [connect])
}
