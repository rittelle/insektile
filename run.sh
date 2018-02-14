#! /usr/bin/env nix-shell
#! nix-shell -i bash -p qt5.qttools tree

# A small script to run the script from the command line (or from an IDE).
# WARNING: It tries to remove ./__nix_qt5__ , so make sure you have no data there.
# It needs to be run inside the directory containing the script.

DEBUG=false
SCRIPT=$PWD/out/insektile.js
PLUGIN_NAME=insektile

# GLOBAL used to store the script index returned by KWin
ID=-1

function debug() {
    if "$DEBUG"
    then
        >&2 echo "$*"
    fi
}

function load() {
    ID=$(qdbus org.kde.KWin /Scripting loadScript "$SCRIPT" "$PLUGIN_NAME")
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
    qdbus org.kde.KWin "/$ID" run
}

function unload() {
    local RET=$(qdbus org.kde.KWin /Scripting unloadScript "$PLUGIN_NAME")
    debug "Got return value '$RET' trying to unload '$SCRIPT'"
    if [ "$RET" = 'true' ]
    then
        return 0
    fi
    return 1
}

function isloaded() {
    local RET=$(qdbus org.kde.KWin /Scripting isScriptLoaded "$PLUGIN_NAME")
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
debug "Monitor PID is $MONITOR_PID"

sleep 1
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
