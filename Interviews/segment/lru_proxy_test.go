package main

import (
	"io/ioutil"
	"net/http"
	"testing"
)

func TestProxyGet(t *testing.T) {
	rpc := NewProxy("localhost:6379", 1, 10, ":8080")
	err := rpc.client.Set("key", "value", 0).Err()

	if err != nil {
		t.Fatal("TestProxyGet error setting kv in redis client")
	}

	if resp, err := http.Get("http://localhost:8080/key"); err != nil {
		t.Fatal("TestProxyGet Http get didnt return")
	} else {
		defer resp.Body.Close()
		if body, err := ioutil.ReadAll(resp.Body); err != nil {
			t.Fatal("TestProxyGet error reading http body")
		} else if string(body) != "value" {
			t.Fatalf("TestProxyGet wrong return value from proxy")
		}
	}

	rpc.close()
}
