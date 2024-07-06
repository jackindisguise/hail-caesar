export const keyword = "bell";
export const syntax = "bell";
export const description = "Ring a bell.";
export const rule = /^(?:bell|bel|be|b)$/;
export const script = (character, comment) => {
	character.send("\x07");
};
