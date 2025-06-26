import { CATEGORIES } from "../index.js";
import packageJson from "../../../package.json";

/**
 * Banner command - Displays the welcome banner
 */
const bannerCommand = {
	metadata: {
		name: "banner",
		description: "Display welcome banner",
		usage: "banner",
		category: CATEGORIES.CORE,
		aliases: ["welcome", "intro", "home", "h"],
	},

	/**
	 * Execute the banner command
	 * @param {Array} args - Command arguments (not used for this command)
	 * @returns {string} The banner text
	 */
	execute() {
		const asciiArt = `_   _       _         _____
| \\ | |     | |       / ____|
|  \\| | __ _| |_ ___ | |  __ _ __ ___  ___ _ __
| . \` |/ _\` | __/ _ \\| | |_ | '__/ _ \\/ _ \\ '_ \\
| |\\  | (_| | ||  __/| |__| | | |  __/  __/ | | |
|_| \\_|\\__,_|\\__\\___| \\_____|_|  \\___|\\__|_| |_|`;

		// Add rainbow animation to ASCII art
		const rainbowArt = asciiArt
			.split("")
			.map((char, index) => {
				if (char === " " || char === "\n") return char;
				return `<span class="rainbow-char" style="animation-delay: ${index * 0.1}s">${char}</span>`;
			})
			.join("");

		return `
${rainbowArt}

Welcome to the nate.green interactive terminal [Version ${packageJson.version}]

Available ng-cli commands:
<cmd>about</cmd> - Who dis?
<cmd>contact</cmd> - Get in touch
<cmd>projects</cmd> - Open source stuff
<cmd>skills</cmd> - List my technical skills

Type '<cmd>help</cmd>' for all commands.`;
	},
};

export default bannerCommand;
