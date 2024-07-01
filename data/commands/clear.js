export const keyword = "clear";
export const syntax = "clear";
export const description = "Clear the screen.";
export const rule = /^clear\s*$/;
export const script = (character) => {
	for (let i = 0; i < 60; i++) character.sendLine("");
};
