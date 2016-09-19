'use strict';

let KindaObject = require('kinda-object');

let EventManager = KindaObject.extend('EventManager', function() {
  this.getListeners = function(name, createIfUndefined) {
    if (!this.hasOwnProperty('_listeners')) {
      if (!createIfUndefined) return undefined;
      this._listeners = {};
    }
    if (!this._listeners.hasOwnProperty(name)) {
      if (!createIfUndefined) return undefined;
      this._listeners[name] = [];
    }
    return this._listeners[name];
  };

  this.on = function(name, fn) {
    let listeners = this.getListeners(name, true);
    let index = listeners.indexOf(undefined);
    if (index !== -1) listeners[index] = fn; else listeners.push(fn);
    return fn;
  };

  this.off = function(name, fn) {
    let listeners = this.getListeners(name);
    if (!listeners) return;
    let index = listeners.indexOf(fn);
    if (index !== -1) listeners[index] = undefined;
  };

  this.emit = function(name, ...args) {
    let results = this._callListeners(name, this, args);
    let prototype = Object.getPrototypeOf(this);
    if (prototype._callListeners) {
      results.push.apply(results, prototype._callListeners(name, this, args));
    }
    return Promise.all(results);
  };

  this._callListeners = function(name, thisArg, args) {
    let listeners = this.getListeners(name);
    if (!listeners) return [];
    let results = [];
    for (let i = 0; i < listeners.length; i++) {
      let fn = listeners[i];
      if (fn) results.push(fn.apply(thisArg, args));
    }
    return results;
  };
});

module.exports = EventManager;
