import xmlbuilder from "xmlbuilder";
import { Clients, BSocket } from "../../../misc/typings/Socket.types";
import logging from "../../../utils/logging/logging";
import Friends from "../../../misc/models/Friends";
import { ServerWebSocket } from "bun";

export default async function UpdateClientPresence(
  socket: ServerWebSocket<BSocket>,
  status: string,
  offline: boolean,
  away: boolean,
) {
  const senderIndex = Clients.findIndex((client) => client.socket === socket);
  const sender = Clients[senderIndex];

  if (senderIndex === -1) return;

  Clients[senderIndex].lastPresenceUpdate.status = status;
  Clients[senderIndex].lastPresenceUpdate.away = away;

  const friends = await Friends.findOne({
    accountId: sender.accountId,
  }).cacheQuery();

  if (!friends) return;

  friends.friends.accepted.forEach((friend) => {
    const clientIndex = Clients.findIndex((client) => client.accountId === friend.accountId);
    const client = Clients[clientIndex];

    if (clientIndex === -1) return;

    let xmlMessage = xmlbuilder
      .create("presence")
      .attribute("to", client.jid)
      .attribute("xmlns", "jabber:client")
      .attribute("from", sender.jid)
      .attribute("type", offline ? "unavailable" : "available");

    if (sender.lastPresenceUpdate.away)
      xmlMessage = xmlMessage
        .element("show", "away")
        .element("status", sender.lastPresenceUpdate.status)
        .up();
    else xmlMessage = xmlMessage.element("status", sender.lastPresenceUpdate.status).up();

    client.socket.send(xmlMessage.toString({ pretty: true }));
  });
}
