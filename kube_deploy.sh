#!/bin/bash
kubectl apply -f deploy.yml
kubectl patch deployment naberius-deployment -n magicdog -p "{\"spec\":{\"template\":{\"metadata\":{\"annotations\":{\"hash\":\"${TRAVIS_COMMIT:0:8}\"}}}}}"