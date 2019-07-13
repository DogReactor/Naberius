kubectl apply -f deploy.yaml
kubectl patch deployment naberius-deployment -n naberius -p "{\"spec\":{\"template\":{\"metadata\":{\"annotations\":{\"hash\":\"${TRAVIS_COMMIT:0:8}\"}}}}}"