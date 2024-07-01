import { _ } from "./build/i18n.js";
import { logger } from "./build/winston.js";
import { MUDServer } from "./build/io.js";
import { command, load as loadDatabase } from "./build/database.js";
import { login } from "./build/nanny.js";

await loadDatabase();
const server = new MUDServer();
server.on("connection", (client) => {
	login(client);
	client.on("command", (input) => {
		const result = command(client.character, input);
		if (!result) client.sendLine(_("Do what, now?"));
	});
});

server.start(23);
