'use strict';

let assert = require('chai').assert;
let util = require('kinda-util').create();
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

  test('async listener', async function() {
    let person = KindaEventManager.instantiate();
    let hasBeenCalled = false;
    person.on('event', async function(arg) {
      assert.strictEqual(this, person);
      assert.strictEqual(arg, 123);
      await util.timeout(50);
      hasBeenCalled = true;
    });
    await person.emit('event', 123);
    assert.isTrue(hasBeenCalled);
  });

  test('async listeners on both instance and prototype', async function() {
    let person;
    let prototypeHasBeenCalled = false;
    let instanceHasBeenCalled = false;
    let Person = KindaEventManager.extend('Person', function() {
      this.on('event', async function(arg) {
        assert.strictEqual(this, person);
        assert.strictEqual(arg, 123);
        await util.timeout(25);
        prototypeHasBeenCalled = true;
      });
    });
    person = Person.instantiate();
    person.on('event', async function(arg) {
      assert.strictEqual(this, person);
      assert.strictEqual(arg, 123);
      await util.timeout(25);
      instanceHasBeenCalled = true;
    });
    await person.emit('event', 123);
    assert.isTrue(prototypeHasBeenCalled);
    assert.isTrue(instanceHasBeenCalled);
  });

  test('remove async listener', async function() {
    let person = KindaEventManager.instantiate();
    let hasBeenCalled = false;
    let listener = person.on('event', async function() {
      await util.timeout(50);
      hasBeenCalled = true;
    });
    await person.emit('event');
    assert.isTrue(hasBeenCalled);
    hasBeenCalled = false;
    person.off('event', listener);
    await person.emit('event');
    assert.isFalse(hasBeenCalled);
  });
});
