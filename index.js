import { EOL } from "os";
import { t } from "i18next";
import { configureBackend } from "./build/i18n.js";
import { logger } from "./build/winston.js";
import { MUDServer } from "./build/io.js";
import { login } from "./build/nanny.js";
import { command, load, config } from "./build/db.js";
import { setAbsoluteInterval } from "./build/time.js";
import { save } from "./build/database/runtime.js";
import { readFileSync } from "fs";
//import { Colorizer } from "./build/color.js";
import * as _package from "./package.json" assert { type: "json" };
import chalk from "chalk";

// configure i18next
await configureBackend();

// start the game
const splash = readFileSync("./data/splash.txt", "utf8");
const splashLines = splash.split(EOL);
logger.debug(t("Loading game database..."));
await load();
for (let line of splashLines) logger.debug(line);
logger.debug(
	t("Loaded {{name}} v{{version}}", {
		name: chalk.white(config.world.name),
		version: chalk.yellowBright(_package.default.version),
	})
);
const server = new MUDServer();
server.on("connection", (client) => {
	login(client);
	client.on("command", (input) => {
		const result = command(client.character, input);
		if (!result) client.sendLine(t("Do what, now?"));
	});
});

server.start(config.server.port);

setAbsoluteInterval((delay) => {
	save();
}, 1000 * 60);
