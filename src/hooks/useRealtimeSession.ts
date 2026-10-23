import { useState, useEffect, useRef, useCallback } from 'react';
import { WorkshopSession, Participant, VirtueKey, SelfAnswers, createDefaultSelfScores } from '../types/workshop';
import { DEFAULT_EMPTY_SESSION } from '../data/virtuesData';

export interface NetworkInfo {
  localIps: string[];
  port: number;
  currentHost?: string;
}

export const AVATAR_PALETTE = ['#B45309', '#0F766E', '#B91C1C', '#4338CA', '#78350F', '#047857', '#9333EA', '#D97706'];

export function useRealtimeSession() {
  const [session, setSession] = useState<WorkshopSession>(() => {
    try {
      const saved = localStorage.getItem('boussole_vertus_session_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return DEFAULT_EMPTY_SESSION;
  });

  const [myParticipantId, setMyParticipantId] = useState<string>(() => {
    try {
      return localStorage.getItem('boussole_my_participant_id_v2') || '';
    } catch {
      return '';
    }
  });

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [onlineParticipants, setOnlineParticipants] = useState<string[]>([]);
  const [connectedClientsCount, setConnectedClientsCount] = useState<number>(1);
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
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

  // Fetch initial session from REST API on mount
  useEffect(() => {
    fetch('/api/session')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.session) {
          setSession(data.session);
          if (Array.isArray(data.onlineParticipants)) {
            setOnlineParticipants(data.onlineParticipants);
          }
          if (typeof data.connectedClientsCount === 'number') {
            setConnectedClientsCount(data.connectedClientsCount);
          }
        }
      })
      .catch(() => {});
  }, []);

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

          if (data.type === 'init' || data.type === 'sync_state') {
            if (data.session) {
              setSession(data.session);
            }
            if (Array.isArray(data.onlineParticipants)) {
              setOnlineParticipants(data.onlineParticipants);
            }
            if (typeof data.connectedClientsCount === 'number') {
              setConnectedClientsCount(data.connectedClientsCount);
            }
          } else if (data.type === 'presence') {
            if (Array.isArray(data.onlineParticipants)) {
              setOnlineParticipants(data.onlineParticipants);
            }
            if (typeof data.connectedClientsCount === 'number') {
              setConnectedClientsCount(data.connectedClientsCount);
            }
          }
        } catch (e) {
          console.error('Error parsing WS message:', e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        socketRef.current = null;
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 2000);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      // WS fallback to REST
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

  // Persist session to local storage
  useEffect(() => {
    try {
      localStorage.setItem('boussole_vertus_session_v2', JSON.stringify(session));
    } catch {
      // Ignore
    }
  }, [session]);

  // Join session as a participant (created on the fly or reclaimed)
  const joinSession = useCallback(
    (name: string, chosenColor?: string) => {
      const trimmedName = name.trim();
      if (!trimmedName) return;

      // Check if this participant already exists by name
      const existing = session.participants.find(
        (p) => p.name.toLowerCase() === trimmedName.toLowerCase()
      );

      let participant: Participant;

      if (existing) {
        participant = existing;
      } else {
        const color =
          chosenColor ||
          AVATAR_PALETTE[session.participants.length % AVATAR_PALETTE.length];
        participant = {
          id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: trimmedName,
          avatarColor: color,
          selfScores: createDefaultSelfScores(),
          peerReviews: {},
        };
      }

      setMyParticipantId(participant.id);
      try {
        localStorage.setItem('boussole_my_participant_id_v2', participant.id);
      } catch {
        // Ignore
      }

      // Send to server
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            type: 'join_participant',
            participant,
          })
        );
      } else {
        // Fallback REST
        const updatedParticipants = existing
          ? session.participants
          : [...session.participants, participant];
        const newSession = { ...session, participants: updatedParticipants };
        setSession(newSession);
        fetch('/api/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session: newSession }),
        }).catch(() => {});
      }
    },
    [session]
  );

  // Switch / reclaim an existing participant identity
  const selectExistingParticipant = useCallback((id: string) => {
    setMyParticipantId(id);
    try {
      localStorage.setItem('boussole_my_participant_id_v2', id);
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
  }, []);

  // Update whole session and broadcast
  const updateSession = useCallback((newSession: WorkshopSession) => {
    setSession(newSession);

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: 'sync_state',
          session: newSession,
        })
      );
    } else {
      fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session: newSession }),
      }).catch(() => {});
    }
  }, []);

  // Granular update: update my self scores
  const updateMySelfScores = useCallback(
    (virtueKey: VirtueKey, questionKey: 'q1' | 'q2' | 'q3' | 'q4', value: number) => {
      if (!myParticipantId) return;

      const updatedParticipants = session.participants.map((p) => {
        if (p.id !== myParticipantId) return p;
        const currentVirtueScores = p.selfScores[virtueKey] || { q1: 3, q2: 3, q3: 3, q4: 3 };
        return {
          ...p,
          selfScores: {
            ...p.selfScores,
            [virtueKey]: {
              ...currentVirtueScores,
              [questionKey]: value,
            },
          },
        };
      });

      updateSession({
        ...session,
        participants: updatedParticipants,
      });
    },
    [myParticipantId, session, updateSession]
  );

  // Granular update: update my peer review of a friend
  const updateMyPeerReview = useCallback(
    (targetParticipantId: string, scores: Record<VirtueKey, number>, anecdote?: string) => {
      if (!myParticipantId) return;

      const updatedParticipants = session.participants.map((p) => {
        if (p.id !== myParticipantId) return p;
        return {
          ...p,
          peerReviews: {
            ...p.peerReviews,
            [targetParticipantId]: {
              scores,
              anecdote: anecdote !== undefined ? anecdote : p.peerReviews[targetParticipantId]?.anecdote || '',
            },
          },
        };
      });

      updateSession({
        ...session,
        participants: updatedParticipants,
      });
    },
    [myParticipantId, session, updateSession]
  );

  // Granular update: update my commitment
  const updateMyCommitment = useCallback(
    (virtue: VirtueKey, action: string) => {
      if (!myParticipantId) return;

      const updatedParticipants = session.participants.map((p) => {
        if (p.id !== myParticipantId) return p;
        return {
          ...p,
          commitment: {
            virtue,
            action,
          },
        };
      });

      updateSession({
        ...session,
        participants: updatedParticipants,
      });
    },
    [myParticipantId, session, updateSession]
  );

  // Reset entire session on server
  const resetSession = useCallback(() => {
    fetch('/api/reset', { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.session) {
          setSession(data.session);
          setMyParticipantId('');
          try {
            localStorage.removeItem('boussole_my_participant_id_v2');
          } catch {
            // Ignore
          }
        }
      })
      .catch(() => {
        setSession(DEFAULT_EMPTY_SESSION);
      });
  }, []);

  return {
    session,
    myParticipantId,
    myParticipant: session.participants.find((p) => p.id === myParticipantId),
    joinSession,
    selectExistingParticipant,
    updateSession,
    updateMySelfScores,
    updateMyPeerReview,
    updateMyCommitment,
    resetSession,
    isConnected,
    onlineParticipants,
    connectedClientsCount,
    networkInfo,
  };
}
