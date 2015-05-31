const topBroadcaster = {
  subscribe(key) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`\`subscribe\` for \`${key}\` bubbled to the top`);
    }
  },

  getValue(key) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`\`getValue\` for \`${key}\` bubbled to the top`);
    }
  },
};

export default class Broadcaster {
  constructor(keys, parent = topBroadcaster) {
    this._keys = keys;
    this._parent = parent;

    this._subscriptions = {};
    this._values = {};
    keys.forEach(key => {
      this._subscriptions[key] = [];
    });
  }

  subscribe(key, callback) {
    if (this.broadcastsKey(key)) {
      this._subscriptions[key].push(callback);
      return () => {
        const idx = this._subscriptions[key].indexOf(callback);
        if (idx !== -1) {
          this._subscriptions[key].splice(idx, 1);
          return true;
        }
        return false;
      };
    } else {
      return this._parent.subscribe(key, callback);
    }
  }

  broadcastsKey(key) {
    return this._keys.indexOf(key) !== -1;
  }

  getValue(key) {
    if (this.broadcastsKey(key)) {
      return this._values[key];
    } else {
      return this._parent.getValue(key);
    }
  }

  broadcast(map) {
    for (let key in map) {
      if (!this.broadcastsKey(key)) {
        throw new Error(
          `Cannot broadcast \`${key}\`: key not present in keys.`
        );
      }
      this._values[key] = map[key];
      this._subscriptions[key].forEach(callback => callback(map[key]));
    }
  }
}