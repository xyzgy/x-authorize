function Cancel(message) {
  this.message = message;
	console.log('1 cancel')
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }
	console.log('2 CancelToken')
  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
		console.log('3 CancelToken')
  });

  var token = this;
  executor(function cancel(message) {
		console.log('4 CancelToken')
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }
		console.log('5 CancelToken')
    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
	console.log('6 CancelToken')
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
	console.log('7 CancelToken')
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};
function isCancel(value) {
	console.log('8 isCancel')
  return !!(value && value.__CANCEL__);
};
export {CancelToken,Cancel,isCancel}