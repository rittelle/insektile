#!/usr/bin/env bash

# A small script to run the script from the command line (or from an IDE).
# It needs to be run inside the directory containing the script.

DEBUG=false
SCRIPT=$PWD/out/insektile.js
SCRIPT_IS_DECLARATIVE=false
PLUGIN_NAME=insektile

# GLOBAL used to store the script index returned by KWin
ID=-1

function debug() {
    if ${DEBUG}
    then
        >&2 echo "$*"
    fi
}

function load() {
    local METHOD_NAME=
    if ${SCRIPT_IS_DECLARATIVE}
    then
        local METHOD_NAME='loadDeclarativeScript'
    else
        local METHOD_NAME='loadScript'
    fi
    ID=$(dbus-send --session --dest=org.kde.KWin --print-reply=literal /Scripting org.kde.kwin.Scripting.${METHOD_NAME} "string:$SCRIPT" "string:$PLUGIN_NAME" | awk '{print $2}')
    debug "Loaded '$SCRIPT' as KWin script with ID '$ID'"
    if [ "$ID" -ge 0 ]
    then
        return 0
    else
        return 1
    fi
}

function run() {
    debug "Running '$SCRIPT'"
    dbus-send --session --dest=org.kde.KWin --print-reply=literal "/$ID" org.kde.kwin.Scripting.run
}

function unload() {
    local RET=$(dbus-send --session --dest=org.kde.KWin --print-reply=literal /Scripting org.kde.kwin.Scripting.unloadScript "string:$PLUGIN_NAME" | awk '{print $2}')
    debug "Got return value '$RET' trying to unload '$SCRIPT'"
    if [ "$RET" = 'true' ]
    then
        return 0
    fi
    return 1
}

function isloaded() {
    local RET=$(dbus-send --session --dest=org.kde.KWin --print-reply=literal /Scripting org.kde.kwin.Scripting.isScriptLoaded "string:$PLUGIN_NAME" | awk '{print $2}')
    debug "Got return value '$RET' testing if '$SCRIPT' is loaded"
    if [ "$RET" = 'true' ]
    then
        return 0
    fi
    return 1
}

function pause() {
    read -n1 -r -p "$1" key
}

function startmonitor() {
    dbus-monitor "type=signal,sender='org.kde.KWin',path='/$ID',interface='org.kde.kwin.Scripting'" &
}

if "$DEBUG"
then
    cleanup
fi

# NixOS creates this directory when a Qt package is installed via nix-shell
trap 'kill $(jobs -p); rm -rf __nix_qt5__' EXIT

if load
then
    echo "Script '$SCRIPT' loaded successfully"
else
    echo "Loading '$SCRIPT' as KWin script failed, trying to unload it first"
    if unload
    then
        if ! load
        then
            echo "Loading still fails, sorry I can't help you"
            exit 1
        fi
    else
        echo "Unloading failed, is KWin running?"
        exit 1
    fi
fi

debug "Starting monitor..."
startmonitor

sleep 1 # Paranoid sleep to ensure dbus-monitor is active
run

pause "Press any key to unload the script..."

if isloaded
then
    if unload
    then
        echo "Unloaded script successfully"
    else
        echo "Unloading script failed"
    fi
else
    echo "The script is already unloaded"
fi
