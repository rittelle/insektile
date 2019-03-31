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

ls /src/contents/code/generated/*.js /src/contents/ui/*.qml | entr -cdp /src/test-docker/update.sh

