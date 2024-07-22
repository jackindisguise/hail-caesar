import { EventEmitter } from "node:events";
import { logger } from "./winston.js";
import { t } from "./i18n.js";
import { Socket, Server, createServer } from "net";
import { Character } from "./character.js";
import { autocomplete } from "./string.js";
import { colorize, Colorizer } from "./color.js";

export declare interface MUDClient {
	on(event: "close", listener: () => void): this;
	on(event: "command", listener: (command: string) => void): this;
	off(event: "close", listener: () => void): this;
	off(event: "command", listener: (command: string) => void): this;
	once(event: "close", listener: () => void): this;
	once(event: "command", listener: (command: string) => void): this;
	emit(event: "close"): boolean;
	emit(event: "command", command: string): boolean;
}

export class MUDClient extends EventEmitter {
	protected _socket: Socket;
	protected _callback?: (command: string) => void;
	protected _character?: Character;
	address: string;
	constructor(socket: Socket) {
		super();
		logger.debug(t("New client connection..."));
		this._socket = socket;
		let address: any = socket.address();
		this.address = address.address;
		logger.debug(
			t("Assigned address: @{{address}}", { address: this.address })
		);
		socket.on("data", (data: Buffer) => {
			let safe: string = data.toString("utf8");
			const commands = safe.split("\r\n");
			const remainder = commands.pop();
			if (remainder)
				logger.debug(
					t("@{{address}}: non-command input from client: {{input}}", {
						address: this.address,
						input: remainder,
					})
				);
			for (let command of commands) this.command(command);
		});
		socket.on("close", () => {
			logger.debug(t("{{client}} closed connection.", { client: this }));
			this.emit("close");
		});
		socket.on("error", (err: Error) => {
			logger.error(err.stack);
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
		if (this._socket.closed) return;
		//		this._socket.write(colorize(Colorizer.green(message)));
		this._socket.write(colorize(message));
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
			t("{{client}}: '{{input}}'", {
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
			return t("[{{character}}]", {
				character: this._character.toString(),
			});
		return t("[{{character}}]", {
			character: `@${this.address}`,
		});
	}
}

export declare interface MUDServer {
	on(event: "connection", listener: (client: MUDClient) => void): this;
	on(event: "disconnection", listener: (client: MUDClient) => void): this;
	once(event: "connection", listener: (client: MUDClient) => void): this;
	once(event: "disconnection", listener: (client: MUDClient) => void): this;
	off(event: "connection", listener: (client: MUDClient) => void): this;
	off(event: "disconnection", listener: (client: MUDClient) => void): this;
	emit(event: "connection", client: MUDClient): boolean;
	emit(event: "disconnection", client: MUDClient): boolean;
}

export class MUDServer extends EventEmitter {
	protected _server: Server;
	protected _clients: MUDClient[] = [];
	constructor() {
		super();
		this._server = createServer((socket: Socket) => {
			this.initialize(socket);
		});
	}

	start(port: number, callback?: () => void) {
		this._server.listen(port, () => {
			logger.debug(t("Server listening on port {{port}}.", { port: port }));
			if (callback) callback();
		});
	}

	stop() {
		this._server.close();
	}

	initialize(socket: Socket) {
		let client: MUDClient = new MUDClient(socket);
		logger.debug(
			t("Server opened connection to {{client}}!", {
				client: client,
			})
		);
		this.add(client);
		this.emit("connection", client);
		client.on("close", () => {
			this.emit("disconnection", client);
			logger.debug(
				t("Server closed connection to {{client}}!", {
					client: client,
				})
			);
			this.remove(client);
		});
	}

	add(...clients: MUDClient[]) {
		for (let client of clients) {
			this._clients.push(client);
		}
	}

	remove(...clients: MUDClient[]) {
		for (let client of clients) {
			const pos = this._clients.indexOf(client);
			if (pos === -1) continue;
			this._clients.splice(pos, 1);
		}
	}
}
