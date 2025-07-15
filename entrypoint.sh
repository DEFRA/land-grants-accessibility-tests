#!/bin/sh

echo "run_id: $RUN_ID"

npx wdio run ./wdio.conf.js

./bin/publish-tests.sh

