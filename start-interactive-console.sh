#!/usr/bin/env sh

dbus-send  --print-reply=literal --session --dest=org.kde.plasmashell /PlasmaShell org.kde.PlasmaShell.showInteractiveKWinConsole
