# README

## Quickstart

To run with no dependencies outside of stdlib:
```
rm lru_proxy.go lru_proxy_test.go
make test
```

To run with http lru proxy you can manually add "go-redis/redis" or

```
make deps
make test
```
Alternatively:
```
make deps
docker-compose up
go test
```


## Architecture overview

3 main components in MVP: http server or tcp server, LRU cache w/ timeout and backing redis

Clients connect via http or tcp to proxy server  
Proxy server caches any previously seen keys for faster lookup  
Otherwise it relies on the backing Redis instance to look it up  


LRU cache uses a hashmap and linkedlist. New items are added to the linkedlist and stored in the hashmap. Oldest items are removed from tail of LL when at capacity. All items also have a timeout started when they are added which will remove them after a set amount of time to ensure cache freshness.

The redis proxy wraps the LRU cache, creating a web server. Creating a new redis proxy populates an optional function in the LRUCache, FetchMissing, which will defer to the backing redis to fetch missing keys

Alternatively the TCP proxy wraps redis and doesnt rely on external libs only using the TCP protocol to communicate and partially uses RESP

## Code walkthrough

```
../segment/
├── Dockerfile  // Dockerfile for go app
├── Makefile  // Makefile for 1 click test
├── README.md  
├── docker-compose.yaml  // Runs redis container and connects main go app
├── lru.go  // Code for LRU cache with timeout 
├── lru_proxy.go  // Code for LRU http proxy
├── lru_proxy_test.go
├── lru_test.go
├── lru_proxy_resp.go  // contains standalone tcp proxy for redis
├── lru_proxy_resp_test.go
└── main.go 
```

lru_proxy -> Creates http server listening on 8080, backed by LRU cache backed by redis
