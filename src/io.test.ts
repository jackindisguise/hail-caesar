import { equal, notEqual, ok, fail, throws } from "node:assert/strict";
import { test, suite } from "node:test";
import { MUDClient, MUDServer, TERMINAL_EOL } from "./io.js";
import { createConnection } from "node:net";

suite("io.js", () => {
	test("Create server.", () => {
		const server = new MUDServer({ port: 23 });
		server.on("connection", (client) => {
			client.sendLine("Sup bro.");
		});

		const socket = createConnection({ port: 23 });

		socket.setEncoding("ascii");
		socket.on("data", (data: string) => {
			equal(data, `Sup bro.${TERMINAL_EOL}`);
			server.close();
		});
	});
});
