#!/usr/bin/env bash

if [ "$EUID" -ne 0 ];
then
  node "${PWD}/installation.js"
else
  echo "Aborting: Script ran as root user!"
fi
