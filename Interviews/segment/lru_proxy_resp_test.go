package main

import (
	"fmt"
	"strings"
	"testing"
	"time"
)

func set(rptcp *RedisProxyTCP) {
	rw, err := rptcp.Open()
	if err != nil {
		fmt.Println(err)
	}
	rw.WriteString("*3\r\n$3\r\nSET\r\n$3\r\nkey\r\n$3\r\nfoo")
	rw.Flush()
}

func TestProxyRespGet(t *testing.T) {
	rptcp := NewRESPProxy("127.0.0.1:6379", 1, 10, ":8081", 10)
	set(rptcp)

	rw, err := rptcp.Open()
	if err != nil {
		fmt.Println(err)
	}
	rw.WriteString("*2\r\n$3\r\nGET\r\n$3\r\nkey\r\n")
	rw.Flush()

	// First response string in RESP is encoded type and length

	if resp, err := rw.ReadString('\n'); err != nil {
		t.Fatal("TestProxyRespGet error reading tcp resp")
	} else if strings.Join(strings.Fields(resp), "") == "$3" {
		val, _ := rw.ReadString('\n')
		if strings.Join(strings.Fields(val), "") != "foo" {
			fmt.Println(resp)
			t.Fatalf("TestProxyRespGet wrong return value from proxy")
		}
	}

	defer rptcp.Close()

}

func TestProxyRespConcurrency(t *testing.T) {
	rptcp := NewRESPProxy("127.0.0.1:6379", 1, 10, ":8082", 1)
	set(rptcp)
	strc := make(chan time.Duration, 20)

	start := time.Now()
	for i := 0; i < 10; i++ {
		go func() {
			rw, err := rptcp.Open()
			if err != nil {
				fmt.Println(err)
			}
			rw.WriteString("*2\r\n$3\r\nGET\r\n$3\r\nkey\r\n")

			rw.Flush()
			strc <- time.Now().Sub(start)
		}()
	}

	var delta time.Duration

	for i := 0; i < 10; i++ {
		val := <-strc
		if i == 0 {
			delta = val
		}
		if i == 9 {
			delta = time.Now().Add(val).Sub(time.Now().Add(delta))
		}
	}

	rptcp1 := rptcp

	start = time.Now()
	rptcp = NewRESPProxy("127.0.0.1:6379", 1, 10, ":8083", 10)
	for i := 0; i < 10; i++ {
		go func() {
			rw, err := rptcp.Open()
			if err != nil {
				fmt.Println(err)
			}
			rw.WriteString("*2\r\n$3\r\nGET\r\n$3\r\nkey\r\n")
			rw.Flush()
			strc <- time.Now().Sub(start)
		}()
	}

	var delta1 time.Duration

	for i := 10; i < 20; i++ {
		val := <-strc
		if i == 10 {
			delta1 = val
		}
		if i == 19 {
			delta1 = time.Now().Add(val).Sub(time.Now().Add(delta1))
		}
	}

	if delta1 > delta*2 {
		fmt.Println(delta)
		fmt.Println(delta1)
		t.Fatal("TestProxyRespConcurrency  10 limit proxy is slower than 1 limit proxy. But this is a concurrency test so might work on the next try")
	}

	defer rptcp.Close()
	defer rptcp1.Close()
}
