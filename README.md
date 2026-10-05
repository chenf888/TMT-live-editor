# TMT Live Editor (Tampermonkey Userscript)

An injection-based real-time editor for The Modding Tree. Once installed in Tampermonkey, **any incremental game based on TMT 2.6.x** automatically gains the same and better real-time editing capabilities as the [The-Modify-Tree](https://github.com/473362/The-Modify-Tree), without the game author needing to build in anything.

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) in your browser.
2. Tampermonkey dashboard → New script → paste the entire contents of `tmt-live-editor.user.js` and save;
   or drag the file directly onto the Tampermonkey icon.
3. To edit a tree opened locally via `file://`: enable "Allow access to file URLs" in Tampermonkey settings.

## Usage

Open any TMT game (github.io / githack / embedded in itch / local file all work):

### Structure Editor (main feature)

Click **TMT Live ▸ → Structure Editor** in the bottom-right corner (on modified engine pages: the "Structure Editor (edit any field)" button on the tree tab,
or next to the `+` at the bottom of the layer page). A panel slides out from the right, and **any field of a layer can be edited without touching code**:

- **Scalar fields are edited directly**: text boxes to change names/descriptions/unlock conditions, etc., number boxes to change values, checkboxes to change toggles
- **Decimal fields** (such as upgrade costs): enter values like `1e9` directly
- **Function fields** (effect formulas, display text, click events…): click to show the source code, edit it, then "Save Function" and it takes effect immediately
- **tabFormat layout**: each array item has ⬆ ⬇ to reorder, ✕ to delete, and + to insert a new component after it
- **Container entries** (upgrades / milestones / challenges / clickables / buyables / achievements /
  bars / infoboxes): containers have "+ Entry" to create new ones (with reasonable default templates), fields inside each entry are edited as usual,
  and entries themselves can also be deleted with ✕
- **Any object can "+ Field"**: key name + type (text/number/boolean/Decimal/function/object/array)
- The panel is pure DOM (does not go through the game framework), so the game refreshing every frame while editing will not wipe out what you typed
- Every change is immediately written to the edit record and saved

### Click-to-edit directly in the UI

Upgrade titles/descriptions/costs/effects, milestone text, challenge names, infobox titles and body text, currency names, etc. can all be
clicked and edited directly; changes apply on blur. Function fields accept an object literal, for example
`title: "New name", description: "New description"`, allowing multiple fields to be changed at once.

### Chinese/English switching

All UI text (overlay buttons, Structure Editor, dialogs, tips/warnings) supports both Chinese and English:

- The default language follows the browser (`navigator.language`; Chinese if it starts with zh, otherwise English);
- The **EN/中文** button at the far right of the overlay switches with one click and takes effect immediately (if the Structure Editor is open, it will close first; reopen it to see the new language);
- You can also use "Switch to English / 切换到中文" in the Tampermonkey menu;
- The choice is stored in `localStorage` (key `tmtlive_lang`) and persists after refresh.

### Panel buttons

- **Add Component**: opens a dialog—select a component type from the dropdown (16 types, with Chinese descriptions); for types that need content, enter the content directly; bars/infoboxes automatically create layer definitions (IDs assigned automatically); optionally "append to end/prepend to beginning"
- **Export Edits**: copy all current edits as safe JSON, which can be shared with others
- **Export layer.js**: generate `addLayer(...)` code for all layers, ready to paste into a layer file
- **Import Edits**: paste someone else's edit JSON
- **Clear Edits**: delete all edits saved for this site (truly clears them, including preventing them from coming back after refresh)
- Edits are automatically persisted (localStorage, key `tmtlive_<modid>_mod`) and remain in effect after refreshing the page;
  the game's hard reset will not clear edits, only "Clear Edits" will.
- The Tampermonkey menu has two entries: "Show/Hide Edit Panel" and "Switch Language"; switching language also refreshes the menu text.

## Security

- **Importing never executes code**: edits are transferred as pure JSON; functions are split into two text parts, "params + function body",
  and reconstructed on import with `new Function(params, body)`—construction only compiles, it does not run; the function body only executes when the game
  actually calls it (this is the essence of a mod). Extra unknown top-level keys are ignored.
- The old exported JS source format (eval import) is still compatible, but importing it gives a clear warning and requires manual confirmation.
- Object literals entered during in-game click editing still go through eval (equivalent to the developer console; you are entering your own code).

## Compatibility

- Requires Vue 2.x + TMT structure (`layers` / `addLayer` / `modInfo` globally visible).
  If not satisfied, the script exits quietly and leaves no trace.
- **Supports both 2.6.x and 2.5.x engine lines** (including Prestige Tree Rewritten): editable fields are injected through
  "template surgery"—it reads the component templates registered by the host itself and wraps fields such as titles/descriptions/milestone text in
  `<editable>`, preserving the host's component contract as-is. If a field's structure cannot be matched, that field cannot be click-edited,
  and other functions are unaffected.
- On 2.5.x engine lines there is no funcs copy; function field editing behaves as "editing the function as text" (changes are written back to layers as strings),
  whereas on 2.6.x you can edit function source directly.
- "Add Component" is in the bottom-right panel (not at the bottom of the layer page) and works with any engine.
- If a modified engine is detected (the page already has an editable system, such as the demo in this repository), it automatically skips and does not stack injections.
- Trees with deeply modified engines, bundled/minified code, or migrated to Vue 3 are not supported.

## Troubleshooting

To see whether injection succeeded, check two places: whether there is a "TMT Live" badge in the bottom-right corner; and whether there are logs starting with `[TMT-Live]` in the F12 console
(they will state the detected engine and which components were modified). If neither exists, Tampermonkey is not running on this page
(check the script toggle and @match), or the page is not a TMT structure.

**The whole page freezes after adding a bar/infobox**: in early versions, the generated bar's `display` depended on closure variables, and the save
only stored the function source; calling it after reload threw an error—and once the game's main loop (the `ticking` flag in `setInterval`) throws, it never resets, after which every frame returns immediately and the page appears completely frozen. New versions (from 1.2.1) use only `this` to get values and automatically repair this kind of broken bar when applying edits; if an old save is already damaged beyond repair,
use **Clear Edits** in the panel and add it again.

## Build

The page code uses [`js/editable.js`](../js/editable.js) as the single source. After changing the source, run:

```bash
bash userscript/build.sh
```

During the build, `js/editable.js`, `js/editor.js`, and `userscript/src/*` are concatenated, then
[`userscript/strip-comments.js`](strip-comments.js) strips all comments (keeping the `// ==UserScript==`
metadata block). The stripper is a character-by-character lexical scan: strings, template strings (including nested `${}`), and regex literals
are copied verbatim, so `//` and `/*` inside them are not mistaken for comments; line comments preserve newlines, and block comments are restored to
spaces or newlines according to ASI rules, without changing semantics. Do not directly edit `tmt-live-editor.user.js`.