'use strict';

let KindaObject = require('kinda-object');

let EventManager = KindaObject.extend('EventManager', function() {
  // === Synchronous listeners ===

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
    listeners.push(fn);
    return fn;
  };

  this.off = function(name, fn) {
    let listeners = this.getListeners(name);
    if (!listeners) return;
    let index = listeners.indexOf(fn);
    if (index !== -1) listeners.splice(index, 1);
  };

  this.emit = function(name, ...args) {
    this._callListeners(name, this, args);
    let prototype = Object.getPrototypeOf(this);
    if (prototype._callListeners) {
      prototype._callListeners(name, this, args);
    }
  };

  this._callListeners = function(name, thisArg, args) {
    let listeners = this.getListeners(name);
    if (!listeners) return;
    for (let i = 0; i < listeners.length; i++) {
      listeners[i].apply(thisArg, args);
    }
  };

  // === Asynchronous (generators) listeners ===

  this.getAsyncListeners = function(name, createIfUndefined) {
    if (!this.hasOwnProperty('_asyncListeners')) {
      if (!createIfUndefined) return undefined;
      this._asyncListeners = {};
    }
    if (!this._asyncListeners.hasOwnProperty(name)) {
      if (!createIfUndefined) return undefined;
      this._asyncListeners[name] = [];
    }
    return this._asyncListeners[name];
  };

  this.onAsync = function(name, fn) {
    let asyncListeners = this.getAsyncListeners(name, true);
    asyncListeners.push(fn);
    return fn;
  };

  this.offAsync = function(name, fn) {
    let asyncListeners = this.getAsyncListeners(name);
    if (!asyncListeners) return;
    let index = asyncListeners.indexOf(fn);
    if (index !== -1) asyncListeners.splice(index, 1);
  };

  this.emitAsync = function *(name, ...args) {
    yield this._callAsyncListeners(name, this, args);
    let prototype = Object.getPrototypeOf(this);
    if (prototype._callAsyncListeners) {
      yield prototype._callAsyncListeners(name, this, args);
    }
  };

  this._callAsyncListeners = function *(name, thisArg, args) {
    let asyncListeners = this.getAsyncListeners(name);
    if (!asyncListeners) return;
    for (let i = 0; i < asyncListeners.length; i++) {
      yield asyncListeners[i].apply(thisArg, args);
    }
  };
});

module.exports = EventManager;
