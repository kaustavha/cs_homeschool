#README

Get kubernetes


# using kubernetes

- first install minikube

- create kubectl namespace with minikube context & switch to it. 
https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/. 

- get and setup gcloud to use gce for mysql pods
https://cloud.google.com/container-engine/docs/quickstart

- get mysql up, use a local volume, also called a hostpath
https://kubernetes.io/docs/tasks/run-application/run-single-instance-stateful-application/

- build docker image of hello-docker-rails
- run and expose it via kubectl (type=nodeport to use with minikube)

https://cloud.google.com/container-engine/docs/tutorials/persistent-disk

# common commands

- View:  
`kubectl get all`  
`kubectl config view`

- Set namespace
`kubectl config set-context $(kubectl config current-context) --namespace=<insert-namespace-name-here>
`
- run and expose and get ip
`kubectl run hello-minikube --image=gcr.io/google_containers/echoserver:1.4 --port=8080`  
`kubectl expose deployment hello-minikube --type=NodePort`   
`minikube service hello-minikube --url`

debug: `kubectl logs podname -p`

# common tutorials
## wp and mysql <- outdated/doesnt work
   https://cloud.google.com/container-engine/docs/tutorials/persistent-disk

 - create pvs `kubectl create -f local_volumes.yaml`
 - create secret to use as pass `kubectl create secret generic mysql-pass --from-literal=password=yourpassword`
 - deploy mysql `kubectl create -f mysql-deployment.yaml`
- 
- Delete all: `kubectl delete deployment,service,pvc -l app=wordpress`

``

```
minikube start vm-driver=xhyve
kubectl config use-context minikube
docker build -t appname:version .
kubectl run appname --image=appname:version --port=9090
kubectl expose deployment appname --type=loadvalancer
minikube service appname
```

# ERrs
- Not authoried to docker build: 

`Get https://registry-1.docker.io/v2/library/golang/manifests/1.8-alpine: unauthorized: incorrect username or password`
`
$ docker build -t gcr.io/${PROJECT_ID}/hello-app:v1 .
`
Run:

`docker login`
 and login with dockerhub creds
