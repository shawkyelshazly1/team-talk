// events types & generic types

import type { DefaultEventsMap, Socket } from "socket.io";
import type { ClientToServerEvents, ServerToClientEvents, SocketData } from "@shared/socket-types";




// extended Socket type
export type ExtendedSocket = Socket<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketData>;
