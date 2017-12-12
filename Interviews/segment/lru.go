package main

import (
	"container/list"
	"time"
)

type TimedLRUCache struct {
	maxEntries int
	timeout    int

	FetchMissing func(key interface{}) (value interface{}, ok bool)
	OnEvicted    func(key interface{}, value interface{})
	ll           *list.List

	cache map[interface{}]*list.Element
}

type Key interface{}

type entry struct {
	key     Key
	value   interface{}
	timeout *time.Timer
}

func NewCache(maxEntries int, timeout int) *TimedLRUCache {
	return &TimedLRUCache{
		maxEntries: maxEntries,
		timeout:    timeout,
		ll:         list.New(),
		cache:      make(map[interface{}]*list.Element),
	}
}

func (c *TimedLRUCache) Add(key Key, value interface{}) {
	if c.cache == nil {
		c.cache = make(map[interface{}]*list.Element)
		c.ll = list.New()
	}

	removeEle := func() {
		c.Remove(key)
	}
	timer := time.AfterFunc(time.Duration(c.timeout)*time.Second, removeEle)

	if oe, ok := c.cache[key]; ok {
		oldTimer := oe.Value.(*entry).timeout
		if oldTimer == nil {
			oe.Value.(*entry).timeout = timer
		}

		oe.Value.(*entry).value = value
		c.ll.MoveToFront(oe)
		return
	}

	ele := c.ll.PushFront(&entry{key, value, timer})
	c.cache[key] = ele
	if c.maxEntries != 0 && c.ll.Len() > c.maxEntries {
		c.RemoveOldest()
	}
}

func (c *TimedLRUCache) Remove(key Key) {
	if c.cache == nil {
		return
	}
	if ele, hit := c.cache[key]; hit {
		c.RemoveElement(ele)
	}
}

func (c *TimedLRUCache) RemoveOldest() {
	if c.cache == nil {
		return
	}
	ele := c.ll.Back()
	if ele != nil {
		c.RemoveElement(ele)
	}
}

func (c *TimedLRUCache) RemoveElement(e *list.Element) {
	c.ll.Remove(e)
	kv := e.Value.(*entry)
	delete(c.cache, kv.key)
	if c.OnEvicted != nil {
		c.OnEvicted(kv.key, kv.value)
	}
}

func (c *TimedLRUCache) Get(key Key) (value interface{}, ok bool) {
	if c.cache == nil {
		return nil, false
	}
	if ele, hit := c.cache[key]; hit {
		c.Add(key, ele.Value.(*entry).value)
		return ele.Value.(*entry).value, true
	}
	if c.FetchMissing != nil {
		if val, hit := c.FetchMissing(key); hit {
			c.Add(key, val)
			return val, true
		}
	}
	return nil, false
}
