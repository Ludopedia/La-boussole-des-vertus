import express from 'express';
import http from 'http';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { DEFAULT_EMPTY_SESSION } from './src/data/virtuesData';
import type { WorkshopSession, Participant } from './src/types/workshop';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// In-memory server-authoritative workshop session
let currentSession: WorkshopSession = JSON.parse(JSON.stringify(DEFAULT_EMPTY_SESSION));

// Connected clients tracking
interface ClientInfo {
  ws: WebSocket;
  id: string;
  participantId?: string;
}

const clients = new Map<WebSocket, ClientInfo>();

// WebSocket Server attached to the same HTTP server
const wss = new WebSocketServer({ server });

function getOnlineParticipantIds(): string[] {
  const ids = new Set<string>();
  for (const client of clients.values()) {
    if (client.participantId) {
      ids.add(client.participantId);
    }
  }
  return Array.from(ids);
}

function broadcast(data: object, senderWs?: WebSocket) {
  const payload = JSON.stringify(data);
  for (const client of clients.keys()) {
    if (client !== senderWs && client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}

wss.on('connection', (ws) => {
  const clientId = `client-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  clients.set(ws, { ws, id: clientId });

  // Send initial authoritative session and active presence to new client
  ws.send(
    JSON.stringify({
      type: 'init',
      session: currentSession,
      onlineParticipants: getOnlineParticipantIds(),
      connectedClientsCount: clients.size,
    })
  );

  // Broadcast updated presence count
  broadcast(
    {
      type: 'presence',
      onlineParticipants: getOnlineParticipantIds(),
      connectedClientsCount: clients.size,
    },
    ws
  );

  ws.on('message', (messageData) => {
    try {
      const data = JSON.parse(messageData.toString());

      if (data.type === 'sync_state' && data.session) {
        currentSession = data.session;
        broadcast(
          {
            type: 'sync_state',
            session: currentSession,
            senderId: clientId,
          },
          ws
        );
      } else if (data.type === 'join_participant' && data.participant) {
        const p: Participant = data.participant;
        const exists = currentSession.participants.some((item) => item.id === p.id);
        if (!exists) {
          currentSession.participants.push(p);
        } else {
          currentSession.participants = currentSession.participants.map((item) =>
            item.id === p.id ? { ...item, name: p.name, avatarColor: p.avatarColor } : item
          );
        }

        const info = clients.get(ws);
        if (info) {
          info.participantId = p.id;
          clients.set(ws, info);
        }

        broadcast({
          type: 'sync_state',
          session: currentSession,
          senderId: clientId,
        });

        broadcast({
          type: 'presence',
          onlineParticipants: getOnlineParticipantIds(),
          connectedClientsCount: clients.size,
        });
      } else if (data.type === 'identify') {
        const info = clients.get(ws);
        if (info) {
          info.participantId = data.participantId;
          clients.set(ws, info);
          broadcast({
            type: 'presence',
            onlineParticipants: getOnlineParticipantIds(),
            connectedClientsCount: clients.size,
          });
        }
      } else if (data.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong' }));
      }
    } catch (err) {
      console.error('Error handling WebSocket message:', err);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    broadcast({
      type: 'presence',
      onlineParticipants: getOnlineParticipantIds(),
      connectedClientsCount: clients.size,
    });
  });
});

// REST Endpoints
app.get('/api/session', (_req, res) => {
  res.json({
    session: currentSession,
    onlineParticipants: getOnlineParticipantIds(),
    connectedClientsCount: clients.size,
  });
});

app.post('/api/session', (req, res) => {
  if (req.body && req.body.session) {
    currentSession = req.body.session;
    broadcast({
      type: 'sync_state',
      session: currentSession,
    });
    res.json({ success: true, session: currentSession });
  } else {
    res.status(400).json({ error: 'Missing session in request body' });
  }
});

app.post('/api/reset', (_req, res) => {
  currentSession = JSON.parse(JSON.stringify(DEFAULT_EMPTY_SESSION));
  broadcast({
    type: 'sync_state',
    session: currentSession,
  });
  res.json({ success: true, session: currentSession });
});

// Detect Local Network IP addresses for Wi-Fi sharing
app.get('/api/network-info', (req, res) => {
  const interfaces = os.networkInterfaces();
  const addresses: string[] = [];

  for (const name of Object.keys(interfaces)) {
    const netList = interfaces[name];
    if (netList) {
      for (const net of netList) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
          addresses.push(net.address);
        }
      }
    }
  }

  // Also include the host header if present
  const reqHost = req.get('host');

  res.json({
    localIps: addresses,
    port,
    currentHost: reqHost,
  });
});

// Mount Vite middleware in development or serve static in production
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

server.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
  const interfaces = os.networkInterfaces();
  console.log('Wi-Fi / Local addresses to share with friends:');
  for (const name of Object.keys(interfaces)) {
    const netList = interfaces[name];
    if (netList) {
      for (const net of netList) {
        if (net.family === 'IPv4' && !net.internal) {
          console.log(`  http://${net.address}:${port}`);
        }
      }
    }
  }
});
