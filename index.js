import { t } from "./build/i18n.js";
import { logger } from "./build/winston.js";
import { MUDServer } from "./build/io.js";
import { login } from "./build/nanny.js";
import { command, load, world } from "./build/database.js";
import { readFileSync } from "fs";
import { Colorizer } from "./build/color.js";
import * as _package from "./package.json" assert { type: "json" };
import chalk from "chalk";

const lines = readFileSync("./data/splash.txt", "utf8").split("\n");
logger.debug(t("Loading game database..."));
await load();
for (let line of lines) logger.debug(line);
logger.debug(
	t("Loaded {{name}} v{{version}}", {
		name: chalk.white(world.name),
		version: chalk.yellowBright(_package.default.version),
	})
);
const server = new MUDServer();
server.on("connection", (client) => {
	login(client);
	client.on("command", (input) => {
		const result = command(client.character, input);
		if (!result) client.sendLine(_("Do what, now?"));
	});
});

server.start(world.port);
