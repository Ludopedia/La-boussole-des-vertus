import { useState, useEffect, useRef, useCallback } from 'react';
import { WorkshopSession } from '../types/workshop';
import { INITIAL_DEMO_SESSION } from '../data/virtuesData';

export interface NetworkInfo {
  localIps: string[];
  port: number;
  currentHost?: string;
}

export function useRealtimeSession() {
  const [session, setSession] = useState<WorkshopSession>(() => {
    try {
      const saved = localStorage.getItem('boussole_vertus_session_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return INITIAL_DEMO_SESSION;
  });

  const [myParticipantId, setMyParticipantId] = useState<string>(() => {
    try {
      return localStorage.getItem('boussole_my_participant_id') || '';
    } catch {
      return '';
    }
  });

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [onlineParticipants, setOnlineParticipants] = useState<string[]>([]);
  const [connectedClientsCount, setConnectedClientsCount] = useState<number>(1);
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const isRemoteUpdateRef = useRef<boolean>(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch network info for Wi-Fi instructions
  useEffect(() => {
    fetch('/api/network-info')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: NetworkInfo | null) => {
        if (data) setNetworkInfo(data);
      })
      .catch(() => {});
  }, []);

  // Set my identity and remember in localStorage
  const chooseMyParticipantId = useCallback(
    (id: string) => {
      setMyParticipantId(id);
      try {
        localStorage.setItem('boussole_my_participant_id', id);
      } catch {
        // Ignore
      }

      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            type: 'identify',
            participantId: id,
          })
        );
      }
    },
    []
  );

  // Initialize and maintain WebSocket connection
  const connectWebSocket = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;

    try {
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        // Identify ourselves if we have an ID selected
        if (myParticipantId) {
          ws.send(
            JSON.stringify({
              type: 'identify',
              participantId: myParticipantId,
            })
          );
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'init') {
            if (data.session) {
              isRemoteUpdateRef.current = true;
              setSession(data.session);
            }
            if (Array.isArray(data.onlineParticipants)) {
              setOnlineParticipants(data.onlineParticipants);
            }
            if (typeof data.connectedClientsCount === 'number') {
              setConnectedClientsCount(data.connectedClientsCount);
            }
          } else if (data.type === 'sync_state' && data.session) {
            isRemoteUpdateRef.current = true;
            setSession(data.session);
          } else if (data.type === 'presence') {
            if (Array.isArray(data.onlineParticipants)) {
              setOnlineParticipants(data.onlineParticipants);
            }
            if (typeof data.connectedClientsCount === 'number') {
              setConnectedClientsCount(data.connectedClientsCount);
            }
          }
        } catch (e) {
          console.error('Error parsing incoming WS message:', e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        socketRef.current = null;
        // Schedule auto-reconnect
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 2000);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      // WS unavailable, fallback to REST
    }
  }, [myParticipantId]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connectWebSocket]);

  // Persist session to local storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('boussole_vertus_session_v1', JSON.stringify(session));
    } catch {
      // Ignore
    }
  }, [session]);

  // Broadcast local changes to server & peers
  const updateSession = useCallback((newSession: WorkshopSession) => {
    setSession(newSession);

    // If socket is open, send sync event
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: 'sync_state',
          session: newSession,
        })
      );
    } else {
      // REST fallback
      fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session: newSession }),
      }).catch(() => {});
    }
  }, []);

  return {
    session,
    updateSession,
    myParticipantId,
    chooseMyParticipantId,
    isConnected,
    onlineParticipants,
    connectedClientsCount,
    networkInfo,
  };
}
