# Improve Performance Ideas

## Possible quick performance win solutions

- dataManager: when formControl.value has the same value from dataManager then skip and dont write into formControl.setValue()
- merge global and local rules in order to run formControl methods (e.g disable, etc.) only once.
- cells which are configured as disabled and not to be render should not be registered in formGroup
  and should only render defaultTemplate (see e.g. mat-datagrid-input)
- while scrolling avoid registering formControls into formGroup. Register only when scroll ends.

```js
// Scroll start and end events
timeout = null;
state = { isScrolling: false };

onScroll = () => {
  clearTimeout(timeout);
  const { isScrolling } = state;

  if (!isScrolling) {
    state = { isScrolling: true };
    console.log(state);
  }

  this.timeout = setTimeout(() => {
    state = { isScrolling: false };
    console.log(state);
  }, 100);
};

window.addEventListener('scroll', this.onScroll);
```

## Possible high performance win solutions

- using SharedArrayBuffer and WebWorker in order to run code in concurrency and parallelism

  - https://lucasfcosta.com/2017/04/30/JavaScript-From-Workers-to-Shared-Memory.html
  - https://blogtitle.github.io/using-javascript-sharedarraybuffers-and-atomics/
  - https://blog.logrocket.com/understanding-sharedarraybuffer-and-cross-origin-isolation/
  - https://stackoverflow.com/questions/13574158/number-of-web-workers-limit
  - especially the code in cdk-datagrid-form-control.directive.ngOnInit (registering form) should be made
    in Webworker and the instances should be sharded over SharedArrayBuffer (+ atomic operations)

- using SharedArrayBuffer and WebWorker in order to run code in concurrency and parallelism
  - register form in cdk-datagrid-form-control.directive.ngOnInit should be only once.
    - run all validations, setting value, etc. over one Websocket.
