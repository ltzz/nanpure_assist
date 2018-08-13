# あとでwebpack化
tsc scripts/ts_temp.ts > log.txt
tsc scripts/input/circle_keyboard.ts >> log.txt
tsc scripts/input/single_input.ts >> log.txt
tsc scripts/DOM_cells.ts >> log.txt
cat log.txt
sleep 10s
