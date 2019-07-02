#!/bin/bash
set -e

TAG=${CIRCLE_TAG:-$CIRCLE_SHA1}

# Google Cloud authentication
echo $GCLOUD_SERVICE_KEY | base64 --decode > $HOME/gcloud-service-key.json && cp $HOME/gcloud-service-key.json gcloud-service-key.json
gcloud --quiet components update
gcloud auth activate-service-account --key-file $HOME/gcloud-service-key.json
gcloud config set project $GCLOUD_PROJECT

# Build the image
yarn build
docker build -t eu.gcr.io/$GCLOUD_PROJECT/gov-timeline:$TAG .

# Push the images to Google Cloud
gcloud docker -- push eu.gcr.io/$GCLOUD_PROJECT/gov-timeline:$TAG

gcloud container clusters get-credentials $PRODUCTION_GCLOUD_CLUSTER --project $GCLOUD_PROJECT --zone europe-west1-d
GOOGLE_APPLICATION_CREDENTIALS=${HOME}/gcloud-service-key.json kubectl set image deployment/prod-gov-timeline gov-timeline=eu.gcr.io/$GCLOUD_PROJECT/gov-timeline:$TAG
