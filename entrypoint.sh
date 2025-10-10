#!/bin/sh

echo "run_id: $RUN_ID"

npm run test
WDIO_EXIT_CODE=$?
echo "WDIO_EXIT_CODE: $WDIO_EXIT_CODE"

./bin/publish-tests.sh

exit $WDIO_EXIT_CODE
