#!/bin/sh

echo "run_id: $RUN_ID"

npx wdio run ./wdio.conf.js
WDIO_EXIT_CODE=$?

./bin/publish-tests.sh

exit $WDIO_EXIT_CODE
