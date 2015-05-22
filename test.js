'use strict';

require('co-mocha');
let assert = require('chai').assert;
let wait = require('co-wait');
let KindaEventManager = require('./src');

suite('KindaEventManager', function() {
  test('simple listener', function() {
    let person = KindaEventManager.instantiate();
    let hasBeenCalled = false;
    person.on('event', function(arg) {
      assert.strictEqual(this, person);
      assert.strictEqual(arg, 123);
      hasBeenCalled = true;
    });
    person.emit('event', 123);
    assert.isTrue(hasBeenCalled);
  });

  test('listeners on both instance and prototype', function() {
    let person;
    let prototypeHasBeenCalled = false;
    let instanceHasBeenCalled = false;
    let Person = KindaEventManager.extend('Person', function() {
      this.on('event', function(arg) {
        assert.strictEqual(this, person);
        assert.strictEqual(arg, 123);
        prototypeHasBeenCalled = true;
      });
    });
    person = Person.instantiate();
    person.on('event', function(arg) {
      assert.strictEqual(this, person);
      assert.strictEqual(arg, 123);
      instanceHasBeenCalled = true;
    });
    person.emit('event', 123);
    assert.isTrue(prototypeHasBeenCalled);
    assert.isTrue(instanceHasBeenCalled);
  });

  test('remove listener', function() {
    let person = KindaEventManager.instantiate();
    let hasBeenCalled = false;
    let listener = person.on('event', function() {
      hasBeenCalled = true;
    });
    person.emit('event');
    assert.isTrue(hasBeenCalled);
    hasBeenCalled = false;
    person.off('event', listener);
    person.emit('event');
    assert.isFalse(hasBeenCalled);
  });

  test('async listener', function *() {
    let person = KindaEventManager.instantiate();
    let hasBeenCalled = false;
    person.onAsync('event', function *(arg) {
      assert.strictEqual(this, person);
      assert.strictEqual(arg, 123);
      yield wait(50);
      hasBeenCalled = true;
    });
    yield person.emitAsync('event', 123);
    assert.isTrue(hasBeenCalled);
  });

  test('async listeners on both instance and prototype', function *() {
    let person;
    let prototypeHasBeenCalled = false;
    let instanceHasBeenCalled = false;
    let Person = KindaEventManager.extend('Person', function() {
      this.onAsync('event', function *(arg) {
        assert.strictEqual(this, person);
        assert.strictEqual(arg, 123);
        yield wait(25);
        prototypeHasBeenCalled = true;
      });
    });
    person = Person.instantiate();
    person.onAsync('event', function *(arg) {
      assert.strictEqual(this, person);
      assert.strictEqual(arg, 123);
      yield wait(25);
      instanceHasBeenCalled = true;
    });
    yield person.emitAsync('event', 123);
    assert.isTrue(prototypeHasBeenCalled);
    assert.isTrue(instanceHasBeenCalled);
  });

  test('remove async listener', function *() {
    let person = KindaEventManager.instantiate();
    let hasBeenCalled = false;
    let listener = person.onAsync('event', function *() {
      yield wait(50);
      hasBeenCalled = true;
    });
    yield person.emitAsync('event');
    assert.isTrue(hasBeenCalled);
    hasBeenCalled = false;
    person.offAsync('event', listener);
    yield person.emitAsync('event');
    assert.isFalse(hasBeenCalled);
  });
});
