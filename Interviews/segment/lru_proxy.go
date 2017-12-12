package main

import (
	"fmt"
	"github.com/go-redis/redis"
	"net/http"
)

type RedisProxy struct {
	client *redis.Client
	cache  *TimedLRUCache
	server *http.Server
}

func NewProxy(addr string, expiry_time int, capacity int, listen_proxy string) *RedisProxy {
	rpc := NewRP(addr, expiry_time, capacity)
	rpc.server = &http.Server{
		Addr:    listen_proxy,
		Handler: rpc.makeHandler(),
	}
	go func() {
		rpc.server.ListenAndServe()
	}()
	return rpc
}

func (rp *RedisProxy) makeHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rp.handleGet(w, r)
	}
}

func (rp *RedisProxy) handleGet(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		return
	}

	key := r.URL.Path[1:]
	if val, ok := rp.cache.Get(key); ok {
		if str, ok := val.(string); ok {
			w.Write([]byte(str))
		}
	}
}

func (r *RedisProxy) configure() {
	r.cache.FetchMissing = func(key interface{}) (interface{}, bool) {
		ret, val := r.getFromRedis(key)
		return ret, val
	}
}

func (r *RedisProxy) getFromRedis(key interface{}) (interface{}, bool) {
	str := fmt.Sprint(key)
	val, err := r.client.Get(str).Result()
	if err != nil {
		return nil, false
	}
	return val, true
}

func (r *RedisProxy) close() {
	r.server.Close()
}

func NewRP(addr string, expiry_time int, capacity int) *RedisProxy {
	client := createDefaultRC()
	if addr != "" {
		client = createRedisClient(addr, "", 0)
	}

	cache := NewCache(expiry_time, capacity)

	rpc := &RedisProxy{
		client: client,
		cache:  cache,
	}
	rpc.configure()

	return rpc
}

func createDefaultRC() *redis.Client {
	return createRedisClient("localhost:6379", "", 0)
}

func createRedisClient(addr string, pass string, db int) *redis.Client {
	return redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: pass, // no pass
		DB:       db,   // default
	})
}
