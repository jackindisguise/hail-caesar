import { _ } from "./build/i18n.js";
import { logger } from "./build/winston.js";
import { MUDClient, MUDServer } from "./build/io.js";
import { load as loadDatabase } from "./build/database.js";
import { login } from "./build/nanny.js";
import { load as loadHandle, command } from "./build/handle.js";

await loadDatabase();
await loadHandle();
const server = new MUDServer();
server.on("connection", (client) => {
	login(client);
	client.on("command", (input) => {
		const result = command(client.character, input);
		if (!result) client.sendLine(_("Do what, now?"));
	});
});

server.start(23);
