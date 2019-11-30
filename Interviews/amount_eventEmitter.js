
/*interface EventEmitter {
  subscribe (eventName: string, callback: (data: any) => void): void;
  publish (eventName: string, data: any): void;
}
```
​
The `subscribe` method will make it so that whenever `publish` is called with the
`eventName`, the callback provided is run. An event can have multiple callbacks
subscribed to it.*/

/**

eventName
eventname
EventName

// do we buffer events?
**/

class EventEmitter {
    constructor() {
        this.map = {};
        this.defaultError = new Error('Error with input');
        this.subs = [];
    }
    _onFirstSub(eventName = '') {
        if (this._isValidEvent(eventName)) {
            this.map[eventName] = [];
            this.subs.push(eventName);
        }
    }
    _isValidEvent(eventName) {
        return !this.map[eventName];
    }
    _isPreSubbedEvent(eventName) {
        return this.subs.indexOf(eventName) > -1;
    }
    subscribe(eventName = '', callback) {
        if (eventName.length <= 0) return this.defaultError;
        eventName = eventName + '';

        if (!this._isPreSubbedEvent(eventName)) {
            this._onFirstSub(eventName);
            if (this._isPreSubbedEvent(eventName)) this.map[eventName].push(callback);
        } else {
            this.map[eventName].push(callback);
        }

        return () => this.map[eventName].splice(this.map[eventName].length - 1, 1)
    }



    publish(eventName, data) {
        if (this.map[eventName] && this._isPreSubbedEvent(eventName)) {
            this.map[eventName].forEach(cb => {
                cb(data);
            });
        } else {
            // cb(this.defaultError);
            return this.defaultError;
        }
    }
}

let em = new EventEmitter();
em.subscribe('log', console.log);
em.publish('log', 'hi')
em.publish('log', 'bye')

let unsub = em.subscribe('log2', console.log);
em.publish('log2', 'hi2')
unsub()
em.publish('log2', 'bye2')

em.subscribe('__proto__', console.log);
em.publish('__proto__', 'hi2')
em.publish('__proto__', 'bye2')

