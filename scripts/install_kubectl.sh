#!/bin/sh
curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl
mkdir ${HOME}/.kube
cp config ${HOME}/.kube/config

kubectl config set clusters.kubernetes.certificate-authority-data "$KUBE_CLUSTER_CERTIFICATE"
kubectl config set clusters.kubernetes.server "$KUBE_SERVER"
kubectl config set users.yukimir-admin.token "$KUBE_USER_TOKEN"