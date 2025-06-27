import { useState, useEffect, useRef, useCallback } from "react";
import TerminalHeader from "./TerminalHeader";
import TerminalConsole from "./TerminalConsole";
import TerminalPrompt from "./TerminalPrompt";
import TerminalFooter from "./TerminalFooter";
import { useTheme } from "../../contexts/ThemeContext";
import {
	loadCommands,
	executeCommand,
	getAllCommands,
} from "../../commands/index";
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
	const [vimMode, setVimMode] = useState("INSERT"); // INSERT or NORMAL
	const { theme, toggleTheme } = useTheme();

	const consoleRef = useRef(null);
	const inputRef = useRef(null);
	// Reference for future command registry manipulations
	// const commandRegistryRef = useRef({});

	// Global key listener for NORMAL mode
	useEffect(() => {
		const handleGlobalKeyDown = (e) => {
			if (vimMode === "NORMAL") {
				// Switch to INSERT mode
				if (e.key === "i") {
					e.preventDefault();
					setVimMode("INSERT");
					inputRef.current?.focus();
					return;
				}

				// Vim navigation keys
				if (e.key === "h" || e.key === "j" || e.key === "k" || e.key === "l") {
					e.preventDefault();
					handleVimNavigation(e.key);
					return;
				}
			}
		};

		document.addEventListener("keydown", handleGlobalKeyDown);
		return () => document.removeEventListener("keydown", handleGlobalKeyDown);
	}, [vimMode]);

	// Toggle fullscreen mode
	const toggleFullscreen = useCallback((e) => {
		if (e) e.stopPropagation(); // Prevent container click handler from firing
		setIsFullscreen(!isFullscreen);

		// Focus back on input after toggling
		setTimeout(() => {
			if (inputRef.current && vimMode === "INSERT") {
				inputRef.current.focus();
			}
		}, 100);
	}, [isFullscreen, vimMode]);

	// Toggle vim mode
	const toggleVimMode = useCallback(() => {
		const newMode = vimMode === "INSERT" ? "NORMAL" : "INSERT";
		setVimMode(newMode);

		if (newMode === "INSERT") {
			inputRef.current?.focus();
		} else {
			inputRef.current?.blur();
		}

		return newMode;
	}, [vimMode]);

	// Handle command execution
	const processCommand = useCallback((commandStr) => {
		const args = commandStr.trim().split(" ");
		const cmd = args.shift().toLowerCase();

		if (cmd === "") {
			return "";
		}

		// Create context object with terminal state and functions
		const context = {
			toggleFullscreen,
			toggleTheme,
			toggleVimMode,
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
	}, [toggleFullscreen, toggleTheme, toggleVimMode, theme]);

	// Handle browser back/forward navigation
	useEffect(() => {
		const handlePopState = () => {
			const path = window.location.pathname;
			const commandMap = {
				'/': 'banner',
				'/contact': 'contact', 
				'/projects': 'projects',
				'/skills': 'skills'
			};
			
			const command = commandMap[path];
			if (command) {
				// Execute the command without updating URL again
				setInputValue(command);
				const output = processCommand(command);
				
				// Clear console and add command
				setCommandHistory([]);
				addCommandToHistory(command, true);
				
				if (output) {
					addCommandToHistory("");
					output.split("\n").forEach((line) => {
						addCommandToHistory(line);
					});
					addCommandToHistory("");
				}
				
				setInputValue("");
				setCursorPosition(0);
			}
		};

		window.addEventListener('popstate', handlePopState);
		return () => window.removeEventListener('popstate', handlePopState);
	}, [processCommand]);

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
			"ontouchstart" in window ||
			navigator.maxTouchPoints > 0 ||
			navigator.msMaxTouchPoints > 0 ||
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent,
			)
		);
	};

	// Handle clickable command
	const handleCommandClick = (cmd) => {
		// Add command to input history
		setInputHistory((prev) => {
			const filtered = prev.filter((command) => command !== cmd);
			return [...filtered, cmd].slice(-50);
		});

		// Reset history navigation
		setHistoryIndex(-1);

		// Set the command in the input field
		setInputValue(cmd);

		// Clear terminal before executing command (skip for mode commands)
		if (cmd !== "mode" && cmd !== "vim" && cmd !== "m") {
			setCommandHistory([]);
		}

		// Execute the command
		const output = processCommand(cmd);
		
		// Update URL for analytics tracking
		updateUrlForCommand(cmd);

		// Skip adding to history for mode commands (silent execution)
		if (cmd !== "mode" && cmd !== "vim" && cmd !== "m") {
			addCommandToHistory(cmd, true);

			if (output) {
				// Add spacing before output
				addCommandToHistory("");
				output.split("\n").forEach((line) => {
					addCommandToHistory(line);
				});
				// Add spacing after output
				addCommandToHistory("");
			}
		}

		// Add available commands footer to output (skip for banner, help, and mode commands)
		if (
			cmd !== "banner" &&
			!cmd.startsWith("banner ") &&
			cmd !== "help" &&
			!cmd.startsWith("help ") &&
			cmd !== "mode" &&
			cmd !== "vim" &&
			cmd !== "m"
		) {
			addCommandToHistory("=-=-=-=-=-=-=-=-=-=");
			addCommandToHistory(
				"ng-cli available commands: <cmd>skills</cmd> | <cmd>projects</cmd> | <cmd>contact</cmd> | <cmd>help</cmd> | <cmd>sitemap</cmd> | <cmd>theme</cmd> | <cmd>fullscreen</cmd>",
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
			return [
				"help",
				"about",
				"skills",
				"projects",
				"contact",
				"sitemap",
				"clear",
				"theme",
				"fullscreen",
			];
		}
	};

	// Handle tab completion
	const handleTabCompletion = () => {
		const availableCommands = getAvailableCommands();
		const matches = availableCommands.filter((cmd) =>
			cmd.toLowerCase().startsWith(inputValue.toLowerCase()),
		);

		if (matches.length === 1) {
			// Single match - complete the command
			setInputValue(matches[0]);
			setCursorPosition(matches[0].length);
		} else if (matches.length > 1) {
			// Multiple matches - show suggestions without changing input
			addCommandToHistory(`${inputValue}`, false);
			addCommandToHistory(`Possible completions: ${matches.join(", ")}`, false);
		}
		// If no matches, do nothing (keep input unchanged)
	};

	// Handle command history navigation
	const navigateHistory = (direction) => {
		if (inputHistory.length === 0) return;

		let newIndex;
		if (direction === "up") {
			newIndex =
				historyIndex === -1
					? inputHistory.length - 1
					: Math.max(0, historyIndex - 1);
		} else {
			newIndex =
				historyIndex === -1
					? -1
					: Math.min(inputHistory.length - 1, historyIndex + 1);
			if (
				newIndex === inputHistory.length - 1 &&
				historyIndex === inputHistory.length - 1
			) {
				newIndex = -1;
			}
		}

		setHistoryIndex(newIndex);
		const newValue = newIndex === -1 ? "" : inputHistory[newIndex];
		setInputValue(newValue);
		setCursorPosition(newValue.length);
	};

	// Handle vim navigation in NORMAL mode
	const handleVimNavigation = (key) => {
		if (!consoleRef.current) return;

		const scrollAmount = 50; // pixels to scroll
		const currentScroll = consoleRef.current.scrollTop;
		const maxScroll =
			consoleRef.current.scrollHeight - consoleRef.current.clientHeight;

		switch (key) {
			case "j": // scroll down
				consoleRef.current.scrollTop = Math.min(
					currentScroll + scrollAmount,
					maxScroll,
				);
				break;
			case "k": // scroll up
				consoleRef.current.scrollTop = Math.max(
					currentScroll - scrollAmount,
					0,
				);
				break;
			case "h": // scroll left (not much use in terminal, but for completeness)
				consoleRef.current.scrollLeft = Math.max(
					consoleRef.current.scrollLeft - scrollAmount,
					0,
				);
				break;
			case "l": // scroll right
				consoleRef.current.scrollLeft =
					consoleRef.current.scrollLeft + scrollAmount;
				break;
		}
	};

	// Update URL for analytics tracking
	const updateUrlForCommand = (commandName) => {
		const contentCommands = ['contact', 'projects', 'skills'];
		const coreRoutes = {
			'banner': '/',
			'welcome': '/',
			'intro': '/',
			'home': '/',
			'h': '/'
		};
		
		if (contentCommands.includes(commandName)) {
			window.history.pushState(null, '', `/${commandName}`);
		} else if (coreRoutes[commandName]) {
			window.history.pushState(null, '', coreRoutes[commandName]);
		}
		// Don't update URL for core commands like help, clear, theme, etc.
	};

	// Handle key press in input
	const handleKeyDown = (e) => {
		// F11 or Alt+Enter to toggle fullscreen
		if (e.key === "F11" || (e.altKey && e.key === "Enter")) {
			e.preventDefault();
			toggleFullscreen(e);
			return;
		}

		// Only handle regular input in INSERT mode
		if (vimMode !== "INSERT") {
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
			navigateHistory("up");
			return;
		}

		if (e.key === "ArrowDown") {
			e.preventDefault();
			navigateHistory("down");
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
				setInputHistory((prev) => {
					// Avoid duplicates - remove if command already exists
					const filtered = prev.filter((cmd) => cmd !== command);
					// Add to end and limit to last 50 commands
					return [...filtered, command].slice(-50);
				});
			}

			// Reset history navigation
			setHistoryIndex(-1);

			// Clear terminal before executing command (skip for mode commands)
			const commandName = command.split(" ")[0];
			if (
				commandName !== "mode" &&
				commandName !== "vim" &&
				commandName !== "m"
			) {
				setCommandHistory([]);
			}

			// Execute command and get output
			const output = processCommand(command);
			
			// Update URL for analytics tracking
			updateUrlForCommand(commandName);

			// Skip adding to history for mode commands (silent execution)
			if (
				commandName !== "mode" &&
				commandName !== "vim" &&
				commandName !== "m"
			) {
				addCommandToHistory(command, true);

				if (output) {
					// Add spacing before output
					addCommandToHistory("");
					output.split("\n").forEach((line) => {
						addCommandToHistory(line);
					});
					// Add spacing after output
					addCommandToHistory("");
				}
			}

			// Add available commands footer to output (skip for banner, help, and mode commands)
			if (
				command !== "banner" &&
				!command.startsWith("banner ") &&
				command !== "help" &&
				!command.startsWith("help ") &&
				commandName !== "mode" &&
				commandName !== "vim" &&
				commandName !== "m"
			) {
				addCommandToHistory("");
				addCommandToHistory(
					"<cmd>skills</cmd> | <cmd>projects</cmd> | <cmd>contact</cmd> | <cmd>help</cmd> | <cmd>sitemap</cmd> | <cmd>theme</cmd> | <cmd>fullscreen</cmd>",
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

	// Handle input click - switch to INSERT mode
	const handleInputClick = () => {
		if (vimMode === "NORMAL") {
			setVimMode("INSERT");
		}
	};

	// Handle initial URL routing on page load
	useEffect(() => {
		if (commandsLoaded && commandHistory.length === 0) {
			const path = window.location.pathname;
			const commandMap = {
				'/': 'banner',
				'/contact': 'contact', 
				'/projects': 'projects',
				'/skills': 'skills'
			};
			
			const command = commandMap[path] || 'banner';
			// Execute the initial command
			const output = processCommand(command);
			
			if (output) {
				addCommandToHistory("");
				output.split("\n").forEach((line) => {
					addCommandToHistory(line);
				});
				addCommandToHistory("");
			}
		}
	}, [commandsLoaded, commandHistory.length, processCommand]);

	// Scroll to top of console when command history changes (after command execution)
	useEffect(() => {
		if (consoleRef.current) {
			consoleRef.current.scrollTop = 0;
		}
	}, [commandHistory]);


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
					handleInputClick={handleInputClick}
				/>

				<TerminalFooter status={status} vimMode={vimMode} />
			</div>
		</>
	);
}

export default Terminal;
