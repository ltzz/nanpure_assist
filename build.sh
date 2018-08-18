
tsc --out scripts/bundle.js  \
    scripts/global.ts \
    scripts/input/circle_keyboard.ts \
    scripts/ts_temp.ts \
    scripts/input/keyboard_input.ts \
    scripts/input/single_input.ts \
    scripts/input/mouse.ts \
    scripts/DOM_cells.ts \
    scripts/render.ts \
    scripts/ui.ts \
    scripts/logic.ts \
    scripts/group_field.ts \
    > log.txt
# webpack化試行中▼▼▼
# npm start
# webpack化試行中▲▲▲
cat log.txt
sleep 10s
