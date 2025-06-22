import { io } from "socket.io-client";

const socket = io(" https://chessbackend-y3cy.onrender.com", {
  transports: ['websocket'],
});

export default socket;
