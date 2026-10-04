window.__ModuleLoader__.load({
	id: "dsh-client-ui-wallpaper",
	factory: function (require) {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		var ROUTE = "/wallpaper";
		var LAYER_ID = "dsh-wallpaper-layer";
		var STYLE_ID = "dsh-wallpaper-style";
		var VAR_NAMES = ["--dsh-wp-panel", "--dsh-wp-panel-strong", "--dsh-wp-dim", "--dsh-wp-position", "--dsh-wp-window", "--dsh-wp-blur", "--dsh-wp-blur-scale", "--dsh-wp-sidebar"];
		var CSS = "html, body { background-color: transparent !important; }\n\nbody[data-dsh-wallpaper=\"on\"] {\n  --dsw-alias-bg-base: color-mix(in srgb, var(--dsw-static-neutral-bluish-00) var(--dsh-wp-panel, 22%), transparent) !important;\n  --dsw-alias-bg-layer-1: color-mix(in srgb, var(--dsw-static-neutral-bluish-00) var(--dsh-wp-panel-strong, 48%), transparent) !important;\n  --dsw-alias-bg-layer-2: color-mix(in srgb, var(--dsw-static-neutral-bluish-00) var(--dsh-wp-panel-strong, 48%), transparent) !important;\n  --dsw-alias-bg-layer-3: color-mix(in srgb, var(--dsw-static-neutral-bluish-00) var(--dsh-wp-panel-strong, 48%), transparent) !important;\n  --dsw-alias-bg-module-platform: color-mix(in srgb, var(--dsw-static-neutral-bluish-00) var(--dsh-wp-panel-strong, 48%), transparent) !important;\n  --dsw-specific-sidebar-fill: color-mix(in srgb, var(--dsw-static-neutral-bluish-50) var(--dsh-wp-sidebar, var(--dsh-wp-panel, 22%)), transparent) !important;\n}\nbody[data-ds-dark-theme][data-dsh-wallpaper=\"on\"] {\n  --dsw-alias-bg-base: color-mix(in srgb, var(--dsw-static-neutral-bluish-950) var(--dsh-wp-panel, 22%), transparent) !important;\n  --dsw-alias-bg-layer-1: color-mix(in srgb, var(--dsw-static-neutral-bluish-875) var(--dsh-wp-panel-strong, 48%), transparent) !important;\n  --dsw-alias-bg-layer-2: color-mix(in srgb, var(--dsw-static-neutral-bluish-850) var(--dsh-wp-panel-strong, 48%), transparent) !important;\n  --dsw-alias-bg-layer-3: color-mix(in srgb, var(--dsw-static-neutral-bluish-850) var(--dsh-wp-panel-strong, 48%), transparent) !important;\n  --dsw-alias-bg-module-platform: color-mix(in srgb, var(--dsw-static-neutral-bluish-875) var(--dsh-wp-panel-strong, 48%), transparent) !important;\n  --dsw-specific-sidebar-fill: color-mix(in srgb, var(--dsw-static-neutral-bluish-900) var(--dsh-wp-sidebar, var(--dsh-wp-panel, 22%)), transparent) !important;\n}\n\nbody[data-dsh-wallpaper=\"on\"] > #dsh-wallpaper-layer {\n  position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; background-color: #0b0b0d;\n}\nbody[data-dsh-wallpaper=\"on\"] > #root {\n  position: relative; z-index: 1; background-color: transparent !important;\n}\n#dsh-wallpaper-layer > img,\n#dsh-wallpaper-layer > video {\n  position: absolute; inset: 0; width: 100%; height: 100%; display: block;\n  object-fit: cover; object-position: var(--dsh-wp-position, center);\n}\n/* Theme-matched veil: keeps text readable while the wallpaper covers the window. */\n#dsh-wallpaper-layer > .dsh-wallpaper-scrim {\n  position: absolute; inset: 0; background-color: rgba(255, 255, 255, var(--dsh-wp-dim, 0.45));\n}\nbody[data-ds-dark-theme] > #dsh-wallpaper-layer > .dsh-wallpaper-scrim {\n  background-color: rgba(0, 0, 0, var(--dsh-wp-dim, 0.45));\n}\n\n/* Structural columns are windows onto the wallpaper. */\nbody[data-dsh-wallpaper=\"on\"] [class*=\"_frame\"],\nbody[data-dsh-wallpaper=\"on\"] [class*=\"_centerCol\"],\nbody[data-dsh-wallpaper=\"on\"] [class*=\"_rightbarCol\"],\nbody[data-dsh-wallpaper=\"on\"] [class*=\"_rightbarCol\"],\nbody[data-dsh-wallpaper=\"on\"] [class*=\"_leadingSeat\"],\nbody[data-dsh-wallpaper=\"on\"] [class*=\"_overlayLayer\"],\nbody[data-dsh-wallpaper=\"on\"] [class*=\"_topStrip\"],\nbody[data-dsh-wallpaper=\"on\"] [class*=\"_body\"] {\n  background-color: transparent !important;\n}\n/* Safety net: any large surface the client marked stays see-through. */\nbody[data-dsh-wallpaper=\"on\"] [data-dsh-wp-clear] {\n  background-color: transparent !important;\n}\n";
		var BLUR_CSS = "body[data-dsh-wallpaper=\"on\"] > #dsh-wallpaper-layer > img, body[data-dsh-wallpaper=\"on\"] > #dsh-wallpaper-layer > video { filter: blur(var(--dsh-wp-blur, 0px)); transform: scale(var(--dsh-wp-blur-scale, 1)); transform-origin: center center; transition: filter .18s ease, transform .18s ease; }";
		var SURFACE_CSS = "/* Settings / dialogs keep the palette their own appearance defines. */\nbody[data-dsh-wallpaper=\"on\"]:not([data-ds-dark-theme]) [role=\"dialog\"], body[data-dsh-wallpaper=\"on\"]:not([data-ds-dark-theme]) [class*=\"_dialog\"], body[data-dsh-wallpaper=\"on\"]:not([data-ds-dark-theme]) [class*=\"_modal\"], body[data-dsh-wallpaper=\"on\"]:not([data-ds-dark-theme]) [class*=\"_overlay\"], body[data-dsh-wallpaper=\"on\"]:not([data-ds-dark-theme]) [class*=\"_overlayLayer\"], body[data-dsh-wallpaper=\"on\"]:not([data-ds-dark-theme]) [class*=\"_settings\"] { --dsw-alias-label-primary: var(--dsw-static-neutral-bluish-1000); --dsw-alias-label-secondary: var(--dsw-static-neutral-bluish-700); --dsw-alias-label-tertiary: var(--dsw-static-neutral-bluish-600); --dsw-alias-label-caption: var(--dsw-static-neutral-bluish-400); --dsw-alias-label-dimmed: var(--dsw-static-neutral-bluish-200); --dsw-alias-label-primary-dimmed: var(--dsw-static-neutral-bluish-950); --dsw-alias-label-primary-foreground: var(--dsw-static-neutral-bluish-00); --dsw-alias-menu-icon: var(--dsw-static-neutral-bluish-800); --dsw-alias-link: var(--dsw-static-deepseek-500); }\nbody[data-ds-dark-theme][data-dsh-wallpaper=\"on\"] [role=\"dialog\"], body[data-ds-dark-theme][data-dsh-wallpaper=\"on\"] [class*=\"_dialog\"], body[data-ds-dark-theme][data-dsh-wallpaper=\"on\"] [class*=\"_modal\"], body[data-ds-dark-theme][data-dsh-wallpaper=\"on\"] [class*=\"_overlay\"], body[data-ds-dark-theme][data-dsh-wallpaper=\"on\"] [class*=\"_overlayLayer\"], body[data-ds-dark-theme][data-dsh-wallpaper=\"on\"] [class*=\"_settings\"] { --dsw-alias-label-primary: var(--dsw-static-neutral-bluish-50); --dsw-alias-label-secondary: var(--dsw-static-neutral-bluish-300); --dsw-alias-label-tertiary: var(--dsw-static-neutral-bluish-400); --dsw-alias-label-caption: var(--dsw-static-neutral-bluish-600); --dsw-alias-label-dimmed: var(--dsw-static-neutral-bluish-750); --dsw-alias-label-primary-dimmed: var(--dsw-static-neutral-bluish-100); --dsw-alias-label-primary-foreground: var(--dsw-static-neutral-bluish-1000); --dsw-alias-menu-icon: var(--dsw-static-neutral-bluish-100); --dsw-alias-link: var(--dsw-static-deepseek-400); }";
		var DIALOG_CSS = "/* Dark mode + light wallpaper inside dialogs / settings: keep the light-on-dark text. */\nbody[data-ds-dark-theme][data-dsh-wallpaper=\"on\"] [role=\"dialog\"], body[data-ds-dark-theme][data-dsh-wallpaper=\"on\"] [class*=\"_dialog\"], body[data-ds-dark-theme][data-dsh-wallpaper=\"on\"] [class*=\"_modal\"], body[data-ds-dark-theme][data-dsh-wallpaper=\"on\"] [class*=\"_overlay\"], body[data-ds-dark-theme][data-dsh-wallpaper=\"on\"] [class*=\"_overlayLayer\"], body[data-ds-dark-theme][data-dsh-wallpaper=\"on\"] [class*=\"_settings\"] { color: #ffffff; --dsw-alias-label-primary: var(--dsw-static-neutral-bluish-50); --dsw-alias-label-secondary: var(--dsw-static-neutral-bluish-300); --dsw-alias-label-tertiary: var(--dsw-static-neutral-bluish-400); --dsw-alias-label-caption: var(--dsw-static-neutral-bluish-600); --dsw-alias-label-dimmed: var(--dsw-static-neutral-bluish-750); --dsw-alias-label-primary-dimmed: var(--dsw-static-neutral-bluish-100); --dsw-alias-label-primary-foreground: var(--dsw-static-neutral-bluish-1000); --dsw-alias-menu-icon: var(--dsw-static-neutral-bluish-100); --dsw-alias-link: var(--dsw-static-deepseek-400); }";
		var COMPOSER_CSS = "/* Composer text follows the wallpaper right behind it, not the whole image. */\nbody[data-dsh-wallpaper=\"on\"] [class*=\"_composer\"], body[data-dsh-wallpaper=\"on\"] [class*=\"_composerSeat\"], body[data-dsh-wallpaper=\"on\"] [class*=\"_composerStack\"][data-dsh-wp-ink=\"dark\"] { color: var(--dsw-alias-label-primary); --dsw-alias-label-primary: var(--dsw-static-neutral-bluish-1000); --dsw-alias-label-secondary: var(--dsw-static-neutral-bluish-700); --dsw-alias-label-tertiary: var(--dsw-static-neutral-bluish-600); --dsw-alias-label-caption: var(--dsw-static-neutral-bluish-400); --dsw-alias-label-dimmed: var(--dsw-static-neutral-bluish-200); --dsw-alias-label-primary-dimmed: var(--dsw-static-neutral-bluish-950); --dsw-alias-menu-icon: var(--dsw-static-neutral-bluish-800); --dsw-alias-link: var(--dsw-static-deepseek-500); }\nbody[data-dsh-wallpaper=\"on\"] [class*=\"_composer\"], body[data-dsh-wallpaper=\"on\"] [class*=\"_composerSeat\"], body[data-dsh-wallpaper=\"on\"] [class*=\"_composerStack\"][data-dsh-wp-ink=\"light\"] { color: var(--dsw-alias-label-primary); --dsw-alias-label-primary: var(--dsw-static-neutral-bluish-50); --dsw-alias-label-secondary: var(--dsw-static-neutral-bluish-300); --dsw-alias-label-tertiary: var(--dsw-static-neutral-bluish-400); --dsw-alias-label-caption: var(--dsw-static-neutral-bluish-600); --dsw-alias-label-dimmed: var(--dsw-static-neutral-bluish-750); --dsw-alias-label-primary-dimmed: var(--dsw-static-neutral-bluish-100); --dsw-alias-menu-icon: var(--dsw-static-neutral-bluish-100); --dsw-alias-link: var(--dsw-static-deepseek-400); }";
		var BUBBLE_CSS = "/* Light wallpaper + dark theme: the sent-message bubble keeps its own dark plate. */\nbody[data-ds-dark-theme][data-dsh-wallpaper=\"on\"][data-dsh-wp-ink=\"dark\"] [class*=\"_bubble\"], body[data-ds-dark-theme][data-dsh-wallpaper=\"on\"][data-dsh-wp-ink=\"dark\"] [class*=\"_userMessage\"], body[data-ds-dark-theme][data-dsh-wallpaper=\"on\"][data-dsh-wp-ink=\"dark\"] [class*=\"_messageBubble\"], body[data-ds-dark-theme][data-dsh-wallpaper=\"on\"][data-dsh-wp-ink=\"dark\"] [class*=\"_userBubble\"] { color: var(--dsw-alias-label-primary); --dsw-alias-label-primary: var(--dsw-static-neutral-bluish-50); --dsw-alias-label-secondary: var(--dsw-static-neutral-bluish-300); --dsw-alias-label-tertiary: var(--dsw-static-neutral-bluish-400); --dsw-alias-label-caption: var(--dsw-static-neutral-bluish-600); --dsw-alias-label-dimmed: var(--dsw-static-neutral-bluish-750); --dsw-alias-label-primary-dimmed: var(--dsw-static-neutral-bluish-100); --dsw-alias-label-primary-foreground: var(--dsw-static-neutral-bluish-1000); --dsw-alias-label-primary-inverted: var(--dsw-static-neutral-bluish-800); --dsw-alias-menu-icon: var(--dsw-static-neutral-bluish-100); --dsw-alias-link: var(--dsw-static-deepseek-400); }";
		var CODE_CSS = "/* Light wallpaper + dark theme: keep code blocks legible on their own dark surface. */\nbody[data-ds-dark-theme][data-dsh-wallpaper=\"on\"][data-dsh-wp-ink=\"dark\"] pre, body[data-ds-dark-theme][data-dsh-wallpaper=\"on\"][data-dsh-wp-ink=\"dark\"] code, body[data-ds-dark-theme][data-dsh-wallpaper=\"on\"][data-dsh-wp-ink=\"dark\"] [class*=\"_codeBlock\"], body[data-ds-dark-theme][data-dsh-wallpaper=\"on\"][data-dsh-wp-ink=\"dark\"] [class*=\"_markdownCode\"], body[data-ds-dark-theme][data-dsh-wallpaper=\"on\"][data-dsh-wp-ink=\"dark\"] [class*=\"_code_banner\"], body[data-ds-dark-theme][data-dsh-wallpaper=\"on\"][data-dsh-wp-ink=\"dark\"] [class*=\"_codeBanner\"] { background-color: var(--dsw-alias-markdown-code-block); --dsw-alias-label-primary: var(--dsw-static-neutral-bluish-50); --dsw-alias-label-secondary: var(--dsw-static-neutral-bluish-300); --dsw-alias-label-tertiary: var(--dsw-static-neutral-bluish-400); --dsw-alias-label-caption: var(--dsw-static-neutral-bluish-600); --dsw-alias-label-dimmed: var(--dsw-static-neutral-bluish-750); --dsw-alias-label-primary-dimmed: var(--dsw-static-neutral-bluish-100); --dsw-alias-label-primary-foreground: var(--dsw-static-neutral-bluish-1000); --dsw-alias-label-primary-inverted: var(--dsw-static-neutral-bluish-800); --dsw-alias-label-primary-bluish: var(--dsw-static-neutral-bluish-50); --dsw-alias-menu-icon: var(--dsw-static-neutral-bluish-100); --dsw-alias-link: var(--dsw-static-deepseek-400); }\nbody[data-ds-dark-theme][data-dsh-wallpaper=\"on\"][data-dsh-wp-ink=\"dark\"] pre, body[data-ds-dark-theme][data-dsh-wallpaper=\"on\"][data-dsh-wp-ink=\"dark\"] [class*=\"_codeBlock\"] { background-color: var(--dsw-alias-markdown-code-block) !important; }";
		var INK_LIGHT_CSS = "/* Dark wallpaper: switch the text tokens to their light values, in either appearance. */\nbody[data-dsh-wallpaper=\"on\"][data-dsh-wp-ink=\"light\"] { --dsw-alias-label-primary: var(--dsw-static-neutral-bluish-50); --dsw-alias-label-secondary: var(--dsw-static-neutral-bluish-300); --dsw-alias-label-tertiary: var(--dsw-static-neutral-bluish-400); --dsw-alias-label-caption: var(--dsw-static-neutral-bluish-600); --dsw-alias-label-dimmed: var(--dsw-static-neutral-bluish-750); --dsw-alias-label-primary-dimmed: var(--dsw-static-neutral-bluish-100); --dsw-alias-label-primary-foreground: var(--dsw-static-neutral-bluish-1000); --dsw-alias-label-primary-inverted: var(--dsw-static-neutral-bluish-800); --dsw-alias-label-primary-bluish: var(--dsw-static-neutral-bluish-50); --dsw-alias-label-document-preview: var(--dsw-static-neutral-bluish-200); --dsw-alias-menu-icon: var(--dsw-static-neutral-bluish-100); --dsw-alias-link: var(--dsw-static-deepseek-400); }";
		var SIDEBAR_LEFT_CSS = "body[data-dsh-wallpaper=\"on\"] [class*=\"_sidebarCol\"]{background-image:none !important;background-color:transparent !important}\n";
var SIDEBAR_CSS = "body[data-dsh-wallpaper=\"on\"] [class*=\"_rightbarCol\"]{background-image:none !important;background-color:color-mix(in srgb, var(--dsw-static-neutral-bluish-50) var(--dsh-wp-sidebar, 0%), transparent) !important}\n"
		"body[data-ds-dark-theme][data-dsh-wallpaper=\"on\"] [class*=\"_rightbarCol\"]{background-color:color-mix(in srgb, var(--dsw-static-neutral-bluish-900) var(--dsh-wp-sidebar, 0%), transparent) !important}\n";
		var PANEL_CSS = ".dsh-wp-del{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);opacity:0;transition:opacity .15s ease;padding:2px 9px;border-radius:999px;background:rgba(220,38,38,.92);color:#fff;font-size:11px;cursor:pointer;white-space:nowrap}\nbutton:hover>.dsh-wp-del,.dsh-wp-del:hover{opacity:1}\n";
		var NUMBER_CSS = "/* Wallpaper panel number box: centred digits, no native spinners. */\n.dsh-wp-panel-number { -moz-appearance: textfield; appearance: textfield; text-align: center; font-variant-numeric: tabular-nums; }\n.dsh-wp-panel-number::-webkit-outer-spin-button, .dsh-wp-panel-number::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }";
		var CODEFIX_CSS = "/* Code blocks follow the appearance, never the wallpaper. */\nbody[data-dsh-wallpaper=\"on\"]:not([data-ds-dark-theme]) pre, body[data-dsh-wallpaper=\"on\"]:not([data-ds-dark-theme]) code, body[data-dsh-wallpaper=\"on\"]:not([data-ds-dark-theme]) [class*=\"_codeBlock\"], body[data-dsh-wallpaper=\"on\"]:not([data-ds-dark-theme]) [class*=\"_markdownCode\"] { background-color: var(--dsw-static-neutral-bluish-50) !important; color: #0f1115 !important; --dsw-alias-label-primary: var(--dsw-static-neutral-bluish-1000); --dsw-alias-label-secondary: var(--dsw-static-neutral-bluish-700); --dsw-alias-label-tertiary: var(--dsw-static-neutral-bluish-600); --dsw-alias-label-caption: var(--dsw-static-neutral-bluish-400); --dsw-alias-label-dimmed: var(--dsw-static-neutral-bluish-200); --dsw-alias-menu-icon: var(--dsw-static-neutral-bluish-800); }\nbody[data-ds-dark-theme][data-dsh-wallpaper=\"on\"] pre, body[data-ds-dark-theme][data-dsh-wallpaper=\"on\"] code, body[data-ds-dark-theme][data-dsh-wallpaper=\"on\"] [class*=\"_codeBlock\"], body[data-ds-dark-theme][data-dsh-wallpaper=\"on\"] [class*=\"_markdownCode\"] { background-color: var(--dsw-static-neutral-bluish-900) !important; color: #f9fafb !important; --dsw-alias-label-primary: var(--dsw-static-neutral-bluish-50); --dsw-alias-label-secondary: var(--dsw-static-neutral-bluish-300); --dsw-alias-label-tertiary: var(--dsw-static-neutral-bluish-400); --dsw-alias-label-caption: var(--dsw-static-neutral-bluish-600); --dsw-alias-label-dimmed: var(--dsw-static-neutral-bluish-750); --dsw-alias-menu-icon: var(--dsw-static-neutral-bluish-100); }";
		var INK_CSS = "/* Light wallpaper: switch the text tokens to the light-theme values so copy stays readable. */\nbody[data-dsh-wallpaper=\"on\"][data-dsh-wp-ink=\"dark\"] { --dsw-alias-label-document-preview: var(--dsw-static-neutral-bluish-700); --dsw-alias-label-caption: var(--dsw-static-neutral-bluish-400); --dsw-alias-label-deep-diving: color-mix(in srgb, var(--dsw-static-deepseek-500) 70%, var(--dsw-static-blue-950)); --dsw-alias-label-deep-diving-shimmer: color-mix(in srgb, var(--dsw-static-deepseek-500) 30%, var(--dsw-static-blue-950)); --dsw-alias-label-dimmed: var(--dsw-static-neutral-bluish-200); --dsw-alias-label-primary-bluish: var(--dsw-static-blue-900); --dsw-alias-label-primary-dimmed: var(--dsw-static-neutral-bluish-950); --dsw-alias-label-primary-foreground: var(--dsw-static-neutral-bluish-00); --dsw-alias-label-primary-inverted: var(--dsw-static-neutral-bluish-00); --dsw-alias-label-primary: var(--dsw-static-neutral-bluish-1000); --dsw-alias-label-secondary: var(--dsw-static-neutral-bluish-700); --dsw-alias-label-shimmer: color-mix(in srgb, var(--dsw-static-neutral-1000) 30%, transparent); --dsw-alias-label-tertiary: var(--dsw-static-neutral-bluish-600); --dsw-alias-menu-icon: var(--dsw-static-neutral-bluish-800); --dsw-alias-link: var(--dsw-static-deepseek-500); }";
		/** Shared offscreen canvas for wallpaper brightness sampling. */
		/** Canvas used to sample the wallpaper behind one element. */
		var probeCanvas = null;

		/** Crossfade duration when the wallpaper rotates (ms). */
		var FADE_MS = 700;

		/** The media node currently on screen — the outgoing node stays mounted during a crossfade. */
		function currentMedia() {
			return document.querySelector("#" + LAYER_ID + " > [data-dsh-wp-current]") || document.querySelector("#" + LAYER_ID + " > img, #" + LAYER_ID + " > video");
		}

		/** Average luminance of the wallpaper showing behind one element. */
		function lumaBehind(el) {
			try {
				var media = currentMedia();
				if (media === null || el === null) return undefined;
				var rect = el.getBoundingClientRect();
				var mw = media.videoWidth || media.naturalWidth || 0;
				var mh = media.videoHeight || media.naturalHeight || 0;
				if (mw === 0 || mh === 0 || rect.width < 8 || rect.height < 8) return undefined;
				var scale = Math.max(window.innerWidth / mw, window.innerHeight / mh);
				var offX = (mw * scale - window.innerWidth) / 2;
				var offY = (mh * scale - window.innerHeight) / 2;
				var sx = Math.max(0, (rect.left + offX) / scale);
				var sy = Math.max(0, (rect.top + offY) / scale);
				var sw = Math.max(1, Math.min(mw - sx, rect.width / scale));
				var sh = Math.max(1, Math.min(mh - sy, rect.height / scale));
				if (probeCanvas === null) probeCanvas = document.createElement("canvas");
				probeCanvas.width = 16;
				probeCanvas.height = 8;
				var pctx = probeCanvas.getContext("2d", { willReadFrequently: true });
				pctx.drawImage(media, sx, sy, sw, sh, 0, 0, 16, 8);
				var data = pctx.getImageData(0, 0, 16, 8).data;
				var total = 0;
				for (var i = 0; i < data.length; i += 4) total += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
				var mean = total / (data.length / 4);
				return isFinite(mean) ? mean : undefined;
			} catch (error) {
				return undefined;
			}
		}

		/** Paint the settings surface light-on-dark, located from our own panel upwards. */
		function refreshSettingsInk() {
			try {
				var panel = document.querySelector("[data-dsh-wp-settings]");
				if (panel === null) return false;
				var root = panel;
				for (var up = 0; up < 10 && root.parentElement !== null && root.parentElement !== document.body; up += 1) root = root.parentElement;
				for (var i = 0; i < AUTO_DARK.length; i += 1) root.style.removeProperty(AUTO_DARK[i][0]);
				for (var j = 0; j < AUTO_LIGHT.length; j += 1) root.style.removeProperty(AUTO_LIGHT[j][0]);
				root.style.removeProperty("color");
				root.style.removeProperty("caret-color");
				root.removeAttribute("data-dsh-wp-ink");
				return true;
			} catch (error) {
				return false;
			}
		}
		/** Keep the composer text readable against whatever sits behind it. */
		function refreshComposerInk() {
			var seats = document.querySelectorAll('[class*="_composer"], [class*="_composerSeat"], [class*="_composerStack"]');
			var luma = undefined;
				var inkOnLight = [
					["--dsw-alias-label-primary", "var(--dsw-static-neutral-bluish-1000)"],
					["--dsw-alias-label-secondary", "var(--dsw-static-neutral-bluish-700)"],
					["--dsw-alias-label-tertiary", "var(--dsw-static-neutral-bluish-600)"],
					["--dsw-alias-label-caption", "var(--dsw-static-neutral-bluish-400)"],
					["--dsw-alias-label-dimmed", "var(--dsw-static-neutral-bluish-200)"],
					["--dsw-alias-label-primary-dimmed", "var(--dsw-static-neutral-bluish-950)"],
					["--dsw-alias-menu-icon", "var(--dsw-static-neutral-bluish-800)"],
					["--dsw-alias-link", "var(--dsw-static-deepseek-500)"],
				];
				var inkOnLightDark = [
					["--dsw-alias-label-primary", "var(--dsw-static-neutral-bluish-50)"],
					["--dsw-alias-label-secondary", "var(--dsw-static-neutral-bluish-300)"],
					["--dsw-alias-label-tertiary", "var(--dsw-static-neutral-bluish-400)"],
					["--dsw-alias-label-caption", "var(--dsw-static-neutral-bluish-600)"],
					["--dsw-alias-label-dimmed", "var(--dsw-static-neutral-bluish-750)"],
					["--dsw-alias-label-primary-dimmed", "var(--dsw-static-neutral-bluish-100)"],
					["--dsw-alias-menu-icon", "var(--dsw-static-neutral-bluish-100)"],
					["--dsw-alias-link", "var(--dsw-static-deepseek-400)"],
				];
				var inkOnDark = [
					["--dsw-alias-label-primary", "var(--dsw-static-neutral-bluish-1000)"],
					["--dsw-alias-label-secondary", "var(--dsw-static-neutral-bluish-700)"],
					["--dsw-alias-label-tertiary", "var(--dsw-static-neutral-bluish-600)"],
					["--dsw-alias-label-caption", "var(--dsw-static-neutral-bluish-400)"],
					["--dsw-alias-label-dimmed", "var(--dsw-static-neutral-bluish-200)"],
					["--dsw-alias-label-primary-dimmed", "var(--dsw-static-neutral-bluish-950)"],
					["--dsw-alias-menu-icon", "var(--dsw-static-neutral-bluish-800)"],
					["--dsw-alias-link", "var(--dsw-static-deepseek-500)"],
				];
				var inkOnDarkDark = [
					["--dsw-alias-label-primary", "var(--dsw-static-neutral-bluish-50)"],
					["--dsw-alias-label-secondary", "var(--dsw-static-neutral-bluish-300)"],
					["--dsw-alias-label-tertiary", "var(--dsw-static-neutral-bluish-400)"],
					["--dsw-alias-label-caption", "var(--dsw-static-neutral-bluish-600)"],
					["--dsw-alias-label-dimmed", "var(--dsw-static-neutral-bluish-750)"],
					["--dsw-alias-label-primary-dimmed", "var(--dsw-static-neutral-bluish-100)"],
					["--dsw-alias-menu-icon", "var(--dsw-static-neutral-bluish-100)"],
					["--dsw-alias-link", "var(--dsw-static-deepseek-400)"],
				];
			var darkAppearance = document.body.hasAttribute("data-ds-dark-theme");
			var composerStamp = (darkAppearance ? "dark" : "light") + "|" + (darkAppearance ? "#ffffff" : "#0f1115");
			if (seats.length > 0 && seats[0].dataset.dshWpComposerStamp === composerStamp) return luma;
			for (var cs0 = 0; cs0 < seats.length; cs0 += 1) seats[cs0].dataset.dshWpComposerStamp = composerStamp;
			var seatTokens = darkAppearance ? AUTO_DARK : AUTO_LIGHT;
			var seatColor = darkAppearance ? "#ffffff" : "#0f1115";
			var seatPlaceholder = darkAppearance ? "rgba(255, 255, 255, 0.72)" : "rgba(15, 17, 21, 0.55)";
			for (var i = 0; i < seats.length; i += 1) {
				var seatTargets = [seats[i]];
				var editables = seats[i].querySelectorAll('textarea, [contenteditable], [class*="_input"], input[type="text"]');
				for (var e = 0; e < editables.length; e += 1) seatTargets.push(editables[e]);
				for (var t = 0; t < seatTargets.length; t += 1) {
					for (var k = 0; k < seatTokens.length; k += 1) seatTargets[t].style.setProperty(seatTokens[k][0], seatTokens[k][1]);
					seatTargets[t].style.setProperty("--dsw-alias-label-tertiary", seatPlaceholder);
					seatTargets[t].style.setProperty("color", seatColor, "important");
					seatTargets[t].style.setProperty("caret-color", seatColor, "important");
					seatTargets[t].dataset.dshWpInk = darkAppearance ? "light" : "dark";
				}
				var seatLuma = lumaBehind(seats[i]);
				if (seatLuma !== undefined) luma = seatLuma;
			}
			return luma;
		}
		/** Luminance of an element's own surface, falling back to the wallpaper behind it. */
		function effectiveLuma(el) {
			try {
				var node = el;
				for (var up = 0; up < 12 && node !== null; up += 1) {
					var bg = getComputedStyle(node).backgroundColor;
					var match = /rgba?\(([^)]+)\)/.exec(bg);
					if (match !== null) {
						var parts = match[1].split(",").map(Number);
						var alpha = parts.length > 3 ? parts[3] : 1;
						if (alpha >= 0.5) return 0.2126 * parts[0] + 0.7152 * parts[1] + 0.0722 * parts[2];
					}
					node = node.parentElement;
				}
				return lumaBehind(el);
			} catch (error) {
				return undefined;
			}
		}

		var AUTO_LIGHT = [
			["--dsw-alias-label-primary", "var(--dsw-static-neutral-bluish-1000)"],
			["--dsw-alias-label-secondary", "var(--dsw-static-neutral-bluish-700)"],
			["--dsw-alias-label-tertiary", "var(--dsw-static-neutral-bluish-600)"],
			["--dsw-alias-label-caption", "var(--dsw-static-neutral-bluish-400)"],
			["--dsw-alias-label-dimmed", "var(--dsw-static-neutral-bluish-200)"],
			["--dsw-alias-label-primary-dimmed", "var(--dsw-static-neutral-bluish-950)"],
			["--dsw-alias-menu-icon", "var(--dsw-static-neutral-bluish-800)"],
			["--dsw-alias-link", "var(--dsw-static-deepseek-500)"],
		];
		var AUTO_DARK = [
			["--dsw-alias-label-primary", "var(--dsw-static-neutral-bluish-50)"],
			["--dsw-alias-label-secondary", "var(--dsw-static-neutral-bluish-300)"],
			["--dsw-alias-label-tertiary", "var(--dsw-static-neutral-bluish-400)"],
			["--dsw-alias-label-caption", "var(--dsw-static-neutral-bluish-600)"],
			["--dsw-alias-label-dimmed", "var(--dsw-static-neutral-bluish-750)"],
			["--dsw-alias-label-primary-dimmed", "var(--dsw-static-neutral-bluish-100)"],
			["--dsw-alias-menu-icon", "var(--dsw-static-neutral-bluish-100)"],
			["--dsw-alias-link", "var(--dsw-static-deepseek-400)"],
		];

		/** Give an element the palette its own appearance defines, ignoring the wallpaper. */
		function applyAppearanceInk(el) {
			if (el === null || el === undefined) return null;
			var dark = document.body.hasAttribute('data-ds-dark-theme');
			var set = dark ? AUTO_DARK : AUTO_LIGHT;
			for (var i = 0; i < set.length; i += 1) el.style.setProperty(set[i][0], set[i][1]);
			el.style.setProperty('color', dark ? '#f9fafb' : '#0f1115', 'important');
			return dark ? 'dark' : 'light';
		}
		/** Give one element the text palette that contrasts with whatever is behind it. */
		function applyAutoInk(el) {
			var autoInkEpoch = (document.body.dataset.dshWpInk || "") + "/" + (document.body.hasAttribute("data-ds-dark-theme") ? "dark" : "light");
			var autoInkStamp = autoInkEpoch + "|" + getComputedStyle(el).backgroundColor;
			if (el.dataset.dshWpAutoStamp === autoInkStamp) return undefined;
			el.dataset.dshWpAutoStamp = autoInkStamp;
			el.dataset.dshWpAutoEpoch = autoInkEpoch;
			var luma = effectiveLuma(el);
			if (luma === undefined) return undefined;
			var darkText = luma > 145;
			var stamp = darkText ? "dark" : "light";
			if (el.dataset.dshWpAutoInk === stamp) return luma;
			el.dataset.dshWpAutoInk = stamp;
			var set = darkText ? AUTO_LIGHT : AUTO_DARK;
			for (var i = 0; i < set.length; i += 1) el.style.setProperty(set[i][0], set[i][1]);
			el.style.setProperty("color", darkText ? "#0f1115" : "#ffffff", "important");
			el.dataset.dshWpInk = darkText ? "dark" : "light";
			return luma;
		}

		function cleanupCodeInk() {
			var nodes = document.querySelectorAll("pre, code");
			for (var i = 0; i < nodes.length && i < 400; i += 1) {
				var el = nodes[i];
				if (el.dataset.dshWpCodeClean === "1") continue;
				el.dataset.dshWpCodeClean = "1";
				for (var k = 0; k < AUTO_LIGHT.length; k += 1) { el.style.removeProperty(AUTO_LIGHT[k][0]); el.style.removeProperty(AUTO_DARK[k][0]); }
				el.style.removeProperty("color");
				el.style.removeProperty("caret-color");
				delete el.dataset.dshWpAutoInk;
				delete el.dataset.dshWpAutoStamp;
				delete el.dataset.dshWpAutoEpoch;
			}
		}
		/** Auto-contrast the surfaces that own their own background. */
		function refreshAutoInk() {
			var selectors = ['[class*="_bubble"]', '[class*="_toolbar"]'];
			var done = [];
			for (var i = 0; i < selectors.length; i += 1) {
				var nodes = document.querySelectorAll(selectors[i]);
				var minW = selectors[i] === 'code' ? 10 : 60;
				var minH = selectors[i] === 'code' ? 10 : 16;
				var maxNodes = selectors[i] === 'code' ? 800 : 60;
				for (var j = 0; j < nodes.length && j < maxNodes; j += 1) {
					if (done.indexOf(nodes[j]) >= 0) continue;
					done.push(nodes[j]);
					if (nodes[j].clientWidth < minW || nodes[j].clientHeight < minH) continue;
					applyAutoInk(nodes[j]);
				}
			}
			return done.length;
		}
		var inkCanvas = null;

		/** Average relative luminance (0-255) of whatever is drawn on the wallpaper layer. */
		function luminanceOf(node) {
			try {
				if (inkCanvas === null) inkCanvas = document.createElement("canvas");
				inkCanvas.width = 24;
				inkCanvas.height = 24;
				var ctx = inkCanvas.getContext("2d", { willReadFrequently: true });
				ctx.drawImage(node, 0, 0, 24, 24);
				var data = ctx.getImageData(0, 0, 24, 24).data;
				var total = 0;
				for (var i = 0; i < data.length; i += 4) total += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
				var mean = total / (data.length / 4);
				return isFinite(mean) ? mean : undefined;
			} catch (error) {
				return undefined;
			}
		}

		/** Classify one still as light or dark by sampling it. */
		function classifySource(src, done) {
			var probe = new Image();
			probe.crossOrigin = "anonymous";
			probe.onload = function () {
				var mean = luminanceOf(probe);
				done(mean === undefined ? undefined : (mean > 150 ? "light" : "dark"));
			};
			probe.onerror = function () { done(undefined); };
			probe.src = src;
		}
		var WINDOW_CSS = "/* Windows (Settings / dialogs) must not be see-through. */\nbody[data-dsh-wallpaper=\"on\"] [class*=\"_overlay\"],\nbody[data-dsh-wallpaper=\"on\"] [class*=\"Overlay\"],\nbody[data-dsh-wallpaper=\"on\"] [role=\"dialog\"] {\n  --dsw-alias-bg-base: color-mix(in srgb, var(--dsw-static-neutral-bluish-00) var(--dsh-wp-window, 94%), transparent) !important;\n  --dsw-alias-bg-layer-1: color-mix(in srgb, var(--dsw-static-neutral-bluish-00) var(--dsh-wp-window, 94%), transparent) !important;\n  --dsw-alias-bg-layer-2: color-mix(in srgb, var(--dsw-static-neutral-bluish-00) var(--dsh-wp-window, 94%), transparent) !important;\n  --dsw-alias-bg-layer-3: color-mix(in srgb, var(--dsw-static-neutral-bluish-00) var(--dsh-wp-window, 94%), transparent) !important;\n  --dsw-specific-sidebar-fill: color-mix(in srgb, var(--dsw-static-neutral-bluish-50) var(--dsh-wp-window, 94%), transparent) !important;\n}\nbody[data-ds-dark-theme][data-dsh-wallpaper=\"on\"] [class*=\"_overlay\"],\nbody[data-ds-dark-theme][data-dsh-wallpaper=\"on\"] [class*=\"Overlay\"],\nbody[data-ds-dark-theme][data-dsh-wallpaper=\"on\"] [role=\"dialog\"] {\n  --dsw-alias-bg-base: color-mix(in srgb, var(--dsw-static-neutral-bluish-950) var(--dsh-wp-window, 94%), transparent) !important;\n  --dsw-alias-bg-layer-1: color-mix(in srgb, var(--dsw-static-neutral-bluish-875) var(--dsh-wp-window, 94%), transparent) !important;\n  --dsw-alias-bg-layer-2: color-mix(in srgb, var(--dsw-static-neutral-bluish-850) var(--dsh-wp-window, 94%), transparent) !important;\n  --dsw-alias-bg-layer-3: color-mix(in srgb, var(--dsw-static-neutral-bluish-850) var(--dsh-wp-window, 94%), transparent) !important;\n  --dsw-specific-sidebar-fill: color-mix(in srgb, var(--dsw-static-neutral-bluish-900) var(--dsh-wp-window, 94%), transparent) !important;\n}";

		function applyVars(config) {
			var body = document.body;
			var panel = Number(config.panelOpacity);
			if (!isFinite(panel)) panel = 0.22;
			panel = Math.min(1, Math.max(0, panel));
			body.style.setProperty("--dsh-wp-panel", Math.round(panel * 100) + "%");
			body.style.setProperty("--dsh-wp-panel-strong", Math.round(Math.min(1, panel + 0.26) * 100) + "%");
			var blur = Number(config.blur);
			if (!isFinite(blur) || blur < 0) blur = 0;
			blur = Math.min(60, blur);
			body.style.setProperty("--dsh-wp-blur", blur + "px");
			body.style.setProperty("--dsh-wp-blur-scale", String(1 + blur / 150));
			if (blurControl !== null) blurControl.setValue(blur);
			var windowOpacity = Number(config.windowOpacity);
			if (!isFinite(windowOpacity)) windowOpacity = 0.94;
			body.style.setProperty("--dsh-wp-window", Math.round(Math.min(1, Math.max(0, windowOpacity)) * 100) + "%");
			var dim = Number(config.dim);
			if (!isFinite(dim)) dim = 0.45;
			body.style.setProperty("--dsh-wp-dim", String(Math.min(1, Math.max(0, dim))));
			if (typeof config.position === "string" && config.position.length > 0) body.style.setProperty("--dsh-wp-position", config.position);
		}

		var CONTROL_ID = "dsh-wp-blur-pill";
		var CONTROL_STYLE_ID = "dsh-wallpaper-control-style";
		var CONTROL_CSS = "#dsh-wp-blur-pill{position:fixed;right:16px;bottom:16px;z-index:2147483000;display:flex;align-items:center;gap:9px;padding:7px 11px;border-radius:999px;background:rgba(22,22,26,.66);border:1px solid rgba(255,255,255,.14);color:#ececf2;font:12px/1.2 -apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.28);opacity:.3;transition:opacity .18s ease;user-select:none;-webkit-user-select:none;pointer-events:auto}"
			+ "#dsh-wp-blur-pill:hover,#dsh-wp-blur-pill:focus-within{opacity:1}"
			+ "#dsh-wp-blur-pill>span.dsh-wp-blur-name{opacity:.75}"
			+ "#dsh-wp-blur-pill input{width:124px;margin:0;accent-color:#7c9cff;cursor:pointer}"
			+ "#dsh-wp-blur-pill .dsh-wp-blur-value{min-width:36px;text-align:right;font-variant-numeric:tabular-nums;opacity:.85}"
			+ "#dsh-wp-blur-pill button{all:unset;cursor:pointer;padding:0 2px;opacity:.55;font-size:13px;line-height:1}"
			+ "#dsh-wp-blur-pill button:hover{opacity:1}"
			+ "#dsh-wp-blur-pill.dsh-wp-collapsed input,#dsh-wp-blur-pill.dsh-wp-collapsed .dsh-wp-blur-value{display:none}";
		/** Layout overrides: the control lives in the sidebar, with a floating fallback. */
				var CONTROL_LAYOUT_CSS = "#dsh-wp-blur-pill{position:fixed !important;left:10px;right:auto !important;bottom:64px;top:auto !important;margin:0;display:flex;align-items:center;gap:8px;padding:3px;border-radius:999px;background:rgba(20,20,24,.55);border:1px solid rgba(255,255,255,.14);color:#ececf2;box-shadow:0 4px 14px rgba(0,0,0,.28);opacity:.55;transition:opacity .16s ease,background .16s ease,width .16s ease;box-sizing:border-box;pointer-events:auto}"
			+ "#dsh-wp-blur-pill:hover{opacity:.95}"
			+ "#dsh-wp-blur-pill.dsh-wp-expanded{width:260px;padding:2px 10px;background:rgba(20,20,24,.88);opacity:.95}"
			+ "#dsh-wp-blur-pill .dsh-wp-blur-body{display:none;align-items:center;gap:8px;flex:1 1 auto;min-width:0}"
			+ "#dsh-wp-blur-pill.dsh-wp-expanded .dsh-wp-blur-body{display:flex}"
			+ "#dsh-wp-blur-pill input[type=range]{flex:1 1 auto;width:auto;min-width:72px}"
			+ "#dsh-wp-blur-pill .dsh-wp-blur-value{min-width:34px;text-align:right;font-variant-numeric:tabular-nums;opacity:.85;font-size:12px}"
			+ "#dsh-wp-blur-pill .dsh-wp-blur-input{width:60px;flex:0 0 auto;padding:2px 4px;font-size:12px;text-align:center;border-radius:6px;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.10);color:inherit;font-variant-numeric:tabular-nums}"
			+ "#dsh-wp-blur-pill .dsh-wp-blur-input:focus{outline:none;border-color:#4f6ef7}"
			+ "#dsh-wp-blur-pill .dsh-wp-blur-input{-moz-appearance:textfield;appearance:textfield}"
			+ "#dsh-wp-blur-pill .dsh-wp-blur-input::-webkit-outer-spin-button,#dsh-wp-blur-pill .dsh-wp-blur-input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}"
			+ "#dsh-wp-blur-pill .dsh-wp-blur-step{display:inline-flex;align-items:center;gap:4px;flex:0 0 auto}"
			+ "#dsh-wp-blur-pill .dsh-wp-blur-step-btn{all:unset;cursor:pointer;width:18px;height:18px;line-height:17px;text-align:center;border-radius:6px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.22);font-size:12px;color:#ececf2}"
			+ "#dsh-wp-blur-pill .dsh-wp-blur-step-btn:hover{background:rgba(255,255,255,.24)}"
			+ "#dsh-wp-blur-pill .dsh-wp-blur-pin{flex:0 0 auto;width:24px;height:24px;padding:0;border-radius:50%;border:1px solid rgba(255,255,255,.4);background:rgba(255,255,255,.14);cursor:pointer;position:relative}"
			+ "#dsh-wp-blur-pill .dsh-wp-blur-pin::after{content:\"\";position:absolute;left:50%;top:50%;width:7px;height:7px;margin:-3.5px 0 0 -3.5px;border-radius:50%;background:rgba(255,255,255,.8)}"
			+ "#dsh-wp-blur-pill .dsh-wp-blur-pin:hover{border-color:rgba(255,255,255,.8);background:rgba(255,255,255,.24)}"
			+ "#dsh-wp-blur-pill.dsh-wp-expanded .dsh-wp-blur-pin{display:none}"
			+ "#dsh-wp-blur-pill.dsh-wp-floating{left:16px;bottom:16px;max-width:none}";

		/** The sidebar column React renders; null while the shell has not mounted it. */
		function findSidebar() {
			var candidates = document.querySelectorAll('[class*="_sidebarCol"]');
			for (var i = 0; i < candidates.length; i += 1) {
				if (candidates[i].clientWidth >= 40) return candidates[i];
			}
			return candidates.length > 0 ? candidates[0] : null;
		}

		/** Pin the bar to the sidebar column (fixed, so overflow/hidden cannot clip it). */
		/** The user avatar at the bottom of the sidebar, used to line the pin up with it. */
		var avatarCache = { at: 0, node: null };
		function findAvatar() {
			var now = Date.now();
			if (now - avatarCache.at < 1000 && avatarCache.node !== null && avatarCache.node.isConnected) return avatarCache.node;
			var host = findSidebar();
			var scope = host !== null ? host : document.body;
			var selectors = ['[class*="_avatar"]', '[class*="avatar"]', '[class*="_userCard"] img', '[class*="_user"] img', '[class*="_account"] img'];
			for (var s = 0; s < selectors.length; s += 1) {
				var nodes;
				try { nodes = scope.querySelectorAll(selectors[s]); } catch (error) { continue; }
				var best = null;
				for (var i = 0; i < nodes.length; i += 1) {
					var box = nodes[i].getBoundingClientRect();
					if (box.width < 16 || box.height < 16 || box.width > 96 || box.height > 96) continue;
					if (best === null || box.top > best.getBoundingClientRect().top) best = nodes[i];
				}
				if (best !== null) { avatarCache = { at: now, node: best }; return best; }
			}
			avatarCache = { at: now, node: null };
			return null;
		}

		function layoutControl(pill) {
			var host = findSidebar();
			if (host === null) return false;
			var rect = host.getBoundingClientRect();
			var avatar = findAvatar();
			if (avatar !== null) {
				var avatarBox = avatar.getBoundingClientRect();
				pill.style.setProperty("bottom", Math.round(window.innerHeight - avatarBox.top + 10) + "px", "important");
			}
			if (pill.classList.contains("dsh-wp-expanded")) {
				pill.style.setProperty("left", Math.round(rect.left + 10) + "px", "important");
				pill.style.setProperty("width", Math.max(140, Math.round(rect.width - 20)) + "px", "important");
			} else {
				pill.style.removeProperty("width");
				var pillSize = pill.offsetWidth > 0 ? pill.offsetWidth : 34;
				var pillLeft = rect.left + 10;
				if (avatar !== null) {
					var alignBox = avatar.getBoundingClientRect();
					pillLeft = alignBox.left + alignBox.width / 2 - pillSize / 2;
				}
				pill.style.setProperty("left", Math.round(pillLeft) + "px", "important");
			}
			return true;
		}

		/** Hide controls leaked by an earlier hot-swapped instance. */
		function settleControls(pill) {
			var nodes = document.querySelectorAll("#" + CONTROL_ID);
			for (var i = 0; i < nodes.length; i += 1) {
				if (nodes[i] === pill) nodes[i].style.removeProperty("display");
				else nodes[i].style.setProperty("display", "none", "important");
			}
		}

		/** Keep the control inside the sidebar; degrade to a floating pill without one. */
		function mountControl(pill) {
			var host = findSidebar();
			if (host === null) {
				pill.classList.add("dsh-wp-floating");
				if (pill.parentElement !== document.body) document.body.append(pill);
				return false;
			}
			pill.classList.remove("dsh-wp-floating");
			if (pill.parentElement !== host) host.append(pill);
			pill.classList.toggle("dsh-wp-compact", host.clientWidth > 0 && host.clientWidth < 168);
			layoutControl(pill);
			return true;
		}

		/** Re-attach after React re-renders or the sidebar collapses. */
		function watchControl(pill) {
			var scheduled = false;
			function reattach() {
				if (scheduled) return;
				scheduled = true;
				setTimeout(function () {
					scheduled = false;
					settleControls(pill);
					var host = findSidebar();
					if (!pill.isConnected || (host !== null && pill.parentElement !== host)) mountControl(pill);
					else if (pill.parentElement === host && host !== null) {
						pill.classList.toggle("dsh-wp-compact", host.clientWidth > 0 && host.clientWidth < 168);
						layoutControl(pill);
					}
				}, 400);
			}
			var observer = new MutationObserver(reattach);
			observer.observe(document.body, { childList: true, subtree: true });
			window.addEventListener("resize", reattach);
			return {
				disconnect: function () {
					observer.disconnect();
					window.removeEventListener("resize", reattach);
				}
			};
		}

				/** Compact DOM description used by the client report. */
		function rectOf(node) {
			var rect = node.getBoundingClientRect();
			return { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) };
		}

		function describeNode(node) {
			if (node === null || node === undefined) return null;
			var style = getComputedStyle(node);
			return {
				cls: String(node.className || "").slice(0, 56),
				tag: node.tagName ? node.tagName.toLowerCase() : "",
				rect: rectOf(node),
				display: style.display,
				position: style.position,
				overflow: style.overflow,
				flexDirection: style.flexDirection,
				visibility: style.visibility,
				opacity: style.opacity,
				zIndex: style.zIndex
			};
		}

		/** Report what actually rendered, so a missing control can be diagnosed. */
		function reportClient() {
			var payload = { section: sectionRegistered, at: Date.now() };
			try {
				payload.viewport = { w: window.innerWidth, h: window.innerHeight };
				payload.dialogs = document.querySelectorAll('[role="dialog"]').length;
				var sidebars = document.querySelectorAll('[class*="_sidebarCol"]');
				payload.sidebarNodes = sidebars.length;
				payload.sidebars = [];
				for (var i = 0; i < sidebars.length; i += 1) {
					var info = describeNode(sidebars[i]);
					info.childCount = sidebars[i].children.length;
					info.children = [];
					for (var j = 0; j < sidebars[i].children.length && j < 10; j += 1) info.children.push(describeNode(sidebars[i].children[j]));
					payload.sidebars.push(info);
				}
				var pill = document.getElementById(CONTROL_ID);
				payload.pill = describeNode(pill);
				payload.pillConnected = pill !== null && pill.isConnected;
				payload.pillParent = pill !== null && pill.parentElement !== null ? String(pill.parentElement.className || "").slice(0, 56) : null;
				payload.pinned = pill !== null && pill.classList.contains("dsh-wp-expanded");
				payload.blurVar = getComputedStyle(document.body).getPropertyValue("--dsh-wp-blur").trim();
				var media = currentMedia();
				payload.layerFilter = media !== null ? getComputedStyle(media).filter : null;
				payload.layerMedia = media !== null ? media.tagName.toLowerCase() + ":" + String(media.getAttribute("src") || "") : null;
				var layerEl = document.getElementById(LAYER_ID);
				payload.layerExists = layerEl !== null;
				payload.layerChildren = layerEl !== null ? Array.prototype.map.call(layerEl.children, function (child) { return child.tagName.toLowerCase() + "." + String(child.className || ""); }) : null;
				payload.bodyDataset = { wallpaper: document.body.dataset.dshWallpaper || null, ink: document.body.dataset.dshWpInk || null };
				payload.blurVar2 = document.body.style.getPropertyValue("--dsh-wp-blur");
				payload.ink = document.body.dataset.dshWpInk || null;
				payload.lastError = lastError;
				payload.sidebarVar = document.body.style.getPropertyValue("--dsh-wp-sidebar") || null;
				payload.rightbarProbe = (function () {
					var el = document.querySelector('[class*=rightbarCol]');
					if (el === null) return null;
					var rb = el.getBoundingClientRect();
					var rcs = getComputedStyle(el);
					return { cls: String(el.className).slice(0, 46), bg: rcs.backgroundColor, rect: Math.round(rb.width) + "x" + Math.round(rb.height) };
				})();
				payload.sidebarProbe = (function () {
					var el = document.querySelector("[class*=sidebarCol]") || document.querySelector("[class*=sidebar]");
					if (el === null) return null;
					var cs = getComputedStyle(el);
					var painted = null;
					var kids = el.querySelectorAll("*");
					for (var i = 0; i < kids.length && i < 60; i += 1) {
						var bg = getComputedStyle(kids[i]).backgroundColor;
						if (bg !== "rgba(0, 0, 0, 0)" && bg.indexOf("rgba(0, 0, 0, 0)") !== 0) { painted = { cls: String(kids[i].className).slice(0, 46), bg: bg, rect: kids[i].getBoundingClientRect().width + "x" + kids[i].getBoundingClientRect().height }; break; }
					}
					return { cls: String(el.className).slice(0, 46), bg: cs.backgroundColor, opacity: cs.opacity, token: cs.getPropertyValue("--dsw-specific-sidebar-fill").trim(), parentTag: el.parentElement === null ? null : String(el.parentElement.className).slice(0, 40), parentBg: el.parentElement === null ? null : getComputedStyle(el.parentElement).backgroundColor, paintedChild: painted };
				})();
				payload.panelVar = document.body.style.getPropertyValue("--dsh-wp-panel") || null;
				payload.sidebarFillToken = getComputedStyle(document.body).getPropertyValue("--dsw-specific-sidebar-fill").trim() || null;
				payload.codeAudit = (function () {
					var nodes = document.querySelectorAll('pre, code');
					var scanned = 0;
					var bad = [];
					for (var ci = 0; ci < nodes.length && scanned < 400; ci += 1) {
						var node = nodes[ci];
						if (node.clientWidth < 6) continue;
						var cs = getComputedStyle(node);
						var bgL = lumaOfColor(cs.backgroundColor); if (bgL === null) { var back = effectiveLuma(node); bgL = back === undefined ? null : Math.round(back); }
						if (bgL === null) continue;
						var fgL = lumaOfColor(cs.color);
						if (fgL === null) continue;
						scanned += 1;
						if (Math.abs(bgL - fgL) < 60) bad.push({ tag: node.tagName, cls: String(node.className || '').slice(0, 24), bg: cs.backgroundColor, color: cs.color, bgLuma: bgL, fgLuma: fgL, text: String(node.textContent || '').slice(0, 20), inDialog: node.closest('[role="dialog"]') !== null });
					}
					return { scanned: scanned, mismatched: bad.length, sample: bad.slice(0, 4) };
				})();
				var preProbe = [];
				function lumaOfColor(value) { var m = /rgba?\(([^)]+)\)/.exec(String(value)); if (m === null) return null; var p = m[1].split(",").map(Number); if (p.length > 3 && p[3] < 0.5) return null; return Math.round(0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2]); }
				var preNodes = document.querySelectorAll('pre');
				for (var pi = 0; pi < preNodes.length && preProbe.length < 3; pi += 1) {
					var pre = preNodes[pi];
					if (pre.clientWidth < 40) continue;
					var preCs = getComputedStyle(pre);
					var spans = pre.querySelectorAll('span');
					var spanColors = [];
					for (var si = 0; si < spans.length && spanColors.length < 5; si += 1) {
						var sc = getComputedStyle(spans[si]);
						spanColors.push({ t: String(spans[si].textContent || '').slice(0, 12), color: sc.color });
					}
					var bgL = lumaOfColor(preCs.backgroundColor);
					var fgL = lumaOfColor(preCs.color);
					preProbe.push({
						bgLuma: bgL, fgLuma: fgL, mismatch: bgL !== null && fgL !== null && Math.abs(bgL - fgL) < 60,
						bg: preCs.backgroundColor, color: preCs.color,
						inlineColor: pre.style.color || null,
						inlineToken: pre.style.getPropertyValue('--dsw-alias-label-primary') || null,
						inkAttr: pre.getAttribute('data-dsh-wp-ink'), autoAttr: pre.dataset.dshWpAutoInk || null,
						spans: spanColors
					});
				}
				payload.preProbe = preProbe;
				payload.videoFrames = {
					cached: Object.keys(videoFrameCache).length,
					sample: (function () { var keys = Object.keys(videoFrameCache); if (keys.length === 0) return null; var first = videoFrameCache[keys[0]]; return { name: keys[0], hasUrl: first.url !== null && first.url !== undefined, urlHead: first.url === null || first.url === undefined ? null : String(first.url).slice(0, 24), ink: first.ink === undefined ? null : first.ink }; })(),
					tiles: (function () { var panel = document.querySelector('[data-dsh-wp-settings]'); if (panel === null) return null; return { img: panel.querySelectorAll('img').length, video: panel.querySelectorAll('video').length }; })()
				};
				var dlgEl = document.querySelector('[role="dialog"]');
				payload.openDialog = dlgEl !== null ? {
					cls: String(dlgEl.className || dlgEl.tagName).slice(0, 34),
					rect: rectOf(dlgEl),
					color: getComputedStyle(dlgEl).color,
					token: getComputedStyle(dlgEl).getPropertyValue('--dsw-alias-label-primary').trim(),
					text: String(dlgEl.textContent || '').replace(/\s+/g, ' ').slice(0, 120),
					hasPanel: dlgEl.querySelector('[data-dsh-wp-settings]') !== null,
					nav: (function () { var out = []; var items = dlgEl.querySelectorAll('button, [role="tab"], a'); for (var i = 0; i < items.length && out.length < 12; i += 1) { var label = String(items[i].textContent || '').trim(); if (label.length === 0 || label.length > 14) continue; var cs = getComputedStyle(items[i]); out.push({ label: label, color: cs.color, token: cs.getPropertyValue('--dsw-alias-label-primary').trim() }); } return out; })()
				} : null;
				var wpPanel = document.querySelector("[data-dsh-wp-settings]");
				payload.wallpaperPanel = wpPanel !== null ? {
					color: getComputedStyle(wpPanel).color,
					token: getComputedStyle(wpPanel).getPropertyValue("--dsw-alias-label-primary").trim(),
					inlineColor: wpPanel.style.color || null,
					bg: getComputedStyle(wpPanel).backgroundColor,
					headColor: (function () { var h = wpPanel.querySelector("div"); return h === null ? null : getComputedStyle(h).color; })(),
					inputColor: (function () { var i = wpPanel.querySelector("input"); return i === null ? null : getComputedStyle(i).color; })(),
					ancestor: (function () { var n = wpPanel; for (var up = 0; up < 10 && n.parentElement !== null && n.parentElement !== document.body; up += 1) n = n.parentElement; return { cls: String(n.className || n.tagName).slice(0, 26), color: getComputedStyle(n).color, token: getComputedStyle(n).getPropertyValue("--dsw-alias-label-primary").trim() }; })()
				} : null;
				var outProbe = [];
				var outSelectors = ['[class*="_markdown"] p', '[class*="_markdown"]', '[class*="_message"] p', '[class*="_transcript"] p', 'main p'];
				for (var os = 0; os < outSelectors.length && outProbe.length < 4; os += 1) {
					var outNodes;
					try { outNodes = document.querySelectorAll(outSelectors[os]); } catch (error) { continue; }
					for (var oi = 0; oi < outNodes.length && outProbe.length < 4; oi += 1) {
						var outEl = outNodes[oi];
						var outText = String(outEl.textContent || '').trim();
						if (outText.length < 8) continue;
						var outCs = getComputedStyle(outEl);
						var outBox = outEl.getBoundingClientRect();
						var backLuma = effectiveLuma(outEl);
						outProbe.push({ cls: String(outEl.className || outEl.tagName).slice(0, 26), color: outCs.color, bg: outCs.backgroundColor, token: outCs.getPropertyValue('--dsw-alias-label-primary').trim(), backLuma: backLuma === undefined ? null : Math.round(backLuma), text: outText.slice(0, 14), rect: rectOf(outEl) });
					}
				}
				payload.outputText = outProbe;
				var inlineProbe = [];
				var needles = ['getComputedStyle', 'object-fit', 'lumaBehind', '#0f1115'];
				var allNodes = document.querySelectorAll('body *');
				for (var ni = 0; ni < allNodes.length && inlineProbe.length < 6; ni += 1) {
					var nEl = allNodes[ni];
					if (nEl.children.length > 0) continue;
					var nText = String(nEl.textContent || '');
					if (nText.length === 0 || nText.length > 40) continue;
					var hit = false;
					for (var nh = 0; nh < needles.length; nh += 1) if (nText.indexOf(needles[nh]) >= 0) hit = true;
					if (!hit) continue;
					var nCs = getComputedStyle(nEl);
					inlineProbe.push({ tag: nEl.tagName, cls: String(nEl.className || '').slice(0, 24), bg: nCs.backgroundColor, color: nCs.color, text: nText.slice(0, 18) });
				}
				payload.inlineCode = inlineProbe;
				var codeNodes = document.querySelectorAll('code');
				var codeSample = [];
				for (var cn = 0; cn < codeNodes.length && codeSample.length < 4; cn += 1) {
					var cEl = codeNodes[cn];
					if (cEl.clientWidth < 6) continue;
					codeSample.push({ cls: String(cEl.className || 'code').slice(0, 20), bg: getComputedStyle(cEl).backgroundColor, color: getComputedStyle(cEl).color, label: getComputedStyle(cEl).getPropertyValue('--dsw-alias-label-primary').trim() });
				}
				payload.codeSample = codeSample;
				var autoSample = [];
				var autoNodes = document.querySelectorAll('[role="dialog"], [class*="_settings"], [class*="_bubble"], [class*="_composer"]');
				for (var an = 0; an < autoNodes.length && autoSample.length < 5; an += 1) { var anEl = autoNodes[an]; if (anEl.clientWidth < 60) continue; var anLuma = effectiveLuma(anEl); autoSample.push({ cls: String(anEl.className || anEl.tagName).slice(0, 26), luma: anLuma === undefined ? null : Math.round(anLuma), ink: anEl.dataset.dshWpInk || null, color: getComputedStyle(anEl).color }); }
				payload.autoInk = autoSample;
				var settingsPanel = document.querySelector("[data-dsh-wp-settings]");
				var settingsRoot = settingsPanel;
				if (settingsRoot !== null) { for (var sr = 0; sr < 10 && settingsRoot.parentElement !== null && settingsRoot.parentElement !== document.body; sr += 1) settingsRoot = settingsRoot.parentElement; }
				payload.settingsRoot = settingsRoot !== null ? { cls: String(settingsRoot.className || settingsRoot.tagName).slice(0, 30), color: getComputedStyle(settingsRoot).color, inlineColor: settingsRoot.style.color || null, inlinePrimary: settingsRoot.style.getPropertyValue("--dsw-alias-label-primary") || null, inkAttr: settingsRoot.getAttribute("data-dsh-wp-ink") } : null;
				var dlg = document.querySelector('[role="dialog"], [class*="_dialog"], [class*="_settings"]');
				payload.dialogProbe = dlg !== null ? { cls: String(dlg.className || "").slice(0, 30), color: getComputedStyle(dlg).color, label: getComputedStyle(dlg).getPropertyValue("--dsw-alias-label-primary").trim(), rect: rectOf(dlg) } : null;
				var compSeat = document.querySelector('[class*="_composerSeat"], [class*="_composer"]');
				var compEditor = compSeat !== null ? compSeat.querySelector('textarea, [contenteditable], [class*="_input"]') : null;
				payload.composer = compSeat !== null ? { appearance: document.body.hasAttribute("data-ds-dark-theme") ? "dark" : "light", ink: compSeat.dataset.dshWpInk || null, luma: lumaBehind(compSeat), color: getComputedStyle(compSeat).color, editor: compEditor !== null ? String(compEditor.className || compEditor.tagName).slice(0, 26) : null, editorColor: compEditor !== null ? getComputedStyle(compEditor).color : null } : null;
				var msgProbes = [];
				var msgCandidates = document.querySelectorAll('[class*="_message"], [class*="_bubble"], [class*="_userMessage"], [class*="_msg"], [class*="_chatItem"], [data-role="user"]');
				for (var ip = 0; ip < msgCandidates.length && msgProbes.length < 8; ip += 1) {
					var el = msgCandidates[ip];
					if (el.clientWidth < 40 || el.clientHeight < 12) continue;
					var cs = getComputedStyle(el);
					msgProbes.push({ node: (String(el.className || "").slice(0, 30) || el.tagName.toLowerCase()), bg: cs.backgroundColor, color: cs.color, text: String(el.textContent || "").trim().slice(0, 14), rect: rectOf(el) });
				}
				payload.messages = msgProbes;
				payload.inkToken = getComputedStyle(document.body).getPropertyValue("--dsw-alias-label-primary").trim();
				var allPills = document.querySelectorAll("#" + CONTROL_ID);
				var shown = 0;
				for (var q = 0; q < allPills.length; q += 1) if (getComputedStyle(allPills[q]).display !== "none") shown += 1;
				payload.controls = { total: allPills.length, visible: shown };
				payload.pillRect = pill !== null ? rectOf(pill) : null;
				payload.autoCollapseTest = autoCollapseTest || window.__dshWpAutoTestResult || null;
				var avatarNode = findAvatar();
				payload.avatarRect = avatarNode !== null ? rectOf(avatarNode) : null;
				payload.avatarClass = avatarNode !== null ? String(avatarNode.className || avatarNode.tagName).slice(0, 40) : null;
				if (pill !== null) {
					var ps = getComputedStyle(pill);
					payload.pillComputed = { position: ps.position, bottom: ps.bottom, top: ps.top, left: ps.left, height: ps.height, width: ps.width, transform: ps.transform, opacity: ps.opacity, zIndex: ps.zIndex, parentPosition: pill.parentElement !== null ? getComputedStyle(pill.parentElement).position : null, parentTransform: pill.parentElement !== null ? getComputedStyle(pill.parentElement).transform : null };
					payload.scrollY = window.scrollY;
					payload.offsetParent = pill.offsetParent !== null ? String(pill.offsetParent.className || pill.offsetParent.tagName).slice(0, 40) : null;
				}
				var dialog = document.querySelector('[role="dialog"]');
				if (dialog !== null) {
					var labels = [];
					var nodes = dialog.querySelectorAll('button, [role="tab"], a, [class*="navItem"]');
					for (var k = 0; k < nodes.length && labels.length < 26; k += 1) {
						var text = String(nodes[k].textContent || "").trim().replace(/\s+/g, " ").slice(0, 16);
						if (text.length > 0) labels.push(text);
					}
					payload.dialogLabels = labels;
				}
			} catch (error) {
				payload.error = String(error && error.message ? error.message : error);
			}
			try {
				fetch(ROUTE + "/_client", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) }).catch(function () {});
			} catch (error) {}
		}

		var reloadWallpaper = null;
		var sectionRegistered = false;
		var blurControl = null;
		/** Last browser-side error, so a broken panel can be diagnosed from the host. */
		var lastError = null;
		function noteError(kind, message, source) {
			lastError = { kind: kind, message: String(message === undefined ? "" : message).slice(0, 400), source: String(source === undefined ? "" : source).slice(0, 200), at: Date.now() };
		}
		function hookConsole() {
			try {
				if (window.__dshWpConsoleHooked === true) return;
				window.__dshWpConsoleHooked = true;
				var original = console.error;
				console.error = function () {
					try {
						noteError("console.error", Array.prototype.map.call(arguments, function (item) { return item && item.message ? item.message : String(item); }).join(" "), "");
					} catch (error) {}
					return original.apply(console, arguments);
				};
			} catch (error) {}
		}
		function onWindowError(event) {
			noteError("window.error", event && event.message ? event.message : event, event && event.filename ? event.filename + ":" + event.lineno : "");
		}
		function onRejection(event) {
			var reason = event && event.reason;
			noteError("unhandledrejection", reason && reason.message ? reason.message : reason, "");
		}
				var inkCache = {};
		var autoCollapseTest = null;
		/** First frame of each video, cached as an image so reopening the panel never re-decodes. */
		var videoFrameCache = (function () {
			try {
				if (window.__dshWpVideoFrames === undefined || window.__dshWpVideoFrames === null) {
					var stored = window.sessionStorage.getItem("dsh-wp-video-frames");
					window.__dshWpVideoFrames = stored === null ? {} : JSON.parse(stored);
				}
				return window.__dshWpVideoFrames;
			} catch (error) {
				return {};
			}
		})();
		function persistVideoFrames() {
			try { window.sessionStorage.setItem("dsh-wp-video-frames", JSON.stringify(videoFrameCache)); } catch (error) {}
		}

		function rememberVideoFrame(name, video) {
			if (videoFrameCache[name] !== undefined) return;
			try {
				var width = 160;
				var height = Math.max(1, Math.round(width * (video.videoHeight || 90) / (video.videoWidth || 160)));
				var canvas = document.createElement('canvas');
				canvas.width = width;
				canvas.height = height;
				canvas.getContext('2d').drawImage(video, 0, 0, width, height);
				var mean = luminanceOf(video);
				videoFrameCache[name] = { url: canvas.toDataURL('image/jpeg', 0.62), ink: mean === undefined ? undefined : (mean > 150 ? 'light' : 'dark') };
				var cached = videoFrameCache[name];
				if (cached.ink !== undefined) rememberInk('video:' + name, cached.ink);
				persistVideoFrames();
			} catch (error) {
				videoFrameCache[name] = { url: null, error: String(error && error.message ? error.message : error), readyState: video.readyState, w: video.videoWidth, h: video.videoHeight };
				persistVideoFrames();
			}
		}
		var panelDataCache = null;
		var panelCfgCache = null;
		var inkPending = {};

		/** Format a blur value the same way the CSS variables expect it. */
		function clampBlur(value) {
			var blur = Number(value);
			if (!isFinite(blur) || blur < 0) blur = 0;
			return Math.round(Math.min(60, blur));
		}

		/** Paint one blur value onto the wallpaper layer through the CSS variables. */
		function previewBlur(value) {
			var blur = clampBlur(value);
			document.body.style.setProperty("--dsh-wp-blur", blur + "px");
			document.body.style.setProperty("--dsh-wp-blur-scale", String(1 + blur / 150));
		}

		/**
		 * Build the frosted-glass slider: drag it to blur the wallpaper live, and
		 * the value is persisted to the host once the drag settles.
		 */
		function createBlurControl() {
			var style = document.createElement("style");
			style.id = CONTROL_STYLE_ID;
			style.textContent = CONTROL_CSS + CONTROL_LAYOUT_CSS;
			document.head.append(style);

			var pill = document.createElement("div");
			pill.id = CONTROL_ID;
						pill.innerHTML = '<span class="dsh-wp-blur-body">'
				+ '<input type="range" min="0" max="60" step="1" value="0" aria-label="background blur">'
				+ '<span class="dsh-wp-blur-step">'
				+ '<button type="button" class="dsh-wp-blur-step-btn dsh-wp-blur-minus" aria-label="blur minus">-</button>'
				+ '<input type="number" class="dsh-wp-blur-input" min="0" max="60" step="1" value="0" aria-label="blur pixels">'
				+ '<button type="button" class="dsh-wp-blur-step-btn dsh-wp-blur-plus" aria-label="blur plus">+</button>'
				+ '</span>'
				+ '</span>'
				+ '<button type="button" class="dsh-wp-blur-pin" aria-label="background blur control"></button>';
			var inSidebar = mountControl(pill);
			settleControls(pill);
			var watcher = watchControl(pill);

			var input = pill.querySelector("input");
			var number = pill.querySelector(".dsh-wp-blur-input");
			var saveTimer;

			function show(blur) {
				if (input.value !== String(blur)) input.value = String(blur);
				if (number !== null && number.value !== String(blur)) number.value = String(blur);
			}

			function persist(blur) {
				try {
					fetch(ROUTE + "/state", {
						method: "POST",
						headers: { "content-type": "application/json" },
						body: JSON.stringify({ blur: blur }),
						cache: "no-store"
					}).catch(function () {});
				} catch (error) {}
			}

			function schedule(blur) {
				if (saveTimer !== undefined) clearTimeout(saveTimer);
				saveTimer = setTimeout(function () { saveTimer = undefined; persist(blur); if (typeof reportClient === "function") reportClient(); }, 350);
			}

			input.addEventListener("input", function () {
				var blur = clampBlur(input.value);
				previewBlur(blur);
				show(blur);
				schedule(blur);
			});

			var pin = pill.querySelector(".dsh-wp-blur-pin");
			var dragging = false;
			function toggleExpanded(event) {
				if (event !== undefined) event.stopPropagation();
				pill.classList.toggle("dsh-wp-expanded");
				layoutControl(pill);
				if (typeof reportClient === "function") reportClient();
			}
			pill.addEventListener("pointerdown", function (event) { dragging = event.target === input; });
			pin.addEventListener("click", toggleExpanded);
			var minusBtn = pill.querySelector(".dsh-wp-blur-minus");
			var plusBtn = pill.querySelector(".dsh-wp-blur-plus");
			function stepBlur(delta) {
				var next = clampBlur(clampBlur(input.value) + delta);
				previewBlur(next);
				show(next);
				schedule(next);
				if (typeof reportClient === "function") reportClient();
			}
			if (minusBtn !== null) minusBtn.addEventListener("click", function (event) { event.stopPropagation(); stepBlur(-1); });
			if (plusBtn !== null) plusBtn.addEventListener("click", function (event) { event.stopPropagation(); stepBlur(1); });
				/** Collapse the control as soon as the user clicks anywhere else. */
				/** One-shot self test: a pointerdown outside must really collapse the control. */
				function verifyAutoCollapseOnce() {
					if (window.__dshWpAutoTested === true) return;
					window.__dshWpAutoTested = true;
					try {
						var current = document.getElementById(CONTROL_ID);
						if (current === null) { autoCollapseTest = { collapsed: null, reason: "no control" }; return; }
						var wasExpanded = current.classList.contains("dsh-wp-expanded");
						if (!wasExpanded) current.classList.add("dsh-wp-expanded");
						var sandbox = document.createElement("div");
						sandbox.style.cssText = "position:fixed;left:0;top:0;width:1px;height:1px;opacity:0;pointer-events:none";
						document.body.append(sandbox);
						sandbox.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, cancelable: true }));
						var collapsed = !current.classList.contains("dsh-wp-expanded");
						sandbox.remove();
						if (!wasExpanded) { current.classList.remove("dsh-wp-expanded"); layoutControl(current); }
						autoCollapseTest = { collapsed: collapsed, hadExpanded: wasExpanded, listener: window.__dshWpAutoCollapse === true };
						window.__dshWpAutoTestResult = autoCollapseTest;
					} catch (error) {
						autoCollapseTest = { collapsed: false, error: String(error && error.message ? error.message : error) };
					}
				}
				function installAutoCollapse() {
					if (window.__dshWpAutoCollapse === true) return;
					window.__dshWpAutoCollapse = true;
					document.addEventListener("pointerdown", function (event) {
						var current = document.getElementById(CONTROL_ID);
						if (current === null) return;
						if (!current.classList.contains("dsh-wp-expanded")) return;
						if (current.contains(event.target) === true) return;
						current.classList.remove("dsh-wp-expanded");
						layoutControl(current);
						if (typeof reportClient === "function") reportClient();
					}, true);
					document.addEventListener("click", function (event) {
						var current = document.getElementById(CONTROL_ID);
						if (current === null) return;
						if (!current.classList.contains("dsh-wp-expanded")) return;
						if (current.contains(event.target) === true) return;
						current.classList.remove("dsh-wp-expanded");
						layoutControl(current);
						if (typeof reportClient === "function") reportClient();
					}, false);
				}
			installAutoCollapse();
			pill.addEventListener("click", function (event) {
				var wasDragging = dragging;
				dragging = false;
				if (wasDragging || event.target === pin || event.target.tagName === "INPUT") return;
				toggleExpanded(event);
			});
			
			function commitNumber() {
				var parsed = Number(number.value);
				if (!isFinite(parsed)) { show(clampBlur(input.value)); return; }
				var typed = clampBlur(parsed);
				previewBlur(typed);
				show(typed);
				schedule(typed);
			}
			number.addEventListener("input", function () {
				var parsed = Number(number.value);
				if (!isFinite(parsed) || number.value === "") return;
				var typed = clampBlur(parsed);
				previewBlur(typed);
				if (input.value !== String(typed)) input.value = String(typed);
				schedule(typed);
			});
			number.addEventListener("change", commitNumber);
			number.addEventListener("blur", function () { show(clampBlur(number.value === "" ? input.value : number.value)); });
			number.addEventListener("keydown", function (event) { if (event.key === "Enter") { commitNumber(); number.blur(); } });
			
			var initial = document.body.style.getPropertyValue("--dsh-wp-blur");
			show(clampBlur(initial.replace("px", "")));

			return {
				sidebar: inSidebar,
				verify: function () { verifyAutoCollapseOnce(); },
				setValue: show,
				apply: function (blur) { var next = clampBlur(blur); previewBlur(next); show(next); },
				destroy: function () {
					if (saveTimer !== undefined) clearTimeout(saveTimer);
					if (watcher !== null) watcher.disconnect();
					pill.remove();
					style.remove();
				}
			};
		}

		/** Pull the persisted blur from the host (the slider is the only writer). */
		/** Sidebar opacity override: null follows panelOpacity. */
		var sidebarState = null;
		function applySidebarVar() {
			var value = Number(sidebarState);
			if (sidebarState === null || !isFinite(value)) { document.body.style.removeProperty('--dsh-wp-sidebar'); return; }
			document.body.style.setProperty('--dsh-wp-sidebar', Math.round(Math.min(1, Math.max(0, value)) * 100) + '%');
		}
		function syncSidebarFromState() {
			fetch(ROUTE + '/state', { cache: 'no-store' })
				.then(function (response) { return response.ok ? response.json() : undefined; })
				.then(function (data) {
					if (!data) return;
					sidebarState = typeof data.sidebarOpacity === 'number' ? data.sidebarOpacity : null;
					applySidebarVar();
				})
				.catch(function () {});
		}

		function syncBlurFromState() {
			if (blurControl === null) return;
			fetch(ROUTE + "/state", { cache: "no-store" })
				.then(function (response) { return response.ok ? response.json() : undefined; })
				.then(function (data) {
					if (!data || blurControl === null) return;
					var blur = Number(data.blur);
					if (!isFinite(blur)) return;
					blurControl.apply(blur);
					if (typeof reportClient === "function") reportClient();
				})
				.catch(function () {});
		}

		/** Settings → 壁纸 panel: browse the library, rotate, blur. */
		var SETTINGS_STYLES = {
			wrap: { display: "flex", flexDirection: "column", gap: "18px", padding: "2px 2px 28px" },
			head: { fontSize: "15px", fontWeight: 600, marginBottom: "4px" },
			hint: { fontSize: "12px", opacity: 0.62, lineHeight: 1.6 },
			grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "10px" },
			card: { position: "relative", padding: 0, margin: 0, height: "94px", border: "1px solid rgba(127,127,127,.30)", borderRadius: "10px", overflow: "hidden", cursor: "pointer", background: "rgba(127,127,127,.08)" },
			cardActive: { border: "2px solid #4f6ef7", boxShadow: "0 0 0 3px rgba(79,110,247,.22)" },
			thumb: { display: "block", width: "100%", height: "100%", backgroundSize: "cover", backgroundPosition: "center" },
			badge: { position: "absolute", left: "6px", bottom: "6px", padding: "1px 6px", borderRadius: "999px", fontSize: "11px", background: "#4f6ef7", color: "#fff" },
			badgeDark: { position: "absolute", right: "6px", top: "6px", padding: "1px 6px", borderRadius: "999px", fontSize: "11px", background: "rgba(0,0,0,.55)", color: "#fff" },
			liveChip: { position: "absolute", left: "6px", top: "6px", padding: "1px 6px", borderRadius: "999px", fontSize: "11px", background: "rgba(0,0,0,.55)", color: "#fff", cursor: "pointer" },
			row: { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", fontSize: "13px" },
			label: { display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", cursor: "pointer" },
			number: { width: "72px", padding: "4px 6px", fontSize: "13px", textAlign: "center", fontVariantNumeric: "tabular-nums" },
			stepGroup: { display: "inline-flex", alignItems: "center", gap: "4px" },
			stepBtn: { width: "22px", height: "22px", lineHeight: "20px", padding: 0, borderRadius: "6px", border: "1px solid rgba(127,127,127,.4)", background: "rgba(127,127,127,.14)", color: "inherit", cursor: "pointer", fontSize: "13px" },
			range: { flex: "1 1 180px", maxWidth: "320px" },
			value: { minWidth: "46px", fontSize: "13px", opacity: 0.75, fontVariantNumeric: "tabular-nums" },
			pick: { position: "absolute", right: "6px", bottom: "6px", width: "20px", height: "20px", lineHeight: "19px", textAlign: "center", borderRadius: "50%", fontSize: "13px", background: "rgba(0,0,0,.5)", color: "#fff", cursor: "pointer" },
			pickOn: { position: "absolute", right: "6px", bottom: "6px", width: "20px", height: "20px", lineHeight: "19px", textAlign: "center", borderRadius: "50%", fontSize: "13px", background: "#4f6ef7", color: "#fff", cursor: "pointer" },
			button: { padding: "3px 10px", fontSize: "12px", borderRadius: "999px", border: "1px solid rgba(127,127,127,.4)", background: "rgba(127,127,127,.14)", color: "inherit", cursor: "pointer" },
			error: { fontSize: "12px", color: "#dc2626" }
		};

		/** Build the settings panel element; null when React is unavailable. */
		function wallpaperSettingsElement() {
			var React;
			try { React = require("react"); } catch (error) { return null; }
			if (React === undefined || React === null || typeof React.createElement !== "function") return null;
			var h = React.createElement;
			var S = SETTINGS_STYLES;

			function Panel() {
				var dataHook = React.useState(panelDataCache);
				var data = dataHook[0];
				var setData = dataHook[1];
				var cfgHook = React.useState(panelCfgCache);
				var cfg = cfgHook[0];
				var setCfg = cfgHook[1];
				var errHook = React.useState("");
				var error = errHook[0];
				var setError = errHook[1];
				var timer = React.useRef(null);
				function refresh() {
					fetch(ROUTE + "/list.json", { cache: "no-store" })
						.then(function (response) { if (!response.ok) noteError("panel.list", "HTTP " + response.status, ROUTE + "/list.json"); return response.ok ? response.json() : undefined; })
						.then(function (json) { if (json) { panelDataCache = json; setData(json); } })
						.catch(function (failure) { noteError("panel.list", failure && failure.message ? failure.message : failure, ROUTE + "/list.json"); });
					fetch(ROUTE + "/state", { cache: "no-store" })
						.then(function (response) { return response.ok ? response.json() : undefined; })
						.then(function (json) { if (json) { panelCfgCache = json; setCfg(json); } })
						.catch(function () {});
				}
				var panelRef = React.useRef(null);
				React.useEffect(function () { refresh(); refreshSettingsInk(); }, []);
				React.useEffect(function () { applyAppearanceInk(panelRef.current); });
				var waiting = data === null || cfg === null;
				React.useEffect(function () {
					if (!waiting) return undefined;
					var id = setInterval(refresh, 2000);
					return function () { clearInterval(id); };
				}, [waiting]);

				function save(patch) {
					setCfg(function (previous) { return Object.assign({}, previous || {}, patch); });
					fetch(ROUTE + "/state", {
						method: "POST",
						headers: { "content-type": "application/json" },
						body: JSON.stringify(patch),
						cache: "no-store"
					}).then(function (response) {
						return response.json().then(function (json) {
							if (!response.ok) throw new Error(json && json.error ? json.error : "保存失败");
							return json;
						});
					}).then(function (next) {
						panelCfgCache = next;
						if (next && typeof next.blur === "number" && blurControl !== null) blurControl.apply(next.blur);
						setCfg(next);
						setError("");
						if (reloadWallpaper !== null) reloadWallpaper();
						if (typeof next.image === "string" || next.mode !== undefined) refresh();
					}).catch(function (failure) {
						noteError("panel.save", failure && failure.message ? failure.message : failure, "");
						setError(String(failure && failure.message ? failure.message : failure));
					});
				}

				function setBlur(value) {
					var next = Math.max(0, Math.min(60, Math.round(Number(value) || 0)));
					if (blurControl !== null) blurControl.apply(next);
					saveSoon({ blur: next });
				}

				/** Sidebar transparency in percent; a null state follows panelOpacity. */
				function sidebarPercent() {
					var source = sidebarState === null ? (data.config && data.config.panelOpacity) : sidebarState;
					var value = Number(source);
					if (!isFinite(value)) value = 0.22;
					return Math.round(Math.min(1, Math.max(0, value)) * 100);
				}
				function setSidebar(percent) {
					var typed = Number(percent);
					var next = Math.round(Math.min(100, Math.max(0, isFinite(typed) ? typed : 0)));
					sidebarState = next / 100;
					applySidebarVar();
					saveSoon({ sidebarOpacity: next / 100 });
				}

				/** Pull Dynamic Wallpaper.app's playlist into the local video folder. */
				/** Remove one wallpaper from disk (and from the rotation). */
				function removeWallpaper(kind, name) {
					if (!window.confirm('删除 ' + name + ' ？' + String.fromCharCode(10) + '文件会移到「废纸篓」（可恢复），并从轮换中删除。')) return;
					fetch(ROUTE + '/delete', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ kind: kind, name: name }), cache: 'no-store' })
						.then(function (response) { return response.json().then(function (json) { if (!response.ok) throw new Error(json && json.error ? json.error : '删除失败'); return json; }); })
						.then(function (json) { setError((json && json.trashed === false ? '已永久删除 ' : '已移到废纸篓 ') + (json && json.removed ? json.removed : name)); refresh(); if (reloadWallpaper !== null) reloadWallpaper(); })
						.catch(function (failure) { noteError('panel.delete', failure && failure.message ? failure.message : failure, ''); setError(String(failure && failure.message ? failure.message : failure)); });
				}

				function syncPlaylist() {
					fetch(ROUTE + '/sync', { method: 'POST', cache: 'no-store' })
						.then(function (response) { return response.ok ? response.json() : undefined; })
						.then(function (json) {
							if (json === undefined || json.ok !== true) { setError(json && json.error ? json.error : '同步失败'); return; }
							if (json.added.length > 0) { setError('已同步 ' + json.added.length + ' 个新素材，已自动加入轮换'); refresh(); }
							else setError('播放列表已是最新（' + json.total + ' 项）');
						})
						.catch(function (failure) { noteError('panel.sync', failure && failure.message ? failure.message : failure, ''); setError('同步失败'); });
				}

				function saveSoon(patch) {
					setCfg(function (previous) { return Object.assign({}, previous || {}, patch); });
					if (timer.current !== null) clearTimeout(timer.current);
					timer.current = setTimeout(function () { timer.current = null; save(patch); }, 260);
				}

				var inkHook = React.useState(0);
				var inkVersion = inkHook[0];
				var setInkVersion = inkHook[1];

				if (data === null || cfg === null) return h("div", { style: S.hint }, "载入中…");

				var library = data.library || data.images || [];
				var liveMap = data.liveMap || {};
				function inkOf(kind, name) { return inkCache[kind + ":" + name]; }
				function rememberInk(key, value) {
					if (value === undefined || inkCache[key] === value) return;
					inkCache[key] = value;
					setInkVersion(function (n) { return n + 1; });
				}
				var inkQueue = [];
				var inkRunning = false;
				function pumpInk() {
					if (inkRunning || inkQueue.length === 0) return;
					inkRunning = true;
					var job = inkQueue.shift();
					classifySource(job.src, function (value) {
						inkRunning = false;
						delete inkPending[job.key];
						rememberInk(job.key, value);
						pumpInk();
					});
				}
				function classifyTile(kind, name, source) {
					var key = kind + ":" + name;
					if (inkCache[key] !== undefined || inkPending[key] === true) return;
					inkPending[key] = true;
					inkQueue.push({ key: key, src: source });
					pumpInk();
				}
				function inkBadge(kind, name) {
					var value = inkOf(kind, name);
					if (value === undefined) return null;
					return h("span", { style: S.badgeDark, title: value === "light" ? "浅色壁纸" : "深色壁纸" }, value === "light" ? "浅" : "深");
				}
				void inkVersion;
				function rotationKeys() {
					if (Array.isArray(cfg.rotation)) return cfg.rotation.slice();
					var derived = [];
					(data.pool || []).forEach(function (name) { derived.push("image:" + name); });
					(data.videoPool || []).forEach(function (name) { derived.push("video:" + name); });
					return derived;
				}
				function rotationOn(kind, name) { return rotationKeys().indexOf(kind + ":" + name) >= 0; }
				function toggleRotation(kind, name) {
					var keys = rotationKeys();
					var key = kind + ":" + name;
					var at = keys.indexOf(key);
					if (at >= 0) keys.splice(at, 1); else keys.push(key);
					save({ rotation: keys, mode: "rotate" });
				}
				function setRotation(keys) { save({ rotation: keys, mode: "rotate" }); }
				function darkKeys() {
					var keys = [];
					(data.library || []).forEach(function (name) { if ((data.darkPool || []).indexOf(name) >= 0) keys.push("image:" + name); });
					(data.videos || []).forEach(function (name) { if ((data.darkVideos || []).indexOf(name) >= 0) keys.push("video:" + name); });
					return keys;
				}
				function allKeys() {
					var keys = [];
					(data.library || []).forEach(function (name) { keys.push("image:" + name); });
					(data.videos || []).forEach(function (name) { keys.push("video:" + name); });
					return keys;
				}
				function lightKeys() {
					var keys = [];
					function consider(kind, name) {
						var key = kind + ':' + name;
						var measured = inkCache[key];
						var configuredDark = kind === 'image' ? (data.darkPool || []).indexOf(name) >= 0 : (data.darkVideos || []).indexOf(name) >= 0;
						var isLight = measured === 'light' ? true : (measured === 'dark' ? false : !configuredDark);
						if (isLight) keys.push(key);
					}
					(data.library || []).forEach(function (name) { consider('image', name); });
					(data.videos || []).forEach(function (name) { consider('video', name); });
					return keys;
				}
				function lightOnly() {
					var keys = lightKeys();
					if (keys.length === 0) return false;
					var current = rotationKeys();
					if (current.length !== keys.length) return false;
					return keys.every(function (key) { return current.indexOf(key) >= 0; });
				}

				function darkOnly() {
					var keys = darkKeys();
					if (keys.length === 0) return false;
					var current = rotationKeys();
					if (current.length !== keys.length) return false;
					return keys.every(function (key) { return current.indexOf(key) >= 0; });
				}
				var darkPool = data.darkPool || [];
				var rotating = cfg.mode === "rotate";
				var minutes = Math.max(1, Math.round((Number(cfg.rotateSeconds) || 600) / 60));
				var blurValue = Math.max(0, Math.min(60, Math.round(Number(cfg.blur) || 0)));
				var onlyOn = Array.isArray(cfg.only) && cfg.only.length > 0;

				return h("div", { style: S.wrap, ref: panelRef, "data-dsh-wp-settings": "on" },
					h("div", null,
						h("div", { style: S.head }, "壁纸"),
					),
					h("div", { style: S.grid }, library.map(function (name) {
						var active = name === cfg.image;
						return h("button", {
							key: name,
							type: "button",
							title: name,
							onClick: function () { save({ image: name, mode: "image" }); },
							style: active ? Object.assign({}, S.card, S.cardActive) : S.card
						},
							h("span", { style: Object.assign({}, S.thumb, { backgroundImage: "url(" + ROUTE + "/file/" + encodeURIComponent(name) + ")" }) }),
							active ? h("span", { style: S.badge }, cfg.mode === "video" ? "动态中" : "当前") : null,
							classifyTile("image", name, ROUTE + "/file/" + encodeURIComponent(name)),
inkBadge("image", name),
							h("span", { className: "dsh-wp-del", title: "移到废纸篓（可恢复）", onClick: function (event) { event.stopPropagation(); removeWallpaper("image", name); } }, "删除"),
							typeof liveMap[name] === "string" ? h("span", { style: S.liveChip, title: "用这张的动态版（视频）", onClick: function (event) { event.stopPropagation(); save({ mode: "video", video: liveMap[name], image: name }); } }, "▶ 动态") : null,
								h("span", { style: rotationOn("image", name) ? S.pickOn : S.pick, title: "加入 / 移出轮换", onClick: function (event) { event.stopPropagation(); toggleRotation("image", name); } }, rotationOn("image", name) ? "✓" : "+")
						);
					})),
					h("div", { style: S.row },
						h("span", { style: S.label }, "轮换选择"),
						h("button", { type: "button", style: S.button, onClick: function () { var keys = []; (data.library || []).forEach(function (n) { keys.push("image:" + n); }); (data.videos || []).forEach(function (n) { keys.push("video:" + n); }); setRotation(keys); } }, "全选"),
						h("button", { type: "button", style: S.button, onClick: function () { setRotation((data.darkVideos || []).map(function (n) { return "video:" + n; })); } }, "仅深色动态"),
						h("button", { type: "button", style: S.button, onClick: function () { setRotation([]); } }, "清空"),
						h("button", { type: "button", style: S.button, onClick: function () { setRotation(null); } }, "默认"),
					h("button", { type: "button", style: S.button, title: "从 Dynamic Wallpaper.app 的播放列表同步素材", onClick: function () { syncPlaylist(); } }, "同步播放列表"),
						h("span", { style: S.hint }, rotationKeys().length + " 项参与轮换")
					),
					h("div", { style: S.row },
						h("label", { style: S.label },
							h("input", { type: "checkbox", checked: rotating, onChange: function (event) { save({ mode: event.target.checked ? "rotate" : "image" }); } }),
							" 自动轮换"
						),
						h("label", { style: S.label },
							"间隔",
							h("input", {
								type: "number", min: 1, max: 1440, value: minutes, style: S.number, disabled: !rotating,
								onChange: function (event) { var value = Number(event.target.value); if (isFinite(value) && value >= 1) save({ rotateSeconds: Math.round(value) * 60 }); }
							}),
							"分钟"
						),
							h("label", { style: S.label },
								h("input", { type: "checkbox", checked: cfg.shuffle === true, onChange: function (event) { save({ shuffle: event.target.checked }); } }),
								" 随机轮换"
							),
						h("label", { style: S.label },
							h("input", { type: "checkbox", checked: darkOnly(), onChange: function (event) { setRotation(event.target.checked ? darkKeys() : allKeys()); } }),
							" 只轮换深色（" + darkKeys().length + " 项）"
						),
						h("label", { style: S.label },
							h("input", { type: "checkbox", checked: lightOnly(), onChange: function (event) { setRotation(event.target.checked ? lightKeys() : allKeys()); } }),
							" 只轮换浅色（" + lightKeys().length + " 项）"
						),
						h("label", { style: S.label },
							h("input", { type: "checkbox", checked: cfg.autoInk !== false, onChange: function (event) { save({ autoInk: event.target.checked }); } }),
							" 浅色壁纸用深色字"
						),
						h("label", { style: S.label },
							h("input", { type: "checkbox", checked: cfg.autoInclude !== false, onChange: function (event) { save({ autoInclude: event.target.checked }); } }),
							" 自动加入新壁纸" + (Array.isArray(cfg.lastAdded) && cfg.lastAdded.length > 0 ? "（最近加入 " + cfg.lastAdded.length + "）" : "")
						)
					),
					h("div", { style: S.row },
						h("span", { style: S.label }, "毛玻璃"),
						h("input", {
							type: "range", min: 0, max: 60, step: 1, value: blurValue, style: S.range,
							onChange: function (event) { setBlur(Number(event.target.value)); }
						}),
						h("span", { style: S.stepGroup },
							h("button", { type: "button", style: S.stepBtn, title: "−1", onClick: function () { setBlur(blurValue - 1); } }, "−"),
							h("input", {
								type: "number", min: 0, max: 60, step: 1, value: blurValue, className: "dsh-wp-panel-number", style: S.number,
								onChange: function (event) { var typed = Number(event.target.value); if (isFinite(typed)) setBlur(typed); }
							}),
							h("button", { type: "button", style: S.stepBtn, title: "+1", onClick: function () { setBlur(blurValue + 1); } }, "+"),
							h("span", { style: S.value }, "px")
						)
					),
			h("div", { style: S.row },
				h("span", { style: S.label }, "右侧栏透明度"),
				h("input", {
					type: "range", min: 0, max: 100, step: 1, value: sidebarPercent(), style: S.range,
					onChange: function (event) { setSidebar(Number(event.target.value)); }
				}),
				h("span", { style: S.stepGroup },
					h("button", { type: "button", style: S.stepBtn, title: "−5", onClick: function () { setSidebar(sidebarPercent() - 5); } }, "−"),
					h("input", {
						type: "number", min: 0, max: 100, step: 1, value: sidebarPercent(), className: "dsh-wp-panel-number", style: S.number,
						onChange: function (event) { setSidebar(Number(event.target.value)); }
					}),
					h("button", { type: "button", style: S.stepBtn, title: "+5", onClick: function () { setSidebar(sidebarPercent() + 5); } }, "+"),
					h("span", { style: S.value }, "%")
						)
					),
					h("div", null,
						h("div", { style: S.head }, "动态壁纸（" + (data.videos || []).length + "）"),
						h("div", { style: S.grid }, (data.videos || []).map(function (name) {
							var live = cfg.mode === "video" && cfg.video === name;
							return h("button", {
								key: name,
								type: "button",
								title: name,
								onClick: function () { save({ mode: "video", video: name }); },
								style: live ? Object.assign({}, S.card, S.cardActive) : S.card
							},
								h("img", { src: ROUTE + "/thumb/" + encodeURIComponent(name), style: Object.assign({}, S.thumb, { objectFit: "cover" }) }),
								classifyTile("video", name, ROUTE + "/thumb/" + encodeURIComponent(name)),
								live ? h("span", { style: S.badge }, "播放中") : null,
								inkBadge("video", name),
								h("span", { className: "dsh-wp-del", title: "移到废纸篓（可恢复）", onClick: function (event) { event.stopPropagation(); removeWallpaper("video", name); } }, "删除"),
								h("span", { style: rotationOn("video", name) ? S.pickOn : S.pick, title: "加入 / 移出轮换", onClick: function (event) { event.stopPropagation(); toggleRotation("video", name); } }, rotationOn("video", name) ? "✓" : "+")
							);
						}))
					),
					error !== "" ? h("div", { style: S.error }, error) : null
				);
			}

			return h(Panel);
		}

		/** Register the 壁纸 page in the client settings when the slots service is up. */
		function registerWallpaperSection(ctx) {
			var slots = typeof ctx.get === "function" ? ctx.get("slots") : undefined;
			if (slots === undefined || slots === null) slots = ctx.slots;
			if (slots === undefined || slots === null || typeof slots.register !== "function") return;
			if (wallpaperSettingsElement() === null) return;
			function register() {
				try {
					sectionRegistered = true;
					slots.register({ name: "settings.section", id: "wallpaper", order: 45, label: function () { return "壁纸"; } }, function () { return wallpaperSettingsElement(); });
				} catch (error) {}
			}
			if (typeof slots.inject === "function") {
				try { slots.inject("settings.section", register); return; } catch (error) {}
			}
			register();
		}

		function imageNode(name) {
			var img = document.createElement("img");
			img.alt = "";
			img.decoding = "async";
			img.src = ROUTE + "/file/" + encodeURIComponent(name);
			return img;
		}

		function videoNode(name) {
			var video = document.createElement("video");
			video.muted = true;
			video.autoplay = true;
			video.loop = true;
			video.setAttribute("muted", "");
			video.setAttribute("autoplay", "");
			video.setAttribute("playsinline", "");
			video.src = ROUTE + "/file/" + encodeURIComponent(name);
			video.addEventListener("canplay", function () {
				if (document.hidden) { video.dataset.dshWpWasPlaying = "1"; return; }
				var playing = video.play();
				if (playing && playing.catch) playing.catch(function () {});
			});
			return video;
		}

		var CLEAR_ATTR = "data-dsh-wp-clear";
		var sweepReport = null;
		var SKIP_SURFACE = '[role="dialog"],[role="menu"],[role="listbox"],[class*="menu"],[class*="Menu"],[class*="popover"],[class*="Popover"],[class*="modal"],[class*="Modal"],[class*="tooltip"],[class*="Tooltip"],[class*="dropdown"],[class*="Dropdown"]';

		function describe(el) {
			var cs = getComputedStyle(el);
			var cls = el.className;
			if (cls && typeof cls !== "string") cls = cls.baseVal || "";
			var rect = el.getBoundingClientRect();
			var entry = { tag: el.tagName.toLowerCase(), cls: String(cls).slice(0, 120), bg: cs.backgroundColor, z: cs.zIndex, pos: cs.position, wh: [Math.round(rect.width), Math.round(rect.height)] };
			if (el.id) entry.id = el.id;
			if (cs.backgroundImage !== "none") entry.bgi = cs.backgroundImage.slice(0, 60);
			if (cs.backdropFilter !== "none") entry.bf = cs.backdropFilter;
			return entry;
		}

		function inspectSurface(el) {
			var tag = el.tagName;
			if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SVG" || tag === "PRE" || tag === "CODE" || tag === "TEXTAREA") return;
			if (el.id === "root" || el.id === LAYER_ID) return;
			if (typeof el.closest === "function" && el.closest(SKIP_SURFACE) !== null) return;
			if (typeof el.matches === "function" && el.matches("[class*=\"_rightbarCol\"]")) { el.removeAttribute(CLEAR_ATTR); return; }
			var bg = getComputedStyle(el).backgroundColor;
			if (!bg || bg === "transparent" || /^rgba?\(0, 0, 0, 0\)$/.test(bg)) { el.removeAttribute(CLEAR_ATTR); return; }
			var rect = el.getBoundingClientRect();
			var ratio = (rect.width * rect.height) / (innerWidth * innerHeight);
			if (ratio < 0.35) { el.removeAttribute(CLEAR_ATTR); return; }
			if (!bg || bg === "transparent" || /^rgba?\(0, 0, 0, 0\)$/.test(bg)) el.removeAttribute(CLEAR_ATTR);
			else el.setAttribute(CLEAR_ATTR, "");
		}

		function clearLargeSurfaces() {
			var rootEl = document.getElementById("root");
			if (!rootEl) return;
			var stack = [[rootEl, 0]];
			while (stack.length > 0) {
				var pair = stack.pop();
				var node = pair[0];
				var depth = pair[1];
				if (depth > 8) continue;
				for (var i = 0; i < node.children.length; i += 1) {
					inspectSurface(node.children[i]);
					stack.push([node.children[i], depth + 1]);
				}
			}
		}

		function collect() {
			var points = [
				[6, 6], [Math.round(innerWidth / 2), 6], [innerWidth - 6, 6],
				[6, Math.round(innerHeight / 2)], [Math.round(innerWidth / 2), Math.round(innerHeight / 2)], [innerWidth - 6, Math.round(innerHeight / 2)],
				[6, innerHeight - 6], [Math.round(innerWidth / 2), innerHeight - 6], [innerWidth - 6, innerHeight - 6]
			];
			var stacks = [];
			for (var i = 0; i < points.length; i += 1) {
				stacks.push({ at: points[i], stack: document.elementsFromPoint(points[i][0], points[i][1]).slice(0, 14).map(describe) });
			}
			var bodyStyle = getComputedStyle(document.body);
			var layer = document.getElementById(LAYER_ID);
			var layerInfo = null;
			if (layer) {
				var lr = layer.getBoundingClientRect();
				var first = layer.querySelector("[data-dsh-wp-current]") || layer.firstElementChild;
				layerInfo = { wh: [Math.round(lr.width), Math.round(lr.height)], children: layer.children.length, firstTag: first ? first.tagName.toLowerCase() : null, firstObjectFit: first ? getComputedStyle(first).objectFit : null };
				if (first) layerInfo.firstSrc = String(first.src || first.currentSrc || "").slice(-60);
			}
			var rootEl = document.getElementById("root");
			var testHost = document.createElement("div");
			testHost.className = "Dws9Sa_overlay";
			var testPanel = document.createElement("div");
			testPanel.className = "Dws9Sa_panel";
			testHost.appendChild(testPanel);
			document.body.appendChild(testHost);
			var windowBg = getComputedStyle(testPanel).backgroundColor;
			testHost.remove();
			return {
				viewport: [innerWidth, innerHeight],
				attr: document.body.dataset.dshWallpaper || null,
				vars: { sidebar: bodyStyle.getPropertyValue("--dsh-wp-sidebar").trim(), panel: bodyStyle.getPropertyValue("--dsh-wp-panel").trim(), dim: bodyStyle.getPropertyValue("--dsh-wp-dim").trim(), blur: bodyStyle.getPropertyValue("--dsh-wp-blur").trim(), blurScale: bodyStyle.getPropertyValue("--dsh-wp-blur-scale").trim() },
				tokens: { aliasBgBase: bodyStyle.getPropertyValue("--dsw-alias-bg-base").trim(), sidebarFill: bodyStyle.getPropertyValue("--dsw-specific-sidebar-fill").trim(), layer1: bodyStyle.getPropertyValue("--dsw-alias-bg-layer-1").trim() },
				layer: layerInfo,
				windowBg: windowBg,
				windowVar: bodyStyle.getPropertyValue("--dsh-wp-window").trim(),
				rootBg: rootEl ? getComputedStyle(rootEl).backgroundColor : null,
				bodyChildren: Array.prototype.slice.call(document.body.children).map(function (el) { return el.id || el.tagName.toLowerCase(); }),
				cleared: Array.prototype.map.call(document.querySelectorAll("[" + CLEAR_ATTR + "]"), function (el) { return String(el.className).slice(0, 60); }),
				crossfade: FADE_MS,
				fading: layer !== null && layer.children.length > 2,
				sweep: sweepReport,
				points: stacks
			};
		}

		function sendProbe() {
			try {
				fetch(ROUTE + "/_probe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(collect()) }).catch(function () {});
			} catch (error) {}
		}

		function apply(ctx) {
			var staleLayer = document.getElementById(LAYER_ID);
			if (staleLayer) staleLayer.remove();
			var staleStyle = document.getElementById(STYLE_ID);
			if (staleStyle) staleStyle.remove();
			for (var stalePill = document.getElementById(CONTROL_ID); stalePill !== null; stalePill = document.getElementById(CONTROL_ID)) stalePill.remove();
			var staleControlStyle = document.getElementById(CONTROL_STYLE_ID);
			if (staleControlStyle) staleControlStyle.remove();

			var style = document.createElement("style");
			style.id = STYLE_ID;
			style.textContent = CSS + WINDOW_CSS + BLUR_CSS + SIDEBAR_LEFT_CSS + SIDEBAR_CSS + PANEL_CSS + NUMBER_CSS + INK_CSS + INK_LIGHT_CSS + CODE_CSS + CODEFIX_CSS + BUBBLE_CSS + COMPOSER_CSS + SURFACE_CSS;
			document.head.append(style);

			var layer = document.createElement("div");
			layer.id = LAYER_ID;
			layer.setAttribute("aria-hidden", "true");
			document.body.prepend(layer);
			document.body.dataset.dshWallpaper = "on";
			var scrim = document.createElement("div");
			scrim.className = "dsh-wallpaper-scrim";
			layer.append(scrim);
			var ownControl = createBlurControl();
			blurControl = ownControl;
			hookConsole();
			window.addEventListener("error", onWindowError);
			window.addEventListener("unhandledrejection", onRejection);
			registerWallpaperSection(ctx);
			setTimeout(function () {
				if (disposed) return;
				reportClient();
			}, 2500);
			setTimeout(function () { if (disposed) return; if (typeof ownControl.verify === "function") ownControl.verify(); reportClient(); }, 3200);

			var disposed = false;
			var timer;
			var surfaceTimer;
			var inkTimer;
			var autoInk = true;
			var configTimer;
			var appliedSignature;
			var pendingPaint = false;
			var paintNext = null;
			var current = null;
			var fadeTimer;

			function sweep() {
				if (disposed) return;
				try {
					clearLargeSurfaces();
					sweepReport = { ok: true, cleared: document.querySelectorAll("[" + CLEAR_ATTR + "]").length };
				} catch (error) {
					sweepReport = { ok: false, error: String(error && error.message ? error.message : error) };
				}
			}

			function refreshInk(target) {
				if (!autoInk) return;
				var node = target !== undefined && target !== null ? target : current;
				if (node === null || node === undefined || node.parentNode === null) return;
				if (node.tagName === "VIDEO" && node.readyState < 2) {
					node.addEventListener("loadeddata", function () { refreshInk(node); }, { once: true });
					return;
				}
				var mean = luminanceOf(node);
				if (mean === undefined) return;
				document.body.dataset.dshWpInk = mean > 150 ? "dark" : "light";
			}

			function scheduleInk(node) {
				setTimeout(function () { refreshInk(node); }, 250);
			setTimeout(refreshComposerInk, 400);
			setTimeout(refreshAutoInk, 600);
			}

			function nextIndex(current, total, shuffle) {
				if (total <= 1) return current;
				if (shuffle !== true) return (current + 1) % total;
				var next = current;
				while (next === current) next = Math.floor(Math.random() * total);
				return next;
			}

			/** Pause background video while the window is hidden, resume when it returns. */
			function setPlayback(paused) {
				var videos = layer.querySelectorAll("video");
				for (var i = 0; i < videos.length; i += 1) {
					var video = videos[i];
					if (paused) {
						if (!video.paused) video.dataset.dshWpWasPlaying = "1";
						video.pause();
					} else if (video.dataset.dshWpWasPlaying === "1") {
						delete video.dataset.dshWpWasPlaying;
						var playing = video.play();
						if (playing && playing.catch) playing.catch(function () {});
					}
				}
			}

			function onVisibilityChange() {
				setPlayback(document.hidden);
				if (!document.hidden && pendingPaint) {
					pendingPaint = false;
					if (typeof paintNext === "function") paintNext();
				}
			}
			/** True when the user asked the system to reduce motion — rotation then swaps without a crossfade. */
			function prefersReducedMotion() {
				try {
					return window.matchMedia("(prefers-reduced-motion: reduce)").matches === true;
				} catch (error) {
					return false;
				}
			}

			/** Retire one media node: stop its video and detach it. */
			function retire(node) {
				if (node === null || node.parentNode !== layer) return;
				if (node.tagName === "VIDEO" && !node.paused) node.pause();
				node.remove();
			}

			/**
			 * Show one wallpaper node. The outgoing node stays mounted underneath until the crossfade
			 * finishes (the scrim always stays last), so ink sampling follows [data-dsh-wp-current].
			 */
			function paint(node) {
				var previous = current;
				current = node;
				if (previous !== null && previous !== node) previous.removeAttribute("data-dsh-wp-current");
				node.setAttribute("data-dsh-wp-current", "");
				node.style.opacity = "0";
				layer.insertBefore(node, scrim);
				if (fadeTimer !== undefined) { clearTimeout(fadeTimer); fadeTimer = undefined; }
				var mounted = Array.prototype.slice.call(layer.children);
				for (var m = 0; m < mounted.length; m += 1) {
					if (mounted[m] !== scrim && mounted[m] !== node && mounted[m] !== previous) retire(mounted[m]);
				}
				var instant = previous === null || previous === node || document.hidden || prefersReducedMotion();
				if (instant) {
					node.style.opacity = "";
					if (previous !== null && previous !== node) retire(previous);
				} else {
					if (previous.tagName === "VIDEO" && !previous.paused) previous.pause();
					void node.offsetWidth;
					node.style.transition = "opacity " + FADE_MS + "ms ease-out, filter .18s ease, transform .18s ease";
					node.style.opacity = "1";
					var outgoing = previous;
					fadeTimer = setTimeout(function () {
						fadeTimer = undefined;
						node.style.transition = "";
						node.style.opacity = "";
						retire(outgoing);
					}, FADE_MS + 80);
				}
				if (document.hidden) setPlayback(true);
				scheduleInk(node);
			}

			function load() {
				return fetch(ROUTE + "/list.json", { cache: "no-store" })
				.then(function (response) { return response.ok ? response.json() : undefined; })
				.then(function (data) {
					if (disposed || !data) return;
					var config = data.config || {};
					autoInk = config.autoInk !== false;
					var signature = JSON.stringify(config) + "|" + (Array.isArray(data.images) ? data.images.length : 0) + "|" + (Array.isArray(data.videos) ? data.videos.length : 0) + "|" + (Array.isArray(data.sequence) ? data.sequence.map(function (entry) { return entry.kind.charAt(0) + entry.name; }).join(",") : "");
					if (signature === appliedSignature) return;
					appliedSignature = signature;
					paintNext = null;
					pendingPaint = false;
					if (timer !== undefined) { clearInterval(timer); timer = undefined; }
					applyVars(config);
					syncBlurFromState();
					syncSidebarFromState();
					var images = Array.isArray(data.images) ? data.images : [];
					var videos = Array.isArray(data.videos) ? data.videos : [];
					var video = typeof config.video === "string" && videos.indexOf(config.video) >= 0 ? config.video : undefined;
					var image = typeof config.image === "string" && images.indexOf(config.image) >= 0 ? config.image : images[0];
					var liveMap = data.liveMap !== null && typeof data.liveMap === "object" ? data.liveMap : {};
					function nodeFor(name) {
						var animated = config.live === true && typeof liveMap[name] === "string" && videos.indexOf(liveMap[name]) >= 0 ? liveMap[name] : undefined;
						return animated !== undefined ? videoNode(animated) : imageNode(name);
					}
					if (config.mode === "video" && video !== undefined) { paint(videoNode(video)); return; }
					var sequence = Array.isArray(data.sequence) && data.sequence.length > 0 ? data.sequence : images.map(function (name) { return { name: name, kind: "image" }; });
					function entryNode(entry) {
						return entry.kind === "video" && videos.indexOf(entry.name) >= 0 ? videoNode(entry.name) : nodeFor(entry.name);
					}
					if (config.mode === "rotate" && sequence.length > 1) {
						var seconds = Number(config.rotateSeconds);
						if (!isFinite(seconds) || seconds < 15) seconds = 600;
						var index = 0;
						for (var k = 0; k < sequence.length; k += 1) {
							if (sequence[k].name === image || sequence[k].name === video) { index = k; break; }
						}
						paint(entryNode(sequence[index]));
						paintNext = function () { paint(entryNode(sequence[index])); };
						timer = setInterval(function () {
							if (disposed) return;
							index = nextIndex(index, sequence.length, config.shuffle === true);
							if (document.hidden) { pendingPaint = true; return; }
							paint(entryNode(sequence[index]));
						}, seconds * 1000);
						return;
					}
					if (image !== undefined) { paint(nodeFor(image)); return; }
					if (video !== undefined) paint(videoNode(video));
				})
				.catch(function () {});
			}
			load();
			reloadWallpaper = load;
			configTimer = setInterval(load, 60000);

			inkTimer = setInterval(function () { var live = currentMedia(); if (live !== null && live.tagName === "VIDEO") refreshInk(live); cleanupCodeInk(); refreshAutoInk(); refreshComposerInk(); refreshSettingsInk(); }, 4000);
			surfaceTimer = setInterval(sweep, 10000);
			setTimeout(sweep, 300);
			setTimeout(function () { sweep(); sendProbe(); }, 1500);
			window.addEventListener("resize", sweep);
			document.addEventListener("visibilitychange", onVisibilityChange);
			if (document.hidden) setPlayback(true);

			function teardown() {
				disposed = true;
				if (timer !== undefined) clearInterval(timer);
				if (fadeTimer !== undefined) clearTimeout(fadeTimer);
				if (surfaceTimer !== undefined) clearInterval(surfaceTimer);
				if (configTimer !== undefined) clearInterval(configTimer);
				if (inkTimer !== undefined) clearInterval(inkTimer);
				if (reloadWallpaper === load) reloadWallpaper = null;
				window.removeEventListener("resize", sweep);
				document.removeEventListener("visibilitychange", onVisibilityChange);
				window.removeEventListener("error", onWindowError);
				window.removeEventListener("unhandledrejection", onRejection);
				if (ownControl !== null) {
					ownControl.destroy();
					if (blurControl === ownControl) blurControl = null;
				}
				if (document.getElementById(LAYER_ID) !== layer) return;
				var marked = document.querySelectorAll("[" + CLEAR_ATTR + "]");
				for (var i = 0; i < marked.length; i += 1) marked[i].removeAttribute(CLEAR_ATTR);
				var body = document.body;
				if (body.dataset.dshWallpaper !== undefined) delete body.dataset.dshWallpaper;
				if (body.dataset.dshWpInk !== undefined) delete body.dataset.dshWpInk;
				for (var j = 0; j < VAR_NAMES.length; j += 1) body.style.removeProperty(VAR_NAMES[j]);
				layer.remove();
				style.remove();
			}

			ctx.effect(function () { return teardown; });
		}

		exports.apply = apply;
		exports.inject = ["slots"];
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map
