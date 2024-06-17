import { EventEmitter } from "node:events";
import { logger } from "./winston.js";
import { _ } from "./i18n.js";
import { Socket, Server, createConnection, createServer } from "net";

export class MUDClient extends EventEmitter {
	#socket: Socket;
	address: { ip: string };
	constructor(socket: Socket) {
		super();
		let client = this;
		logger.debug(_("Instantiating MUDClient."));
		this.#socket = socket;
		let address = socket.address() as any;
		this.address = address.address || "???.???.???.???";
		logger.debug(
			_("> Assigned address @{{address}}", { address: this.address })
		);
		socket.on("data", (data: Buffer) => {
			if (data[data.length - 2] !== 13 && data[data.length - 1] !== 10) {
				// no linebreak -- not a command
				logger.debug(
					_(
						"@{{address}}: fake lame probably Telnet input from client '{{input}}'",
						{ address: client.address, input: data.toString("binary") }
					)
				);
				return;
			}
			let safe: string = data.toString("utf8"); // telnet support
			safe = safe.slice(0, -2);
			logger.debug(
				_("@{{address}}: input '{{input}}'", {
					address: client.address,
					input: safe,
				})
			);
			this.emit("command", safe);
		});
		socket.on("close", () => {
			logger.debug(
				_("@{{address}} closed connection.", { address: client.address })
			);
			this.emit("close");
		});
	}
}

export class MUDServer extends EventEmitter {
	#server: Server;
	#clients: MUDClient[] = [];
	constructor() {
		super();
		let server = createServer((socket: Socket) => {
			let client: MUDClient = new MUDClient(socket);
			logger.debug(
				_("Server opened connection to @{{address}}!", {
					address: client.address,
				})
			);
			this.add(client);
			this.emit("connection", client);
			client.on("close", () => {
				logger.debug(
					_("Server closed connection to @{{address}}!", {
						address: client.address,
					})
				);
				this.remove(client);
			});
		});
		server.listen(23, () => {
			logger.debug(_("Server listening on port 23."));
		});
		this.#server = server;
	}

	add(...clients: MUDClient[]) {
		for (let client of clients) {
			this.#clients.push(client);
		}
	}

	remove(...clients: MUDClient[]) {
		for (let client of clients) {
			const pos = this.#clients.indexOf(client);
			if (pos === -1) continue;
			this.#clients.splice(pos, 1);
		}
	}
}
