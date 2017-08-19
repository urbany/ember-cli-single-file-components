import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

const { $ } = Ember;

moduleForAcceptance('Acceptance | application render test');

test('template renders', function(assert) {
  assert.expect(1);

  visit('/');

  andThen(function() {
    assert.equal($('h1#hello').html(), 'Hello World!');
  });
});

test('component renders', function(assert) {
  assert.expect(1);

  visit('/');

  andThen(function() {
    assert.equal($('p#dynamic').html(), 'Testing dynamic vars');
  });
});

test('css renders', function(assert) {
  assert.expect(1);

  visit('/');

  andThen(function() {
    assert.equal($('h1#hello').css('color'), 'rgb(255, 0, 0)');
  });
});
