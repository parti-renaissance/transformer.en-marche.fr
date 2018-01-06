#!/bin/bash
set -e

# Google Cloud authentication
echo $GCLOUD_SERVICE_KEY | base64 --decode > $HOME/gcloud-service-key.json && cp $HOME/gcloud-service-key.json gcloud-service-key.json
sudo /opt/google-cloud-sdk/bin/gcloud --quiet components update
sudo /opt/google-cloud-sdk/bin/gcloud auth activate-service-account --key-file $HOME/gcloud-service-key.json
sudo /opt/google-cloud-sdk/bin/gcloud config set project $GCLOUD_PROJECT

# Build the image
yarn build
docker build -t eu.gcr.io/$GCLOUD_PROJECT/gov-timeline:${1:-$CIRCLE_SHA1} .

# Push the images to Google Cloud
sudo /opt/google-cloud-sdk/bin/gcloud docker -- push eu.gcr.io/$GCLOUD_PROJECT/gov-timeline:${1:-$CIRCLE_SHA1}
