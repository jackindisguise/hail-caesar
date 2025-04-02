import { equal, ok } from "node:assert/strict";
import { test, suite } from "node:test";
import { MUDServer, TERMINAL_EOL } from "./io.js";
import { createConnection } from "node:net";

suite("io.js", () => {
	let server: MUDServer;
	let clientSocket: ReturnType<typeof createConnection>;

	test("should create server and handle basic connection", async () => {
		server = new MUDServer({ port: 23000 });
		let connected = false;

		server.on("connection", (client) => {
			connected = true;
			client.sendLine("Welcome!");
		});

		clientSocket = createConnection({ port: 23000 });
		clientSocket.setEncoding("ascii");

		await new Promise<void>((resolve) => {
			clientSocket.on("data", (data: string) => {
				equal(data, `Welcome!${TERMINAL_EOL}`);
				ok(connected, "Server should emit connection event");
				resolve();
			});
		});

		server.close();
	});

	test("should handle client command processing", async () => {
		server = new MUDServer({ port: 23001 });
		let commandReceived = "";
		let echoReceived = "";

		server.on("connection", (client) => {
			client.on("command", (command) => {
				commandReceived = command;
			});
		});

		clientSocket = createConnection({ port: 23001 });
		clientSocket.setEncoding("ascii");

		await new Promise<void>((resolve) => {
			clientSocket.on("data", (data: string) => {
				echoReceived = data;
			});

			setTimeout(() => {
				clientSocket.write(`test command${TERMINAL_EOL}`);

				setTimeout(() => {
					equal(
						commandReceived,
						"test command",
						"Server should receive command"
					);
					equal(
						echoReceived,
						`You said: 'test command'${TERMINAL_EOL}`,
						"Client should receive echo"
					);
					resolve();
				}, 100);
			}, 100);
		});

		server.close();
	});

	test("should process multiple lines correctly", async () => {
		server = new MUDServer({ port: 23002 });
		const commands: string[] = [];

		server.on("connection", (client) => {
			client.on("command", (command) => {
				commands.push(command);
			});
		});

		clientSocket = createConnection({ port: 23002 });
		clientSocket.setEncoding("ascii");

		await new Promise<void>((resolve) => {
			setTimeout(() => {
				clientSocket.write(
					`command1${TERMINAL_EOL}command2${TERMINAL_EOL}command3${TERMINAL_EOL}`
				);

				setTimeout(() => {
					equal(commands.length, 3, "Should handle multiple commands");
					equal(commands[0], "command1");
					equal(commands[1], "command2");
					equal(commands[2], "command3");
					resolve();
				}, 100);
			}, 100);
		});

		server.close();
	});

	test("should handle client disconnection properly", async () => {
		server = new MUDServer({ port: 23003 });
		let disconnectionFired = false;

		server.on("connection", (client) => {
			client.on("close", () => {
				disconnectionFired = true;
			});
		});

		server.on("disconnection", () => {
			disconnectionFired = true;
		});

		clientSocket = createConnection({ port: 23003 });

		await new Promise<void>((resolve) => {
			setTimeout(() => {
				clientSocket.end();

				setTimeout(() => {
					ok(disconnectionFired, "Should handle client disconnection");
					resolve();
				}, 100);
			}, 100);
		});

		server.close();
	});

	test("should broadcast messages to all connected clients", async () => {
		server = new MUDServer({ port: 23004 });
		server.on("connection", (client) => {
			client.sendLine("broadcast test");
		});

		const clients: string[] = [];
		const socket1 = createConnection({ port: 23004 });
		const socket2 = createConnection({ port: 23004 });
		socket1.on("data", (data: string) => {
			clients.push("client1: " + data);
		});

		socket2.on("data", (data: string) => {
			clients.push("client2: " + data);
		});

		try {
			socket1.setEncoding("ascii");
			socket2.setEncoding("ascii");

			await new Promise<void>((resolve) => {
				setTimeout(() => {
					setTimeout(() => {
						equal(clients.length, 2, "Both clients should receive broadcast");
						//equal(clients[0], `client1: broadcast test${TERMINAL_EOL}`);
						//equal(clients[1], `client2: broadcast test${TERMINAL_EOL}`);
						resolve();
					}, 100);
				}, 100);
			});
		} finally {
			socket1.end();
			socket2.end();
			server.close();
		}
	});

	test("should send raw messages without EOL", async () => {
		server = new MUDServer({ port: 23005 });
		let rawMessage = "";

		server.on("connection", (client) => {
			client.send("raw test");
		});

		clientSocket = createConnection({ port: 23005 });
		clientSocket.setEncoding("ascii");

		await new Promise<void>((resolve) => {
			clientSocket.on("data", (data: string) => {
				rawMessage = data;
				equal(rawMessage, "raw test", "Should send raw message without EOL");
				resolve();
			});
		});

		server.close();
	});

	test("should close server and disconnect all clients", async () => {
		server = new MUDServer({ port: 23006 });
		let closeEventFired = false;
		const socket = createConnection({ port: 23006 });

		try {
			socket.on("close", () => {
				closeEventFired = true;
			});

			await new Promise<void>((resolve) => {
				setTimeout(() => {
					server.close();

					setTimeout(() => {
						ok(closeEventFired, "Server close should disconnect clients");
						resolve();
					}, 100);
				}, 100);
			});
		} finally {
			socket.end();
			server.close();
		}
	});

	// Cleanup after each test
	test.afterEach(() => {
		if (server) server.close();
		if (clientSocket) clientSocket.end();
	});
});
