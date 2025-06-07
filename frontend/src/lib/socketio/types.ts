// events types & generic types
import type { ServerToClientEvents, ClientToServerEvents } from "@shared/socket-types";

import type { Socket } from "socket.io-client";




// extended Socket type
export type ExtendedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
