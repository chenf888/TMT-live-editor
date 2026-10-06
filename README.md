# TMT Live Editor (Tampermonkey Userscript)

An injection-based real-time editor for The Modding Tree. Once installed in Tampermonkey, **any incremental game based on TMT 2.6.x** automatically gains the same and better real-time editing capabilities as the [The-Modify-Tree](https://github.com/473362/The-Modify-Tree), without the game author needing to build in anything.

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) in your browser.
2. Tampermonkey dashboard → New script → paste the entire contents of `tmt-live-editor.js` and save;
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

### Free layout: drag everything (EVERYTHING is draggable)

Click **TMT Live ▸ → 自由布局** in the bottom-right corner (or press **Ctrl+Alt+L**, or use the
"TMT Live：自由拖拽布局" entry in the Tampermonkey menu) to enter layout mode. In that mode **anything on
the page can be picked up and dragged anywhere** — the point-generation display, text, prestige button,
resource display, milestones, clickables, buyables, upgrades, challenges, achievements, bars, infoboxes,
layer tabs, the tree, anything:

- **Drag** to move. The offset is stored and survives a refresh, a layer switch, and a hard reset;
- **Grab level** — hover highlights the element under the cursor; press **]** to grab its parent instead
  (again for grandparent), **]** / **[** to go back. So you can drag a single word, a whole upgrade
  button, or the entire layer page;
- **Shift** while dragging snaps to an 8px grid;
- **Double-click** an element to reset just that one;
- **Esc** exits layout mode (during a drag, Esc cancels the drag and puts the element back);
- **浮动 (float)** in the HUD takes the element out of the normal flow (absolute positioning) so the
  surrounding content closes up. Toggling it back restores the offset;
- The **布局记录 (layout records)** panel lists every moved element with its offset and buttons to
  float / locate / delete it, plus 全部复位 and 清空布局.

While layout mode is **on**, clicks are swallowed in the capture phase, so dragging an upgrade can't
buy it by accident. While layout mode is **off**, the script touches nothing and the game behaves
exactly as before.

How it works: offsets are applied as a CSS `transform` on the element (never by restructuring the DOM),
so Vue's patching and the engine's per-frame refresh are unaffected, and clearing the style restores the
original layout exactly. Records live in `mod.__layout`, so they are plain data that travels with
Export/Import Edits and is cleared by Clear Edits.

### Archive Manager (edit-record snapshots per tree)

Click **TMT Live ▸ → Archives** (on modified engine pages: the "存档管理" button on the tree tab).
The manager stores snapshots of the current edit record, grouped by tree (mod id):

- **Save now** takes a manual snapshot — manual archives are unlimited and can be renamed;
- **Auto archive** (toggle, on by default): one snapshot every 10 minutes, keeping at most 3 —
  the oldest auto archive is dropped when a 4th is written; manual archives never expire.
  Auto archives are skipped while the edit record is completely empty;
- Each row shows its tag (auto/manual), the save time and (for named archives) its name; rows offer
  **Load** (applies that snapshot to the current tree after a confirmation — the same safe path as
  Import Edits, never eval), **Copy** (snapshot JSON to clipboard), **Export file**
  (downloads `<tree id>_<time>.txt`), **Rename** and **Delete**;
- **Import (clipboard / file)** adds a snapshot from pasted text or a `.txt` file. The content must
  be safe-format edit JSON (validated, never eval'd). A file named `<tree id>_<time>.txt` is filed
  back under that tree automatically;
- The list **defaults to the current tree's archives** every time it opens; **Show all** lists the
  archives of every tree known to the storage, grouped by tree with the sites each was played on.
  Loading another tree's archive applies it to the current tree (unknown layers are ignored, with a
  clear confirmation first).

Where archives live: inside Tampermonkey they are stored in the script's own `GM` storage, which is
**shared across websites** — that is what makes "Show all" able to list trees from different URLs.
Without GM storage (e.g. the demo fork loading these files directly), the manager falls back to
`localStorage`, which is per-origin.

### Custom reset hotkeys + hotkey list window

Click **TMT Live ▸ → Hotkeys** (on modified engine pages: the "快捷键" button on the tree tab):

- The window lists **every hotkey of the current tree**: per layer, the tree's own hotkeys
  (key + description, marked when still locked) and one **custom reset key** row per layer;
- Click **Set key**, then press any key combo (Ctrl/Alt/Shift + key all work; Esc cancels). Pressing
  that key resets the layer — the same effect as clicking its prestige button (`canReset` still
  applies, so an unaffordable layer is not reset);
- **Custom keys bypass the tree's own hotkeys**: the listener runs in the capture phase and swallows
  the keypress before the engine's handler sees it, so if you bind a key the tree already uses, yours
  wins;
- Custom bindings are stored in `mod.__hotkeys` (plain data — travels with Export/Import Edits and
  archives, survives refresh); **Clear** removes one;
- They never fire while you are typing in inputs or click-edit fields.

### Chinese/English switching

All UI text (overlay buttons, Structure Editor, dialogs, tips/warnings) supports both Chinese and English:

- The default language follows the browser (`navigator.language`; Chinese if it starts with zh, otherwise English);
- The **EN/中文** button at the far right of the overlay switches with one click and takes effect immediately (if the Structure Editor is open, it will close first; reopen it to see the new language);
- You can also use "Switch to English / 切换到中文" in the Tampermonkey menu;
- The choice is stored in `localStorage` (key `tmtlive_lang`) and persists after refresh.

### Panel buttons

- **Add Component**: opens a dialog—select a component type from the dropdown (16 types, with Chinese descriptions); for types that need content, enter the content directly; bars/infoboxes automatically create layer definitions (IDs assigned automatically); optionally "append to end/prepend to beginning"
- **自由布局 (free layout)**: drag every element on the page anywhere; see the section above
- **Archives**: per-tree edit-record snapshots with auto/manual saves, import/export; see the section above
- **Hotkeys**: custom per-layer reset keys + a window listing all tree hotkeys; see the section above
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