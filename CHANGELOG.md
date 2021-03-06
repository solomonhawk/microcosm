# Changelog

### 3.2.0

- Changed default shouldUpdate algorithm

### 3.1.0

- `Microcosm::getInitialState()` now accepts an `options`
  argument. This argument is passed down from the constructor.

### 3.0.0

- Changed data update pattern to more closely match
  [Om](https://github.com/omcljs/om/wiki/Basic-Tutorial). This means
  that `Microcosm::merge` has been replaced with
  `Microcosm::swap`. Additionally, `Microcosm::reset` has been added
  to completely obliterate old state.
- `Microcosm::addStore` now only accepts one store at a time. It was
  not being utilized, gives poorer error handling, and makes let less
  clear the order in which Stores will process data.
- The internal class `Heartbeat` was replaced with `pulse`. Pulse is a
  function that can act as a factory or decorator. When given an
  argument, it extends an object with emitter functionality, otherwise
  it returns a new object that implements the same API. This
  eliminates the possibility that the private `_callbacks` member of
  `Heartbeat` was overridden. It also reduces the use of classical
  inheritance, which yields some minor file size benefits by
  polyfilling less of the `class` API.

### 2.0.1

- Fix issue where empty arguments would break deserialize

### 2.0.0

- Replace default `Microcosm::send` currying with partial application
  using `Microcosm::prepare`
- Throw an error if a store is added that does not have a unique identifier
- `Microcosm::set` has been replaced with `Microcosm::merge`, so far
  `set` has only been used internally to `Microcosm` and `merge` dries
  a couple of things up

#### More info on removing currying

Currying has been removed `Microcosm::send`. This was overly clever
and somewhat malicious. If an action has default arguments, JavaScript
has no way (to my knowledge) of communicating it. One (me) could get into a
situation where it is unclear why an action has not fired properly
(insufficient arguments when expecting fallback defaults).

In a language without static typing, this can be particularly hard to debug.

In most cases, partial application is sufficient. In light of this,
actions can be "buffered up" up with `Microcosm::prepare`:

```javascript
// Old
let curried = app.send(Action)

// New
let partial = app.prepare(Action)
```

`Microcosm::prepare` is basically just `fn.bind()` under the
hood. Actions should not use context whatsoever, so this should be a
reasonable caveat.

### 1.4.0

- `Store.deserialize` returns the result of `getInitialState` if no
  state is given
- Added `Microcosm.swap` to perform diffing and emission on change
- `Microcosm.seed` will now trigger a change event
- `Heartbeat.js` now invokes callbacks with `callback.call(this)`

### 1.3.0

- Microcosms will `set` the result of `getInitialState` when adding a store
- Microcosms will execute `deserialize` on stores when running `seed`
- Adding a store will now fold its properties on top of a default set
  of options. See `./src/Store.js` for details.

### 1.2.1

- Fix bug introduced with Tag by exposing ES6 module

### 1.2.0

- All stores can implement a `serialize` method which allows them to
  shape how app state is serialized to JSON.

### 1.1.0

- Better seeding. Added `Microcosm::seed` which accepts an
object. For each known key, Microcosm will the associated store's
`getInitialState` function and set the returned value.
- Exposed `Microcosm::getInitialState` to configure the starting value
  of the instance. This is useful for those wishing to use the
  `immutable` npm package by Facebook.
- Microcosm will not emit changes on dispatch unless the new state
  fails a shallow equality check. This can be configured with
  `Microcosm::shouldUpdate`
- `Microcosm::send` is now curried.

### 1.0.0

This version adds many breaking changes to better support other
libraries such as
[Colonel Kurtz](https://github.com/vigetlabs/colonel-kurtz) and [Ars
Arsenal](https://github.com/vigetlabs/ars-arsenal).

In summary, these changes are an effort to alleviate the cumbersome
nature of managing unique instances of Actions and Stores for each
Microcosm instance. 1.0.0 moves away from this, instead relying on
pure functions which an individual instance uses to operate upon a
global state object.

- Actions must now be tagged with `microcosm/tag`. For the time being,
  this is to provide a unique identifier to each Action. It would be
  nice in future versions to figure out a way to utilize `WeakMap`.
- Stores are plain objects, no longer inheriting from `Store` base
  class.
- Stores must implement a `toString` method which returns a unique id.
- State for a store must now be accessed with: `microcosm.get(Store)`
- Microcosms no longer require `addActions`, actions are fired with
  `microcosm.send(Action, params)`
- Removed `Microscope` container component. Just use `listen`

### 0.2.0

- Remove `get all()` from `Store`. This is to reduce namespace collisions. Stores should define their own getters.

### 0.1.0

- Added a `pump` method to `Microcosm` instances. This exposes the heartbeat used to propagate change.
