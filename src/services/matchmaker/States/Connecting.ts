import { ServerWebSocket } from "bun";
import WebSocket from "ws";
import { BSocket, SocketData } from "../../../misc/typings/Socket.types";

export default function Connecting(socket: ServerWebSocket<SocketData>) {
  return socket.send(
    JSON.stringify({
      payload: {
        state: "Connecting",
      },
      name: "StatusUpdate",
    }),
  );
}
