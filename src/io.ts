import { EventEmitter } from "node:events";
import { logger } from "./winston.js";
import { _ } from "./i18n.js";
import { Socket, Server, createConnection, createServer } from "net";
import { Character } from "./character.js";
import { autocomplete } from "./string.js";

export class MUDClient extends EventEmitter {
	protected _socket: Socket;
	protected _callback?: (command: string) => void;
	protected _character?: Character;
	address: string;
	constructor(socket: Socket) {
		super();
		logger.debug(_("Instantiating MUDClient."));
		this._socket = socket;
		let address: any = socket.address();
		this.address = address.address || "???.???.???.???";
		logger.debug(_("Assigned address @{{address}}", { address: this.address }));
		socket.on("data", (data: Buffer) => {
			let safe: string = data.toString("utf8");
			const commands = safe.split("\r\n");
			const remainder = commands.pop();
			if (remainder)
				logger.debug(
					_("@{{address}}: non-command input from client: {{input}}", {
						address: this.address,
						input: remainder,
					})
				);
			for (let command of commands) this.command(command);
		});
		socket.on("close", () => {
			logger.debug(_("{{client}} closed connection.", { client: this }));
			this.emit("close");
		});
	}

	set character(character: Character) {
		if (this._character === character) return;
		this._character = character;
		character.client = this;
	}

	get character(): Character | undefined {
		return this._character;
	}

	send(message: string) {
		this._socket.write(message);
	}

	sendLine(message: string) {
		this.send(`${message}\r\n`);
	}

	ask(question: string, callback: (command: string) => void) {
		this.send(`${question} `);
		this._callback = callback;
	}

	yesno(question: string, callback: (agree: boolean) => void) {
		const listener = (command: string) => {
			if (command && autocomplete(command, "yes")) callback(true);
			else if (command && autocomplete(command, "no")) callback(false);
			// repeat
			else this.ask(`${question} [y/n]`, listener);
		};

		this.ask(`${question} [y/n]`, listener);
	}

	interrupt() {
		if (!this._callback) return;
		this._callback = undefined;
		this.sendLine("");
	}

	command(command: string) {
		logger.debug(
			_("{{client}}: '{{input}}'", {
				client: this.toString(),
				input: command,
			})
		);

		// filter command inputs to a callback if it's waiting for input
		if (this._callback) {
			const cb = this._callback;
			this._callback = undefined; // clear #callback before actually calling back so it doesn't interfere
			cb(command);
		} else {
			this.emit("command", command);
		}
	}

	toString() {
		if (this._character)
			return _("[{{character}}]", {
				character: this._character.toString(),
			});
		return _("[{{character}}]", {
			character: `@${this.address}`,
		});
	}
}

export class MUDServer extends EventEmitter {
	#server: Server;
	#clients: MUDClient[] = [];
	constructor() {
		super();
		this.#server = createServer((socket: Socket) => {
			this.initialize(socket);
		});
	}

	start(port: number, callback?: () => void) {
		this.#server.listen(port, () => {
			logger.debug(_("Server listening on port 23."));
			if (callback) callback();
		});
	}

	stop() {
		this.#server.close();
	}

	initialize(socket: Socket) {
		let client: MUDClient = new MUDClient(socket);
		logger.debug(
			_("Server opened connection to {{client}}!", {
				client: client,
			})
		);
		this.add(client);
		this.emit("connection", client);
		client.on("close", () => {
			logger.debug(
				_("Server closed connection to {{client}}!", {
					client: client,
				})
			);
			this.remove(client);
		});
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
