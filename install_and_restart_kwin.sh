#!/usr/bin/env nix-shell
#!nix-shell -i bash -p nodejs nodePackages.typescript

tsc && plasmapkg2 -u . && kwin_x11 --replace
