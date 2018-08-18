# tsc scripts/ts_temp.ts > log.txt
# tsc scripts/input/circle_keyboard.ts >> log.txt
# tsc scripts/input/single_input.ts >> log.txt
# tsc scripts/input/keyboard_input.ts >> log.txt
# tsc scripts/input/mouse.ts >> log.txt
# tsc scripts/DOM_cells.ts >> log.txt
# tsc scripts/global.ts >> log.txt

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
    > log.txt
# webpack化試行中▼▼▼
# npm start
# webpack化試行中▲▲▲
cat log.txt
sleep 10s
