import { useState, useEffect, useRef } from "react";
import TerminalHeader from "./TerminalHeader";
import TerminalConsole from "./TerminalConsole";
import TerminalPrompt from "./TerminalPrompt";
import TerminalFooter from "./TerminalFooter";
import { useTheme } from "../../contexts/ThemeContext";
import { loadCommands, executeCommand, getAllCommands } from "../../commands/index";
import "./Terminal.css";

function Terminal() {
	const [commandHistory, setCommandHistory] = useState([]);
	const [inputValue, setInputValue] = useState("");
	const [cursorPosition, setCursorPosition] = useState(0);
	const [status, setStatus] = useState("Loading...");
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [commandsLoaded, setCommandsLoaded] = useState(false);
	const [inputHistory, setInputHistory] = useState([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const { theme, toggleTheme } = useTheme();

	const consoleRef = useRef(null);
	const inputRef = useRef(null);
	// Reference for future command registry manipulations
	// const commandRegistryRef = useRef({});

	// Load commands on component mount
	useEffect(() => {
		const initializeCommands = async () => {
			try {
				await loadCommands();
				setCommandsLoaded(true);
				setStatus("Ready");
			} catch (error) {
				console.error("Failed to load commands:", error);
				setStatus("Error loading commands");
				addCommandToHistory(
					`Error: Failed to initialize command system. ${error.message}`,
				);
			}
		};

		initializeCommands();
	}, []);

	// Handle command execution
	const processCommand = (commandStr) => {
		const args = commandStr.trim().split(" ");
		const cmd = args.shift().toLowerCase();

		if (cmd === "") {
			return "";
		}

		// Create context object with terminal state and functions
		const context = {
			toggleFullscreen,
			toggleTheme,
			theme,
		};

		// Execute the command
		try {
			const output = executeCommand(cmd, args, context);

			// Special handling for clear command
			if (cmd === "clear" && output === "CLEAR_COMMAND") {
				setCommandHistory([]);
				return "";
			}

			return output;
		} catch (e) {
			console.error(`Error executing command ${cmd}:`, e);
			return `Error executing command: ${e.message}`;
		}
	};

	// Add a new line to the command history
	const addCommandToHistory = (command, isCommand = false, output = "") => {
		setCommandHistory((prev) => [
			...prev,
			{ type: isCommand ? "command" : "output", content: command },
			...(output ? [{ type: "output", content: output }] : []),
		]);
	};

	// Utility to detect mobile/touch devices
	const isMobileDevice = () => {
		return (
			'ontouchstart' in window ||
			navigator.maxTouchPoints > 0 ||
			navigator.msMaxTouchPoints > 0 ||
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
		);
	};

	// Handle clickable command
	const handleCommandClick = (cmd) => {
		// Add command to input history
		setInputHistory(prev => {
			const filtered = prev.filter(command => command !== cmd);
			return [...filtered, cmd].slice(-50);
		});

		// Reset history navigation
		setHistoryIndex(-1);

		// Set the command in the input field
		setInputValue(cmd);

		// Clear terminal before executing command
		setCommandHistory([]);

		// Execute the command
		addCommandToHistory(cmd, true);

		// Get output
		const output = processCommand(cmd);
		if (output) {
			// Add spacing before output
			addCommandToHistory("");
			output.split("\n").forEach((line) => {
				addCommandToHistory(line);
			});
			// Add spacing after output
			addCommandToHistory("");
		}

		// Add available commands footer to output (skip for banner and help commands)
		if (cmd !== 'banner' && !cmd.startsWith('banner ') && cmd !== 'help' && !cmd.startsWith('help ')) {
			addCommandToHistory("=-=-=-=-=-=-=-=-=-=");
			addCommandToHistory(
				"ng-cli available commands: <cmd>about</cmd> | <cmd>skills</cmd> | <cmd>projects</cmd> | <cmd>contact</cmd> | <cmd>help</cmd> | <cmd>sitemap</cmd> | <cmd>theme</cmd> | <cmd>fullscreen</cmd>",
			);
		}

		// Clear input
		setInputValue("");
		setCursorPosition(0);

		// Update status
		setStatus("Processing...");
		setTimeout(() => {
			setStatus("Ready");
		}, 500);
	};

	// Get available commands for tab completion
	const getAvailableCommands = () => {
		try {
			const commands = getAllCommands();
			return Object.keys(commands);
		} catch (error) {
			// Fallback to default commands if registry not loaded
			return ['help', 'about', 'skills', 'projects', 'contact', 'sitemap', 'clear', 'theme', 'fullscreen'];
		}
	};

	// Handle tab completion
	const handleTabCompletion = () => {
		const availableCommands = getAvailableCommands();
		const matches = availableCommands.filter(cmd => 
			cmd.toLowerCase().startsWith(inputValue.toLowerCase())
		);

		if (matches.length === 1) {
			// Single match - complete the command
			setInputValue(matches[0]);
			setCursorPosition(matches[0].length);
		} else if (matches.length > 1) {
			// Multiple matches - show suggestions without changing input
			addCommandToHistory(`${inputValue}`, false);
			addCommandToHistory(`Possible completions: ${matches.join(', ')}`, false);
		}
		// If no matches, do nothing (keep input unchanged)
	};

	// Handle command history navigation
	const navigateHistory = (direction) => {
		if (inputHistory.length === 0) return;

		let newIndex;
		if (direction === 'up') {
			newIndex = historyIndex === -1 ? inputHistory.length - 1 : Math.max(0, historyIndex - 1);
		} else {
			newIndex = historyIndex === -1 ? -1 : Math.min(inputHistory.length - 1, historyIndex + 1);
			if (newIndex === inputHistory.length - 1 && historyIndex === inputHistory.length - 1) {
				newIndex = -1;
			}
		}

		setHistoryIndex(newIndex);
		const newValue = newIndex === -1 ? '' : inputHistory[newIndex];
		setInputValue(newValue);
		setCursorPosition(newValue.length);
	};

	// Handle key press in input
	const handleKeyDown = (e) => {
		// F11 or Alt+Enter to toggle fullscreen
		if (e.key === "F11" || (e.altKey && e.key === "Enter")) {
			e.preventDefault();
			toggleFullscreen(e);
			return;
		}

		// Tab completion
		if (e.key === "Tab") {
			e.preventDefault();
			handleTabCompletion();
			return;
		}

		// Command history navigation
		if (e.key === "ArrowUp") {
			e.preventDefault();
			navigateHistory('up');
			return;
		}

		if (e.key === "ArrowDown") {
			e.preventDefault();
			navigateHistory('down');
			return;
		}

		// Reset history index when typing
		if (e.key !== "ArrowUp" && e.key !== "ArrowDown" && historyIndex !== -1) {
			setHistoryIndex(-1);
		}

		if (e.key === "Enter") {
			const command = inputValue.trim();

			// Only add non-empty commands to input history
			if (command) {
				setInputHistory(prev => {
					// Avoid duplicates - remove if command already exists
					const filtered = prev.filter(cmd => cmd !== command);
					// Add to end and limit to last 50 commands
					return [...filtered, command].slice(-50);
				});
			}

			// Reset history navigation
			setHistoryIndex(-1);

			// Clear terminal before executing command
			setCommandHistory([]);

			// Add command to history display
			addCommandToHistory(command, true);

			// Execute command and get output
			const output = processCommand(command);
			if (output) {
				// Add spacing before output
				addCommandToHistory("");
				output.split("\n").forEach((line) => {
					addCommandToHistory(line);
				});
				// Add spacing after output
				addCommandToHistory("");
			}

			// Add available commands footer to output (skip for banner and help commands)
			if (command !== 'banner' && !command.startsWith('banner ') && command !== 'help' && !command.startsWith('help ')) {
				addCommandToHistory("");
				addCommandToHistory(
					"Available commands: <cmd>about</cmd> | <cmd>skills</cmd> | <cmd>projects</cmd> | <cmd>contact</cmd> | <cmd>help</cmd> | <cmd>sitemap</cmd> | <cmd>theme</cmd> | <cmd>fullscreen</cmd>",
				);
			}

			// Clear input
			setInputValue("");
			setCursorPosition(0);

			// Update status
			setStatus("Processing...");
			setTimeout(() => {
				setStatus("Ready");
			}, 500);
		}
	};

	// Update cursor position when input changes
	const handleInputChange = (e) => {
		setInputValue(e.target.value);
		setCursorPosition(e.target.value.length);
	};

	// Focus input when container is clicked (but not on mobile for better UX)
	const handleContainerClick = () => {
		if (!isMobileDevice()) {
			inputRef.current.focus();
		}
	};

	// Toggle fullscreen mode
	const toggleFullscreen = (e) => {
		if (e) e.stopPropagation(); // Prevent container click handler from firing
		setIsFullscreen(!isFullscreen);

		// Focus back on input after toggling
		setTimeout(() => {
			if (inputRef.current) {
				inputRef.current.focus();
			}
		}, 100);
	};

	// Scroll to top of console when command history changes (after command execution)
	useEffect(() => {
		if (consoleRef.current) {
			consoleRef.current.scrollTop = 0;
		}
	}, [commandHistory]);

	// Initial banner - using a ref to ensure it only runs once
	const bannerShownRef = useRef(false);

	useEffect(() => {
		// Only show banner when commands are loaded and if not shown before
		if (
			commandsLoaded &&
			commandHistory.length === 0 &&
			!bannerShownRef.current
		) {
			bannerShownRef.current = true;
			const bannerOutput = executeCommand("banner");
			// Add spacing before banner
			addCommandToHistory("");
			bannerOutput.split("\n").forEach((line) => {
				addCommandToHistory(line);
			});
			// Add spacing after banner
			addCommandToHistory("");
		}
	}, [commandsLoaded, commandHistory.length]);

	return (
		<>
			<div className="crt-effect"></div>
			<div
				className={`container ${isFullscreen ? "fullscreen" : ""}`}
				onClick={handleContainerClick}
			>
				<TerminalHeader
					isFullscreen={isFullscreen}
					toggleFullscreen={toggleFullscreen}
					theme={theme}
					toggleTheme={toggleTheme}
					onHeaderClick={handleCommandClick}
				/>

				<TerminalConsole
					consoleRef={consoleRef}
					commandHistory={commandHistory}
					handleCommandClick={handleCommandClick}
				/>

				<TerminalPrompt
					inputRef={inputRef}
					inputValue={inputValue}
					cursorPosition={cursorPosition}
					handleInputChange={handleInputChange}
					handleKeyDown={handleKeyDown}
				/>

				<TerminalFooter status={status} />
			</div>
		</>
	);
}

export default Terminal;
