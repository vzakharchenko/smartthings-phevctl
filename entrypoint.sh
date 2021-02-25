#!/bin/bash
pm2 start `npm root -g`/smartthings-phevctl/smartthings-phevctl.js
tail -f -n 100 ~/.pm2/logs/smartthings-phevctl-error.log
