#!/usr/bin/env bash

sleep 30

if plasmapkg2 --list --type 'KWin/Script' | grep insektile; then
    echo 'Insektile already installed :)'
else
    echo 'Installing Insektile…'
    plasmapkg2 -i /src/
    cp /src/test-docker/kwinrc /home/neon/.config
    kwin_x11 --replace &
fi

P=/src/contents/
E=--exclude /src/contents/code/typescript
inotifywait -r -q -m -e close_write --format %e $P | while read events; do
    echo -n 'Reinstalling Insektile… '
    plasmapkg2 -u /src/
    echo 'Restarting KWin'
    kwin_x11 --replace &
done

