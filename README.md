# ember-cli-single-file-components

This is a Work In Progress and should not be used in production.

## Usage

```html
<!-- /app/components/my-component.ember -->
<script>
  import Ember from 'ember';

  export default Ember.Component.extend({
    myVar: 'Testing dynamic vars',
  });
</script>

<template>
  <h1 id="hello">Hello World!</h1>
  <p id="dynamic">{{myVar}}</p>
</template>

<style>
  h1 {
    color: red;
  }
</style>
```

And use wherever you want `{{my-component myVat='test'}}`.

## Installation

* `git clone <repository-url>` this repository
* `cd ember-cli-single-file-components`
* `npm install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
