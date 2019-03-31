#!/usr/bin/env bash

echo 'Waiting a bit'
sleep 5
echo -n 'Reinstalling Insektile… '
plasmapkg2 -u /src/
echo 'Restarting KWin'
kwin_x11 --replace &
