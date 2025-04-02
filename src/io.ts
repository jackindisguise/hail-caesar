import EventEmitter from "events";
import { Server, createServer, Socket } from "net";

export type MUDClientOptions = {
	socket: Socket;
};

export type MUDServerOptions = {
	port: number;
};

export const TERMINAL_EOL = "\r\n";

export declare interface MUDClient {
	on(event: "command", listener: (command: string) => void): this;
	on(event: "close", listener: () => void): this;
	on(event: string, listener: Function): this;
}

export class MUDClient extends EventEmitter {
	private _socket: Socket;
	constructor(options: MUDClientOptions) {
		super();
		const socket = options.socket;
		socket.setEncoding("ascii");
		socket.on("data", (data: string) => {
			const lines = data.split(TERMINAL_EOL);
			if (lines.length == 1 && lines[0] == "") return;
			lines.pop(); // kill final empty line
			for (let line of lines) this.handle(line);
		});
		socket.on("close", (error) => {
			if (error) console.log(error);
			this.emit("close");
		});
		socket.on("end", () => {
			this.emit("close");
		});
		this._socket = socket;
	}

	send(msg: string) {
		this._socket.write(msg);
	}

	sendLine(line: string) {
		this._socket.write(`${line}${TERMINAL_EOL}`);
	}

	handle(command: string) {
		this.sendLine(`You said: '${command}'`);
		//		console.log(`${this._socket.address}: '${command}'`);
		this.emit("command", command);
	}

	close() {
		this._socket.end();
	}
}

export declare interface MUDServer {
	on(event: "connection", listener: (client: MUDClient) => void): this;
	on(event: "disconnection", listener: (client: MUDClient) => void): this;
	on(event: string, listener: Function): this;
}

export class MUDServer extends EventEmitter {
	private _server: Server;
	private _clients: MUDClient[] = [];
	constructor(options: MUDServerOptions) {
		super();
		const server = createServer((socket: Socket) => {
			const client: MUDClient = this.handle(socket);
			this.emit("connection", client);
			client.on("close", () => {
				this.disconnect(client);
			});
		});

		server.listen(options.port);
		this._server = server;
	}

	private handle(socket: Socket): MUDClient {
		const client = new MUDClient({ socket: socket });
		this._clients.push(client);
		return client;
	}

	private disconnect(client: MUDClient) {
		let index = this._clients.indexOf(client);
		if (index !== -1) this._clients.splice(index);
		this.emit("disconnection", client);
	}

	close() {
		this._server.close();
		this._clients.forEach((client) => client.close());
		this._clients = [];
	}
}
