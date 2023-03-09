// here begin src/fleet.js
(function () {
  var createTab,
    insertTab,
    isEmptyFleet,
    isEmptySpec,
    isEmptyTab,
    lockScreen,
    removeTab,
    renameTab,
    tabWidth,
    uniqueTabName,
    unitButton,
    indexOf =
      [].indexOf ||
      function (item) {
        for (var i = 0, l = this.length; i < l; i++) {
          if (i in this && this[i] === item) return i;
        }
        return -1;
      },
    slice = [].slice;

  eval(onecup["import"]());

  window.getFleetKey = function (r, c, t) {
    if (t === "default") {
      t = null;
    }
    if (t != null) {
      return r + "," + c + "," + t;
    } else {
      return r + "," + c;
    }
  };

  window.getAIKey = function (r, t) {
    if (t === "default") {
      t = null;
    }
    if (t != null) {
      return r + "," + t;
    } else {
      return r;
    }
  };

  window.fromFleetKey = function (key) {
    var col, ref, row, tab;
    (ref = key.split(",")), (row = ref[0]), (col = ref[1]), (tab = ref[2]);
    if (isNaN(row) || isNaN(col)) {
      return [null, null, null];
    }
    if (tab == null) {
      tab = "default";
    }
    return [+row, +col, tab];
  };

  window.fromAIKey = function (key) {
    var ref, row, tab;
    (ref = key.split(",")), (row = ref[0]), (tab = ref[1]);
    if (isNaN(row)) {
      return [null, null];
    }
    if (tab == null) {
      tab = "default";
    }
    return [+row, tab];
  };

  isEmptySpec = function (spec) {
    if (!spec) {
      return true;
    }
    try {
      spec = JSON.parse(spec);
    } catch (error) {
      return true;
    }
    if (spec.parts == null) {
      return true;
    }
    if (spec.parts.length === 0) {
      return true;
    }
    return false;
  };

  isEmptyFleet = function (row, tab) {
    var i, j;
    if (commander.fleet.ais[getAIKey(row, tab)]) {
      return false;
    }
    for (i = j = 0; j < 10; i = ++j) {
      if (!isEmptySpec(commander.fleet[getFleetKey(row, i, tab)])) {
        return false;
      }
    }
    return true;
  };

  isEmptyTab = function (tab) {
    var c, k, r, ref, ref1, ref2, ref3, t, v;
    ref = commander.fleet.ais;
    for (k in ref) {
      v = ref[k];
      (ref1 = fromAIKey(k)), (r = ref1[0]), (t = ref1[1]);
      if (v && t === tab) {
        return false;
      }
    }
    ref2 = commander.fleet;
    for (k in ref2) {
      v = ref2[k];
      (ref3 = fromFleetKey(k)), (r = ref3[0]), (c = ref3[1]), (t = ref3[2]);
      if (t === tab && !isNaN(r) && !isEmptyFleet(r, t)) {
        return false;
      }
    }
    return true;
  };

  tabWidth = 120;

  window.FleetMode = (function () {
    function FleetMode() {}

    FleetMode.prototype.focus = [0, 0];

    FleetMode.prototype.zoom = 1;

    FleetMode.prototype.newTab = false;

    FleetMode.prototype.editTab = false;

    FleetMode.prototype.tabScrollAmount = 0;

    FleetMode.prototype.onbuildclick = function (e, index) {
      return e.preventDefault();
    };

    FleetMode.prototype.tick = function () {
      var dragger, trash;
      trash = onecup.lookup("#trash");
      if (fleetMode.draggingUnit) {
        dragger = onecup.lookup("#unit-dragger");
        if (dragger != null && trash != null) {
          dragger.style.left = control.mouse[0] - 84 / 2 + "px";
          dragger.style.top = control.mouse[1] - 84 / 2 + "px";
          if (control.mouse[0] < 100 || control.mouse[0] > window.innerWidth - 100) {
            dragger.style.backgroundColor = "rgba(255,0,0,.5)";
            trash.src = "img/ui/trashOpen@2x.png";
          } else {
            dragger.style.backgroundColor = "rgba(0,0,0,0)";
            trash.src = "img/ui/trash@2x.png";
          }
        }
      } else if (fleetMode.draggingFleet) {
        dragger = onecup.lookup("#fleet-dragger");
        if (dragger != null) {
          if (control.mouse[1] < 64 && control.mouse[0] > window.innerWidth - 100) {
            dragger.style.backgroundColor = "rgba(255,0,0,.5)";
            trash.src = "img/ui/trashOpen@2x.png";
          } else {
            dragger.style.backgroundColor = "rgba(0,0,0,0)";
            trash.src = "img/ui/trash@2x.png";
          }
        }
      } else {
        if (trash != null) {
          trash.src = "img/ui/trash@2x.png";
        }
      }
      return onecup.refresh();
    };

    FleetMode.prototype.draw = function () {
      var bg_zoom, z;
      bg_zoom = Math.max(window.innerWidth, window.innerHeight) / 128;
      z = bg_zoom * this.zoom;
      baseAtlas.beginSprites(this.focus, this.zoom);
      baseAtlas.drawSprite("img/newbg/fill.png", [-this.focus[0], -this.focus[1]], [z, z], 0, mapping.themes[0].fillColor);
      baseAtlas.drawSprite("img/newbg/gradient.png", [-this.focus[0], -this.focus[1]], [z, z], 0, mapping.themes[0].spotColor);
      return baseAtlas.finishSprites();
    };

    return FleetMode;
  })();

  window.moveFleet = function (from, to) {
    var i, j, keyF, keyT;
    for (i = j = 0; j < 10; i = ++j) {
      keyF = getFleetKey(from.row, i, from.tab);
      keyT = getFleetKey(to.row, i, to.tab);
      commander.fleet[keyT] = commander.fleet[keyF];
    }
    return (commander.fleet.ais[getAIKey(to.row, to.tab)] = commander.fleet.ais[getAIKey(from.row, from.tab)]);
  };

  window.insertFleet = function (from, to, copy) {
    var col, dir, empty, i, j, k, l, m, moving, n, ref, ref1, ref2, ref3, ref4, row, tab, v;
    if (copy == null) {
      copy = false;
    }
    if (!from.tab) {
      from.tab = "default";
    }
    if (!to.tab) {
      to.tab = "default";
    }
    if (!copy && from.row === to.row && from.tab === to.tab) {
      return;
    }
    if (isEmptyFleet(to.row, to.tab)) {
      moveFleet(from, to);
      if (!copy) {
        delete commander.fleet.ais[getAIKey(from.row, from.tab)];
        for (i = j = 0; j < 10; i = ++j) {
          commander.fleet[getFleetKey(from.row, i, from.tab)] = "";
        }
      }
    } else if (copy || from.tab !== to.tab) {
      if (from.tab === to.tab) {
        if (from.row >= to.row) {
          from.row += 1;
        }
        if (to.row >= from.row) {
          to.row += 1;
        }
      }
      empty = Math.max(from.row, to.row) + 1;
      ref = commander.fleet;
      for (k in ref) {
        v = ref[k];
        (ref1 = fromFleetKey(k)), (row = ref1[0]), (col = ref1[1]), (tab = (ref2 = ref1[2]) != null ? ref2 : null);
        if (row === null || col === null) {
          continue;
        }
        if (tab === to.tab) {
          if (!isNaN(row) && row >= empty) {
            if (isEmptyFleet(row, tab)) {
              empty = +row;
              break;
            } else {
              empty = +row + 1;
            }
          }
        }
      }
      insertFleet(
        {
          row: empty,
          tab: to.tab,
        },
        {
          row: to.row,
          tab: to.tab,
        }
      );
      insertFleet(from, to, copy);
    } else {
      dir = Math.sign(to.row - from.row);
      moving = {
        name: commander.fleet.ais[getAIKey(from.row, from.tab)],
        specs: [],
      };
      for (i = l = 0; l < 10; i = ++l) {
        moving.specs[i] = commander.fleet[getFleetKey(from.row, i, from.tab)];
      }
      for (i = m = ref3 = from.row + dir, ref4 = to.row; ref3 <= ref4 ? m <= ref4 : m >= ref4; i = ref3 <= ref4 ? ++m : --m) {
        moveFleet(
          {
            row: i,
            tab: from.tab,
          },
          {
            row: i - dir,
            tab: from.tab,
          }
        );
      }
      commander.fleet.ais[getAIKey(to.row, to.tab)] = moving.name;
      for (i = n = 0; n < 10; i = ++n) {
        commander.fleet[getFleetKey(to.row, i, to.tab)] = moving.specs[i];
      }
    }
    return control.savePlayer();
  };

  window.removeFleet = function (row, tab) {
    var c, i, j, k, lastRow, r, ref, ref1, ref2, ref3, t, v;
    if (tab == null) {
      tab = null;
    }
    lastRow = row;
    ref = commander.fleet;
    for (k in ref) {
      v = ref[k];
      (ref1 = fromFleetKey(k)), (r = ref1[0]), (c = ref1[1]), (t = ref1[2]);
      if (r === null || c === null) {
        continue;
      }
      if (tab === t) {
        if (!isNaN(r) && +r > lastRow) {
          lastRow = +r;
        }
      }
    }
    for (i = j = ref2 = row + 1, ref3 = lastRow + 1; ref2 <= ref3 ? j <= ref3 : j >= ref3; i = ref2 <= ref3 ? ++j : --j) {
      moveFleet(
        {
          row: i,
          tab: tab,
        },
        {
          row: i - 1,
          tab: tab,
        }
      );
    }
    if (commander.fleet.selection.row > row) {
      return (commander.fleet.selection.row -= 1);
    }
  };

  uniqueTabName = function (name) {
    var count, oldName;
    oldName = name;
    count = 1;
    while (indexOf.call(commander.fleet.tabs, name) >= 0) {
      name = oldName + count;
      count += 1;
    }
    return name.replace(",", "&#44;");
  };

  createTab = function (name) {
    name = uniqueTabName(name);
    if (name && indexOf.call(commander.fleet.tabs, name) < 0) {
      commander.fleet.tabs.push(name);
      fleetMode.currentTab = name;
      return account.rootSave();
    }
  };

  insertTab = function (from, to) {
    var fromIndex, tabs, toIndex;
    tabs = commander.fleet.tabs;
    fromIndex = tabs.indexOf(from);
    toIndex = tabs.indexOf(to);
    tabs.splice.apply(tabs, [toIndex, 0].concat(slice.call(tabs.splice(fromIndex, 1))));
    return account.rootSave();
  };

  removeTab = function (tab) {
    var index;
    index = commander.fleet.tabs.indexOf(tab);
    commander.fleet.tabs.splice(index, 1);
    if (index > 0) {
      index -= 1;
    }
    if (fleetMode.currentTab === tab) {
      fleetMode.currentTab = commander.fleet.tabs[index];
    }
    if (commander.fleet.selection.tab === tab) {
      commander.fleet.selection.tab = fleetMode.currentTab;
    }
    return account.rootSave();
  };

  renameTab = function (from, to) {
    var col, k, newKey, ref, ref1, ref2, ref3, row, tab, v;
    if (from === to) {
      return;
    }
    to = uniqueTabName(to);
    if (indexOf.call(commander.fleet.tabs, from) >= 0 && to && indexOf.call(commander.fleet.tabs, to) < 0) {
      ref = commander.fleet;
      for (k in ref) {
        v = ref[k];
        (ref1 = fromFleetKey(k)), (row = ref1[0]), (col = ref1[1]), (tab = ref1[2]);
        if (tab === from) {
          newKey = getFleetKey(row, col, to);
          commander.fleet[newKey] = v;
          commander.fleet[k] = "";
        }
      }
      ref2 = commander.fleet.ais;
      for (k in ref2) {
        v = ref2[k];
        (ref3 = fromAIKey(k)), (row = ref3[0]), (tab = ref3[1]);
        if (tab === from) {
          newKey = getAIKey(row, to);
          commander.fleet.ais[newKey] = v;
          delete commander.fleet.ais[k];
        }
      }
      commander.fleet.tabs[commander.fleet.tabs.indexOf(from)] = to;
      if (commander.fleet.selection.tab === from) {
        commander.fleet.selection.tab = to;
      }
      fleetMode.currentTab = to;
    }
    return account.rootSave();
  };

  window.fleetUI = function () {
    if (!commander) {
      return;
    }
    div(function () {
      position("absolute");
      top(0);
      left(0);
      color("white");
      z_index("3");
      return ui.topButton("menu");
    });
    div(".hover-black", function () {
      position("absolute");
      bottom(0);
      left(0);
      z_index("3");
      return ui.barButton("design");
    });
    div(function () {
      position("absolute");
      bottom(0);
      right(0);
      z_index("3");
      return ui.barButton("fleet");
    });
    div(function () {
      position("absolute");
      top(0);
      right(0);
      z_index("3");
      img("#trash", {
        src: "img/ui/trash.png",
        width: 64,
        height: 64,
      });
      return onmouseup(function () {
        var i, j, ref, row, tab;
        if (fleetMode.draggingUnit) {
          playSound("sounds/ui/shake.wav");
          fleetMode.draggingUnit = null;
          fleetMode.tick();
        }
        if (fleetMode.draggingFleet) {
          (ref = fleetMode.draggingFleet), (row = ref.row), (tab = ref.tab);
          if (!isEmptyFleet(row, fleetMode.currentTab)) {
            for (i = j = 0; j < 10; i = ++j) {
              commander.fleet[getFleetKey(row, i, tab)] = "";
            }
            return delete commander.fleet.ais[getAIKey(row, tab)];
          } else {
            return removeFleet(row, fleetMode.currentTab);
          }
        }
      });
    });
    div("#fleet-screen", function () {
      text_align("center");
      overflow_y("scroll");
      position("absolute");
      z_index("0");
      left(0);
      right(0);
      top(0);
      bottom(0);
      onmouseup(function () {
        if (fleetMode.draggingUnit) {
          if (control.mouse[0] < 100 || control.mouse[0] > window.innerWidth - 100) {
            fleetMode.draggingUnit = null;
            playSound("sounds/ui/shake.wav");
          } else {
            commander.fleet[fleetMode.draggingUnit.key] = fleetMode.draggingUnit.spec;
            fleetMode.draggingUnit = null;
            playSound("sounds/ui/flick.wav");
          }
        }
        if (fleetMode.draggingFleet != null) {
          playSound("sounds/ui/flick.wav");
          fleetMode.draggingFleet = null;
        }
        if (fleetMode.draggingTab != null) {
          fleetMode.draggingTab = null;
        }
        return fleetMode.tick();
      });
      div(function () {
        margin(20);
        text_align("center");
        color("white");
        return text("Drag and drop ships designs or select row for your build bar.");
      });
      div(function () {
        margin(20);
        return input(
          {
            type: "text",
            placeholder: "search for ships",
          },
          function () {
            padding(10);
            font_size(16);
            width(300);
            background_color("rgba(0,0,0,.4)");
            color("white");
            border("none");
            text_align("center");
            return oninput(function (e) {
              return (fleetMode.search = e.target.value);
            });
          }
        );
      });
      if (commander.fleet.tabs == null || commander.fleet.tabs.length === 0) {
        commander.fleet.tabs = ["default"];
      }
      if (commander.fleet.selection == null || typeof commander.fleet.selection !== "object") {
        commander.fleet.selection = {
          row: 0,
          tab: commander.fleet.tabs[0],
        };
      }
      if (fleetMode.currentTab == null) {
        fleetMode.currentTab = commander.fleet.selection.tab;
      }
      div("#fleet-tabs", function () {
        var maxScroll;
        position("sticky");
        width(910);
        height(35);
        top(0);
        margin("0 auto");
        color("white");
        line_height(35);
        text_align("center");
        z_index("1");
        maxScroll = commander.fleet.tabs.length * tabWidth + fleetMode.newTab * tabWidth + 35 * 3 - 840;
        fleetMode.tabScrollAmount = Math.max(Math.min(fleetMode.tabScrollAmount, maxScroll), 0);
        div(".hover-white-dark", function () {
          position("absolute");
          left(0);
          width(35);
          height(35);
          if (isEmptyTab(fleetMode.currentTab)) {
            text("×");
            background_color("rgba(255,0,0,.6)");
            return onclick(function () {
              removeTab(fleetMode.currentTab);
              return account.rootSave();
            });
          } else {
            text("…");
            return onclick(function () {
              var editTab;
              if (fleetMode.editTab) {
                editTab = lookup("#edit-tab");
                if (editTab != null) {
                  renameTab(fleetMode.editTab, editTab.value);
                }
                return (fleetMode.editTab = null);
              } else {
                fleetMode.editTab = fleetMode.currentTab;
                return onecup.later(100, function () {
                  editTab = lookup("#edit-tab");
                  if (editTab != null) {
                    editTab.focus();
                  }
                  return editTab != null ? editTab.select() : void 0;
                });
              }
            });
          }
        });
        if (maxScroll > 0) {
          div(".hover-white-dark", function () {
            position("absolute");
            left(35);
            width(35);
            height(35);
            text("◀");
            return onclick(function () {
              return (fleetMode.tabScrollAmount -= 40);
            });
          });
        }
        div("#tab-scroll", function () {
          var j, len, ref, tab, tabIndex, x;
          position("absolute");
          overflow("hidden");
          height(35);
          if (maxScroll > 0) {
            left(70);
            width(770);
          } else {
            left(35);
            width(840);
          }
          onwheel(function (e) {
            fleetMode.tabScrollAmount += e.deltaY;
            return e.preventDefault();
          });
          x = -fleetMode.tabScrollAmount;
          ref = commander.fleet.tabs;
          for (tabIndex = j = 0, len = ref.length; j < len; tabIndex = ++j) {
            tab = ref[tabIndex];
            if (fleetMode.editTab === tab) {
              input(
                "#edit-tab",
                {
                  type: "text",
                  placeholder: "rename",
                  value: tab,
                },
                function () {
                  position("absolute");
                  left(x);
                  x += tabWidth;
                  height(35);
                  width(tabWidth);
                  color("white");
                  border("none");
                  padding("0 10px");
                  font_size(16);
                  font_family("Arial", "Helvetica", "sans-serif");
                  text_align("center");
                  background_color("rgba(0,0,0,.6)");
                  onkeypress(function (e) {
                    if (e.key === "Enter") {
                      return e.target.blur();
                    }
                  });
                  return onblur(function (e) {
                    var name;
                    name = e.target.value;
                    renameTab(fleetMode.editTab, name);
                    return (fleetMode.editTab = null);
                  });
                }
              );
              continue;
            }
            div(".hover-white-dark", function () {
              position("absolute");
              left(x);
              x += tabWidth;
              height(35);
              width(tabWidth);
              display("block");
              overflow("hidden");
              text_overflow("ellipsis");
              white_space("nowrap");
              text(tab);
              if (tab === fleetMode.currentTab) {
                background_color("rgba(255,255,255,.5)");
              }
              return (function (tab, tabIndex) {
                var switchTab;
                switchTab = function () {
                  return (fleetMode.currentTab = tab);
                };
                onmousedown(function (e) {
                  if (e.buttons === 1 && !(fleetMode.draggingTab != null || fleetMode.draggingUnit != null || fleetMode.draggingFleet != null)) {
                    fleetMode.draggingTab = {
                      tab: tab,
                      offset: control.mouse[0] - (35 + tabWidth * tabIndex - fleetMode.tabScrollAmount + (maxScroll > 0) * 35),
                    };
                    return switchTab();
                  }
                });
                onmouseup(function (e) {
                  if (fleetMode.draggingTab != null && fleetMode.draggingTab.tab !== tab) {
                    insertTab(fleetMode.draggingTab.tab, tab);
                  }
                  return (fleetMode.draggingTab = null);
                });
                onmouseover(function (e) {
                  if (fleetMode.draggingUnit || fleetMode.draggingFleet) {
                    return switchTab();
                  }
                });
                return ondblclick(function (e) {
                  fleetMode.editTab = fleetMode.currentTab;
                  return onecup.later(100, function () {
                    var editTab;
                    editTab = lookup("#edit-tab");
                    if (editTab != null) {
                      editTab.focus();
                    }
                    return editTab != null ? editTab.select() : void 0;
                  });
                });
              })(tab, tabIndex);
            });
          }
          if (fleetMode.newTab) {
            input(
              "#new-tab",
              {
                type: "text",
                placeholder: "new tab",
              },
              function () {
                position("absolute");
                left(x);
                x += tabWidth;
                height(35);
                width(tabWidth);
                color("white");
                border("none");
                padding("0 10px");
                width(tabWidth);
                font_size(16);
                line_height(35);
                text_align("center");
                overflow("hidden");
                background_color("rgba(0,0,0,.6)");
                onkeypress(function (e) {
                  if (e.key === "Enter") {
                    return e.target.blur();
                  }
                });
                return onblur(function (e) {
                  var name;
                  name = e.target.value;
                  createTab(name);
                  return (fleetMode.newTab = false);
                });
              }
            );
          }
          return div(".hover-white-dark", function () {
            position("absolute");
            left(x);
            height(35);
            width(35);
            overflow("hidden");
            text("+");
            return onclick(function () {
              var name;
              if (fleetMode.newTab) {
                name = lookup("#new-tab").value;
                createTab(name);
                return (fleetMode.newTab = false);
              } else if (fleetMode.editTab) {
                name = lookup("#edit-tab").value;
                renameTab(fleetMode.editTab, name);
                return (fleetMode.editTab = null);
              } else {
                fleetMode.newTab = true;
                return onecup.later(100, function () {
                  var ref1;
                  fleetMode.tabScrollAmount = maxScroll + tabWidth;
                  return (ref1 = lookup("#new-tab")) != null ? ref1.focus() : void 0;
                });
              }
            });
          });
        });
        if (maxScroll > 0) {
          div(".hover-white-dark", function () {
            position("absolute");
            right(35);
            height(35);
            width(35);
            text("▶");
            return onclick(function () {
              return (fleetMode.tabScrollAmount += 40);
            });
          });
        }
        if (fleetMode.draggingTab) {
          return div("#tab-dragger", function () {
            var ref;
            position("absolute");
            width(tabWidth);
            overflow("hidden");
            text_overflow("ellipsis");
            white_space("nowrap");
            text_align("center");
            text((ref = fleetMode.draggingTab) != null ? ref.tab : void 0);
            top(0);
            left(control.mouse[0] - fleetMode.draggingTab.offset);
            z_index("1");
            pointer_events("none");
            return background_color("rgba(0,0,0,.5)");
          });
        }
      });
      return div("#fleet", function () {
        var c, j, k, nrows, r, ref, ref1, ref2, results, row, t, v;
        nrows = 6;
        ref = commander.fleet;
        for (k in ref) {
          v = ref[k];
          (ref1 = fromFleetKey(k)), (r = ref1[0]), (c = ref1[1]), (t = ref1[2]);
          if (v && t === fleetMode.currentTab) {
            r = parseInt(r);
            if (r + 4 > nrows) {
              nrows = r + 4;
            }
          }
        }
        results = [];
        for (row = j = 0, ref2 = nrows; 0 <= ref2 ? j < ref2 : j > ref2; row = 0 <= ref2 ? ++j : --j) {
          results.push(
            (function (row) {
              return div(function () {
                width("100%");
                margin(0);
                padding(0);
                border("none");
                onmousemove(function (e) {
                  if (e.buttons === 1) {
                    return (fleetMode.fleetDragover = row);
                  } else if (e.buttons === 0) {
                    if (fleetMode.draggingUnit) {
                      commander.fleet[fleetMode.draggingUnit.key] = fleetMode.draggingUnit.spec;
                      fleetMode.draggingUnit = null;
                    }
                    return (fleetMode.draggingFleet = null);
                  }
                });
                onmouseout(function (e) {
                  return (fleetMode.fleetDragover = -1);
                });
                onmouseup(function (e) {
                  if (e.which === 1) {
                    if (fleetMode.draggingFleet != null && (fleetMode.draggingFleet.copy || fleetMode.draggingFleet.row !== row || fleetMode.draggingFleet.tab !== fleetMode.currentTab)) {
                      insertFleet(
                        fleetMode.draggingFleet,
                        {
                          row: row,
                          tab: fleetMode.currentTab,
                        },
                        fleetMode.draggingFleet.copy
                      );
                      fleetMode.draggingFleet = null;
                      return playSound("sounds/ui/flick.wav");
                    }
                  }
                });
                return div(function () {
                  var col, fleetAis, l;
                  position("relative");
                  height(84);
                  width(840);
                  margin("0px auto");
                  if (commander.fleet.selection.row === row && commander.fleet.selection.tab === fleetMode.currentTab) {
                    background_color("rgba(255,255,255,.2)");
                  }
                  if (fleetMode.fleetDragover === row && fleetMode.draggingFleet) {
                    if (fleetMode.draggingFleet.row > row || fleetMode.draggingFleet.tab !== fleetMode.currentTab) {
                      box_shadow("0 -5px 0 rgba(155,255,155,.4)");
                    } else if (fleetMode.draggingFleet.row < row) {
                      box_shadow("0 5px 0 rgba(155,255,155,.4)");
                    } else if (fleetMode.draggingFleet.copy) {
                      background_color("rgba(155,255,155,.4)");
                    }
                  }
                  fleetAis = commander.fleet.ais || {};
                  for (col = l = 0; l < 10; col = ++l) {
                    unitButton(getFleetKey(row, col, fleetMode.currentTab));
                  }
                  img(
                    ".hover-fade",
                    {
                      src: "img/ui/back.png",
                      width: 40,
                      height: 50,
                    },
                    function () {
                      position("absolute");
                      top(15);
                      right(-42);
                      return onmousedown(function (e) {
                        var i, m;
                        if (e.altKey) {
                          if (!isEmptyFleet(row, fleetMode.currentTab)) {
                            for (i = m = 0; m < 10; i = ++m) {
                              commander.fleet[getFleetKey(row, i, fleetMode.currentTab)] = "";
                            }
                            delete commander.fleet.ais[getAIKey(row, fleetMode.currentTab)];
                          } else {
                            removeFleet(row, fleetMode.currentTab);
                          }
                          control.savePlayer();
                        } else {
                          commander.fleet.selection = {
                            row: row,
                            tab: fleetMode.currentTab,
                          };
                          account.save();
                          fleetMode.draggingFleet = {
                            row: row,
                            tab: fleetMode.currentTab,
                            name: fleetAis[getAIKey(row, fleetMode.currentTab)],
                            copy: e.shiftKey,
                          };
                        }
                        return e.preventDefault();
                      });
                    }
                  );
                  return input(
                    ".hover-black",
                    {
                      type: "text",
                      value: fleetAis[getAIKey(row, fleetMode.currentTab)] || "",
                      maxlength: 15,
                      placeholder: "●",
                    },
                    function () {
                      position("absolute");
                      padding(10);
                      top(20);
                      left(-84);
                      width(84);
                      color("white");
                      border("none");
                      font_size(12);
                      text_align("right");
                      return oninput(function (e) {
                        if (!commander.fleet.ais) {
                          commander.fleet.ais = {};
                        }
                        fleetAis = commander.fleet.ais;
                        e.target.value = e.target.value.replace(/[^A-Za-z0-9]/g, "");
                        fleetAis[getAIKey(row, fleetMode.currentTab)] = e.target.value;
                        return account.rootSave();
                      });
                    }
                  );
                });
              });
            })(row)
          );
        }
        return results;
      });
    });
    div("#unit-dragger", function () {
      position("absolute");
      width(84);
      height(84);
      pointer_events("none");
      if (fleetMode.draggingUnit) {
        left("-100px");
        top("-100px");
        return buildBar.specToThumbBg(fleetMode.draggingUnit.spec);
      }
    });
    div("#fleet-dragger", function () {
      var i, j, key, ref, row, tab;
      if (fleetMode.draggingFleet) {
        position("absolute");
        left(-6);
        right(0);
        top(control.mouse[1] - 84 / 2 + "px");
        margin("0 auto");
        padding(0);
        width(840);
        height(84);
        visibility("visible");
        pointer_events("none");
        div(function () {
          var ref;
          text(((ref = fleetMode.draggingFleet) != null ? ref.name : void 0) || "●");
          position("absolute");
          padding(10);
          top(20);
          left(-84);
          width(84);
          color("white");
          border("none");
          font_size(12);
          return text_align("right");
        });
        for (i = j = 0; j < 10; i = ++j) {
          (ref = fleetMode.draggingFleet), (row = ref.row), (tab = ref.tab);
          key = getFleetKey(row, i, tab);
          div(function () {
            position("absolute");
            width(84);
            height(84);
            top(0);
            left(i * 84);
            background_color("rgba(0,0,0,.4)");
            return buildBar.specToThumbBg(commander.fleet[key]);
          });
        }
        return img(
          ".hover-fade",
          {
            src: "img/ui/back.png",
            width: 40,
            height: 50,
          },
          function () {
            position("absolute");
            top(15);
            return right(-42);
          }
        );
      } else {
        return visibility("hidden");
      }
    });
    if (designMode.locked) {
      return lockScreen();
    }
  };

  lockScreen = function () {
    return div(function () {
      position("absolute");
      top(0);
      left(0);
      right(0);
      bottom(0);
      background_color("rgba(0,0,0,.8)");
      z_index("2");
      return div(function () {
        position("absolute");
        top(200);
        right(0);
        left(0);
        height(100);
        line_height(100);
        background_color("rgba(200,0,0,.6)");
        color("white");
        text_align("center");
        return text("You can't switch fleets in 1v1 tournament mode");
      });
    });
  };

  unitButton = function (key) {
    var spec;
    spec = commander.fleet[key];
    return div(".unitpic", function () {
      var found, name, unit;
      border("1px solid rgba(255,255,255,.05)");
      display("inline-block");
      position("relative");
      unit = buildBar.specToUnit(spec);
      buildBar.specToThumbBg(spec);
      if (fleetMode.unitDragover === key && fleetMode.draggingUnit) {
        if (!spec) {
          background_color("rgba(255,255,255,.4)");
        } else {
          background_color("rgba(155,255,155,.4)");
        }
      }
      if (fleetMode.search) {
        if (spec && spec[0] === "{") {
          name = JSON.parse(spec).name;
          if (name && name.indexOf(fleetMode.search) !== -1) {
            found = true;
          }
        }
        if (!found) {
          opacity(".1");
        }
      }
      onmousedown(function (e) {
        if (e.which === 1) {
          if (e.altKey) {
            commander.fleet[key] = "";
            return;
          }
          if (spec) {
            fleetMode.draggingUnit = {
              spec: spec,
              key: key,
            };
            if (!e.shiftKey) {
              commander.fleet[key] = "";
            }
          }
        }
        return e.preventDefault();
      });
      onmousemove(function (e) {
        if (e.which === 1) {
          if (fleetMode.unitDragover !== key) {
            fleetMode.unitDragover = key;
            if (fleetMode.draggingUnit) {
              return;
            }
          }
        }
        return onecup.no_refresh();
      });
      return onmouseup(function (e) {
        var atSpec;
        if (e.which === 1) {
          if (fleetMode.draggingUnit) {
            atSpec = commander.fleet[key];
            if (!isEmptySpec(atSpec)) {
              commander.fleet[fleetMode.draggingUnit.key] = atSpec;
            }
            commander.fleet[key] = fleetMode.draggingUnit.spec;
            control.savePlayer();
            fleetMode.draggingUnit = null;
            return playSound("sounds/ui/flick.wav");
          }
        }
      });
    });
  };

  ui.unitPix = function () {
    return div(function () {
      var j, results, row;
      position("absolute");
      top(0);
      left(0);
      right(0);
      bottom(0);
      background("rgba(0,0,0,.9)");
      text("unit pix");
      results = [];
      for (row = j = 1; j < 25; row = ++j) {
        results.push(
          div(function () {
            var col, key, l, results1, spec, unit;
            height(84);
            min_width(840);
            results1 = [];
            for (col = l = 0; l < 10; col = ++l) {
              key = getFleetKey(row, col, fleetMode.currentTab);
              spec = commander.fleet[key];
              unit = buildBar.specToUnit(spec);
              if (unit) {
                unit.color = commander.color;
                results1.push(
                  img({
                    src: unit.thumb(),
                    width: 64,
                    height: 64,
                  })
                );
              } else {
                results1.push(void 0);
              }
            }
            return results1;
          })
        );
      }
      return results;
    });
  };
}.call(this));
