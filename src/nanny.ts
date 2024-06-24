import { world } from "./database.js";
import { _ } from "./i18n.js";
import { logger } from "./winston.js";
import { autocomplete } from "./string.js";
import { Character } from "./character.js";
import { Classification } from "./classification.js";
import { MUDClient } from "./io.js";
import { Mob } from "./dungeon.js";

export function login(client: MUDClient) {
	let name: string,
		password: string,
		email: string,
		race: Classification,
		_class: Classification;

	client.sendLine(_("Welcome to {{world}}!", { world: world.name }));

	function getName() {
		client.ask(_("What's your name?"), confirmName);
	}

	function confirmName(pName: string) {
		client.ask(
			_("Is your name {{name}}? [y/n]", { name: pName }),
			(answer: string) => {
				if (autocomplete(answer, _("yes"))) {
					name = pName;
					motd();
				} else if (autocomplete(answer, _("no"))) getName();
				else confirmName(pName);
			}
		);
	}

	function motd() {
		client.sendLine(_("This is the MOTD!"));
		client.ask(_("Hit enter to continue: "), finish);
	}

	function finish() {
		logger.debug(
			_("{{client}} is playing as {{name}}.", {
				client: client,
				name: name,
			})
		);
		const character = new Character();
		character.mob = new Mob();
		character.mob.name = name;
		client.character = character;
		client.sendLine(
			_("Welcome to {{world}}, {{name}}!", { world: world.name, name: name })
		);
	}

	getName();
}
