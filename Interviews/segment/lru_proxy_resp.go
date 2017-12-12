package main

import (
	"bufio"
	"fmt"
	"net"
	"strings"
)

type RedisProxyTCP struct {
	cache   *TimedLRUCache
	ln      net.Listener
	running bool
	addr    string
	sem     chan struct{}
}

func NewRESPProxy(redis_addr string, expiry_time int, capacity int, listen_proxy string, maxClients int) *RedisProxyTCP {
	cache := NewCache(expiry_time, capacity)
	ln, _ := net.Listen("tcp", listen_proxy)
	rptcp := &RedisProxyTCP{
		cache:   cache,
		ln:      ln,
		addr:    redis_addr,
		running: true,
		sem:     make(chan struct{}, maxClients),
	}
	rptcp.cache.FetchMissing = func(key interface{}) (interface{}, bool) {
		return rptcp.GetFromBR(key)
	}
	go rptcp.Listen()
	return rptcp
}

func (rptcp *RedisProxyTCP) Close() {
	rptcp.running = false
	rptcp.ln.Close()
}

func (rptcp *RedisProxyTCP) Open() (*bufio.ReadWriter, error) {
	conn, err := net.Dial("tcp", rptcp.addr)
	if err != nil {
		return nil, err
	}
	return bufio.NewReadWriter(bufio.NewReader(conn), bufio.NewWriter(conn)), nil
}

func (rptcp *RedisProxyTCP) Listen() {

	for {
		conn, _ := rptcp.ln.Accept()
		if !rptcp.running {
			return
		}
		rptcp.sem <- struct{}{}
		message, err := bufio.NewReader(conn).ReadString('\n')
		if err != nil {
			<-rptcp.sem
		}
		go func() {

			resp := rptcp.Proxy(message)

			<-rptcp.sem

			conn.Write([]byte(resp + "\n"))
		}()

	}
}

func (rptcp *RedisProxyTCP) Proxy(str string) string {
	if isget, key := rptcp.ParseKey(str); isget {
		if val, ok := rptcp.cache.Get(key); ok {
			return fmt.Sprint(val)
		}
	}
	rw, _ := rptcp.Open()
	rw.WriteString(str)
	rw.Flush()
	resp, _ := rw.ReadString('\n')
	return resp
}

func (rptcp *RedisProxyTCP) GetFromBR(key interface{}) (interface{}, bool) {
	str := fmt.Sprint(key)
	rw, _ := rptcp.Open()
	cmdStr := "*2\r\n$3\r\nGET\r\n$" + fmt.Sprint(len(str)) + "\r\n" + str
	rw.WriteString(cmdStr)
	rw.Flush()
	resp, err := rw.ReadString('\n')
	if err != nil {
		return resp, false
	}
	return resp, true
}

func (rptcp *RedisProxyTCP) ParseKey(str string) (bool, string) {
	words := strings.Fields(str)
	if strings.ToUpper(words[3]) == "GET" {
		return true, strings.Fields(str)[4]
	} else if strings.ToUpper(words[0]) == "GET" {
		return true, strings.Fields(str)[1]
	} else {
		return false, ""
	}
}
