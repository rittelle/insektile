#!/usr/bin/env bash

docker run -dv /tmp/.X11-unix:/tmp/.X11-unix --mount type=bind,source="$(pwd)"/..,target=/src insektile

