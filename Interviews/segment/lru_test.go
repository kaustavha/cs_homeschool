package main

import (
	"fmt"
	"testing"
	"time"
)

var getTests = []struct {
	name       string
	keyToAdd   interface{}
	keyToGet   interface{}
	expectedOk bool
}{
	{"string_hit", "myKey", "myKey", true},
	{"string_miss", "myKey", "nonsense", false},
}

func TestGet(t *testing.T) {
	for _, tt := range getTests {
		lru := NewCache(0, 10)
		lru.Add(tt.keyToAdd, "1234")
		val, ok := lru.Get(tt.keyToGet)
		if ok != tt.expectedOk {
			t.Fatalf("%s: cache hit = %v; want %v", tt.name, ok, !ok)
		} else if ok && val != "1234" {
			t.Fatalf("%s expected get to return 1234 but got %v", tt.name, val)
		}
	}
}

func TestRemove(t *testing.T) {
	lru := NewCache(0, 10)
	lru.Add("myKey", "1234")
	if val, ok := lru.Get("myKey"); !ok {
		t.Fatal("TestRemove returned no match")
	} else if val != "1234" {
		t.Fatalf("TestRemove failed.  Expected %d, got %v", 1234, val)
	}

	lru.Remove("myKey")
	if _, ok := lru.Get("myKey"); ok {
		t.Fatal("TestRemove returned a removed entry")
	}
}

func TestTimeout(t *testing.T) {
	lru := NewCache(0, 1)
	lru.Add("myKey", "1234")
	if val, ok := lru.Get("myKey"); !ok {
		t.Fatal("TestTimeout returned no match")
	} else if val != "1234" {
		t.Fatalf("TestTimeout failed.  Expected %d, got %v", 1234, val)
	}
	time.Sleep(time.Millisecond * 1500)
	if _, ok := lru.Get("myKey"); ok {
		t.Fatal("TestTimeout returned a timedout entry")
	}
}

func TestEvict(t *testing.T) {
	evictedKeys := make([]interface{}, 0)
	onEvictedFun := func(key interface{}, value interface{}) {
		evictedKeys = append(evictedKeys, key)
	}

	lru := NewCache(20, 1)
	lru.OnEvicted = onEvictedFun
	for i := 0; i < 22; i++ {
		lru.Add(fmt.Sprintf("myKey%d", i), 1234)
	}

	if len(evictedKeys) != 2 {
		t.Fatalf("got %d evicted keys; want 2", len(evictedKeys))
	}
	if evictedKeys[0] != Key("myKey0") {
		t.Fatalf("got %v in first evicted key; want %s", evictedKeys[0], "myKey0")
	}
	if evictedKeys[1] != Key("myKey1") {
		t.Fatalf("got %v in second evicted key; want %s", evictedKeys[1], "myKey1")
	}
}
