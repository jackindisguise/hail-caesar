import { MUDClient, MUDServer } from "./build/io.js";
import { load } from "./build/database.js";

load(() => {
	const server = new MUDServer();
	server.on("connection", (client) => {
		//console.log(`new connection @${client.address}`);
		client.on("command", (command) => {
			//console.log(`@${client.address}: '${command}'`);
		});
		client.on("close", () => {
			//console.log(`@${client.address} disconnected.`);
		});
	});
});
