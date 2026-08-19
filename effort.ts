import { getSupportedThinkingLevels } from "@mariozechner/pi-ai";
import type { ThinkingLevel } from "@mariozechner/pi-agent-core";
import type { ExtensionAPI, ExtensionContext } from "@mariozechner/pi-coding-agent";
import type { AutocompleteItem } from "@mariozechner/pi-tui";

const EFFORT_LEVELS: ThinkingLevel[] = ["off", "minimal", "low", "medium", "high", "xhigh"];

function updateStatus(ctx: ExtensionContext, level: ThinkingLevel): void {
	if (!ctx.hasUI) return;
	ctx.ui.setStatus("effort", `effort:${level}`);
}

function availableLevels(ctx: ExtensionContext): ThinkingLevel[] {
	if (!ctx.model) return ["off"];
	const levels = getSupportedThinkingLevels(ctx.model) as ThinkingLevel[];
	if (levels.length === 0) throw new Error("active model has no effort levels");
	return levels;
}

export default function effortExtension(pi: ExtensionAPI) {
	pi.on("session_start", async (_event, ctx) => {
		updateStatus(ctx, pi.getThinkingLevel());
	});

	pi.on("thinking_level_select", async (event, ctx) => {
		updateStatus(ctx, event.level);
	});

	pi.on("model_select", async (_event, ctx) => {
		updateStatus(ctx, pi.getThinkingLevel());
	});

	pi.on("session_shutdown", async (_event, ctx) => {
		if (ctx.hasUI) ctx.ui.setStatus("effort", undefined);
	});

	pi.registerCommand("effort", {
		description: "Show or set model reasoning effort",
		getArgumentCompletions: (prefix: string): AutocompleteItem[] | null => {
			const matches = EFFORT_LEVELS.filter((level) => level.startsWith(prefix)).map((level) => ({
				value: level,
				label: level,
			}));
			return matches.length > 0 ? matches : null;
		},
		handler: async (args, ctx) => {
			const levels = availableLevels(ctx);
			const requested = args.trim();
			let selected: ThinkingLevel | undefined;

			if (requested) {
				if (!EFFORT_LEVELS.includes(requested as ThinkingLevel)) {
					ctx.ui.notify(`Unknown effort: ${requested}`, "error");
					return;
				}
				selected = requested as ThinkingLevel;
				if (!levels.includes(selected)) {
					ctx.ui.notify(`Effort ${selected} is not supported by ${ctx.model?.id ?? "the active model"}`, "error");
					return;
				}
			} else {
				selected = (await ctx.ui.select("Model reasoning effort", levels)) as ThinkingLevel | undefined;
				if (!selected) return;
			}

			pi.setThinkingLevel(selected, { persist: false });
			const effective = pi.getThinkingLevel();
			updateStatus(ctx, effective);
			ctx.ui.notify(`Effort: ${effective}`, "info");
		},
	});
}
