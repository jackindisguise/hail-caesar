import { _ } from "./build/i18n.js";
import { logger } from "./build/winston.js";
import { MUDClient, MUDServer } from "./build/io.js";
import { load, world } from "./build/database.js";
import { login } from "./build/nanny.js";
import { command } from "./build/handle.js";

logger.error("This is an error.");

await load();
const server = new MUDServer();
server.on("connection", (client) => {
	login(client);
	client.on("command", (input) => {
		command(client.character, input);
	});
});

server.start(23);
