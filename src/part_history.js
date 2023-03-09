let part_history = [[]];
let history_index = 0;
let last_selected_fleet = null;
let last_selected_unit = null;

function update_history() {
  let current_parts = [...designMode.unit.parts, designMode.draggingPart].filter((part) => !!part);
  let last_parts = part_history[part_history.length - 1];
  if (!arrays_equal(current_parts, last_parts)) {
    part_history.splice(history_index + 1);
    part_history.push(current_parts);
    history_index = part_history.length - 1;
  }
}

function undo() {
  if (history_index > 0) {
    history_index--;
    designMode.unit.parts = [...part_history[history_index]];
  }
}

function redo() {
  if (history_index < part_history.length - 1) {
    history_index++;
    designMode.unit.parts = [...part_history[history_index]];
  }
}

function arrays_equal(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function reset_history() {
  part_history = [[...designMode.unit.parts]];
  history_index = 0;
}

document.addEventListener("mouseup", function (e) {
  if (e.button !== 0) return;
  if (ui.mode == "design") {
    if (last_selected_fleet !== commander.fleet.selection || last_selected_unit !== buildBar.selected) {
      reset_history();
    } else {
      update_history();
    }
    last_selected_fleet = commander.fleet.selection;
    last_selected_unit = buildBar.selected;
  }
});

document.addEventListener("keydown", function (e) {
  if (ui.mode == "design") {
    if (e.ctrlKey && e.code === "KeyZ") {
      e.preventDefault();
      undo();
    } else if (e.ctrlKey && e.code === "KeyY") {
      e.preventDefault();
      redo();
    }
  }
});
