#! /usr/bin/env nix-shell
#! nix-shell -i bash -p qt5.qttools tree

qdbus org.kde.plasmashell /PlasmaShell showInteractiveKWinConsole

rm -rf __nix_qt5__
