#!/bin/bash
if [ ! -f $OPENSHIFT_DATA_DIR/last_run ]; then
  touch $OPENSHIFT_DATA_DIR/last_run
fi
if [[ $(find $OPENSHIFT_DATA_DIR/last_run -mmin +14) ]]; then #run every 15 mins
  rm -f $OPENSHIFT_DATA_DIR/last_run
  touch $OPENSHIFT_DATA_DIR/last_run
  curl http://lodurparser-longstone.rhcloud.com/update?silent=true
fi