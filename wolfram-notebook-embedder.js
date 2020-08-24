(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.WolframNotebookEmbedder = {})));
}(this, (function (exports) { 'use strict';

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  /**
   * @this {Promise}
   */
  function finallyConstructor(callback) {
    var constructor = this.constructor;
    return this.then(
      function(value) {
        return constructor.resolve(callback()).then(function() {
          return value;
        });
      },
      function(reason) {
        return constructor.resolve(callback()).then(function() {
          return constructor.reject(reason);
        });
      }
    );
  }

  // Store setTimeout reference so promise-polyfill will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var setTimeoutFunc = setTimeout;

  function noop() {}

  // Polyfill for Function.prototype.bind
  function bind(fn, thisArg) {
    return function() {
      fn.apply(thisArg, arguments);
    };
  }

  /**
   * @constructor
   * @param {Function} fn
   */
  function Promise$1(fn) {
    if (!(this instanceof Promise$1))
      throw new TypeError('Promises must be constructed via new');
    if (typeof fn !== 'function') throw new TypeError('not a function');
    /** @type {!number} */
    this._state = 0;
    /** @type {!boolean} */
    this._handled = false;
    /** @type {Promise|undefined} */
    this._value = undefined;
    /** @type {!Array<!Function>} */
    this._deferreds = [];

    doResolve(fn, this);
  }

  function handle(self, deferred) {
    while (self._state === 3) {
      self = self._value;
    }
    if (self._state === 0) {
      self._deferreds.push(deferred);
      return;
    }
    self._handled = true;
    Promise$1._immediateFn(function() {
      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
      if (cb === null) {
        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
        return;
      }
      var ret;
      try {
        ret = cb(self._value);
      } catch (e) {
        reject(deferred.promise, e);
        return;
      }
      resolve(deferred.promise, ret);
    });
  }

  function resolve(self, newValue) {
    try {
      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self)
        throw new TypeError('A promise cannot be resolved with itself.');
      if (
        newValue &&
        (typeof newValue === 'object' || typeof newValue === 'function')
      ) {
        var then = newValue.then;
        if (newValue instanceof Promise$1) {
          self._state = 3;
          self._value = newValue;
          finale(self);
          return;
        } else if (typeof then === 'function') {
          doResolve(bind(then, newValue), self);
          return;
        }
      }
      self._state = 1;
      self._value = newValue;
      finale(self);
    } catch (e) {
      reject(self, e);
    }
  }

  function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
  }

  function finale(self) {
    if (self._state === 2 && self._deferreds.length === 0) {
      Promise$1._immediateFn(function() {
        if (!self._handled) {
          Promise$1._unhandledRejectionFn(self._value);
        }
      });
    }

    for (var i = 0, len = self._deferreds.length; i < len; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }

  /**
   * @constructor
   */
  function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
  }

  /**
   * Take a potentially misbehaving resolver function and make sure
   * onFulfilled and onRejected are only called once.
   *
   * Makes no guarantees about asynchrony.
   */
  function doResolve(fn, self) {
    var done = false;
    try {
      fn(
        function(value) {
          if (done) return;
          done = true;
          resolve(self, value);
        },
        function(reason) {
          if (done) return;
          done = true;
          reject(self, reason);
        }
      );
    } catch (ex) {
      if (done) return;
      done = true;
      reject(self, ex);
    }
  }

  Promise$1.prototype['catch'] = function(onRejected) {
    return this.then(null, onRejected);
  };

  Promise$1.prototype.then = function(onFulfilled, onRejected) {
    // @ts-ignore
    var prom = new this.constructor(noop);

    handle(this, new Handler(onFulfilled, onRejected, prom));
    return prom;
  };

  Promise$1.prototype['finally'] = finallyConstructor;

  Promise$1.all = function(arr) {
    return new Promise$1(function(resolve, reject) {
      if (!arr || typeof arr.length === 'undefined')
        throw new TypeError('Promise.all accepts an array');
      var args = Array.prototype.slice.call(arr);
      if (args.length === 0) return resolve([]);
      var remaining = args.length;

      function res(i, val) {
        try {
          if (val && (typeof val === 'object' || typeof val === 'function')) {
            var then = val.then;
            if (typeof then === 'function') {
              then.call(
                val,
                function(val) {
                  res(i, val);
                },
                reject
              );
              return;
            }
          }
          args[i] = val;
          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }

      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  Promise$1.resolve = function(value) {
    if (value && typeof value === 'object' && value.constructor === Promise$1) {
      return value;
    }

    return new Promise$1(function(resolve) {
      resolve(value);
    });
  };

  Promise$1.reject = function(value) {
    return new Promise$1(function(resolve, reject) {
      reject(value);
    });
  };

  Promise$1.race = function(values) {
    return new Promise$1(function(resolve, reject) {
      for (var i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    });
  };

  // Use polyfill for setImmediate for performance gains
  Promise$1._immediateFn =
    (typeof setImmediate === 'function' &&
      function(fn) {
        setImmediate(fn);
      }) ||
    function(fn) {
      setTimeoutFunc(fn, 0);
    };

  Promise$1._unhandledRejectionFn = function _unhandledRejectionFn(err) {
    if (typeof console !== 'undefined' && console) {
      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
    }
  };

  var globalNS = function () {
    if (typeof self !== 'undefined') {
      return self;
    }

    if (typeof window !== 'undefined') {
      return window;
    }

    if (typeof global !== 'undefined') {
      return global;
    }

    throw new Error('Unable to locate global object');
  }();

  var Promise$2 = globalNS.Promise || Promise$1;
  var installedScripts = {};
  var libraryLoading = {};
  var counter = 0;
  var isStyleInsertionPatched = false;
  var insertedStyles = [];
  var styleInsertionCallbacks = [];

  function installScript(url) {
    if (!installedScripts[url]) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      var head = document.getElementsByTagName('head')[0];
      head.appendChild(script);
      installedScripts[url] = true;
    }
  }

  function loadLibrary(libraryURL) {
    if (!libraryLoading[libraryURL]) {
      libraryLoading[libraryURL] = new Promise$2(function (resolve, reject) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onerror = reject;
        var callbackName;

        do {
          callbackName = '_wolframNotebookEmbedderCallback' + ++counter;
        } while (window[callbackName]);

        window[callbackName] = function (lib) {
          delete window[callbackName];
          resolve(lib);
        };

        script.src = libraryURL + '?callback=' + callbackName;
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(script);
      });
    }

    return libraryLoading[libraryURL];
  }

  function split(s, separators) {
    var before = null;
    var after = null;

    for (var i = 0; i < separators.length; ++i) {
      var sep = separators[i];
      var index = s.indexOf(sep);

      if (index >= 0 && (before === null || index < before.length)) {
        before = s.substring(0, index);
        after = s.substring(index + sep.length);
      }
    }

    return [before, after];
  }

  function isNotebookStyleElement(element, domains) {
    var name = element.tagName.toLowerCase();

    if (name === 'link' && (element.rel === 'stylesheet' || element.type === 'text/css')) {
      return domains.some(function (domain) {
        return element.href.startsWith(domain);
      });
    } else if (name === 'style') {
      if (element.dataset.isWolframNotebookStyle) {
        return true;
      }

      if (element.id === 'erd_scroll_detection_scrollbar_style') {
        return true;
      }
    }

    return false;
  }

  function patchShadowStyleInsertion(container, domains) {
    function callback(element) {
      var styleElement = !element.didInsertWithoutCloning ? element : element.cloneNode(true);
      element.didInsertWithoutCloning = true;
      container.appendChild(styleElement);
    }

    if (!isStyleInsertionPatched) {
      var head = document.getElementsByTagName('head')[0];

      if (head) {
        var originalAppendChild = head.appendChild;

        head.appendChild = function (child) {
          if (isNotebookStyleElement(child, domains)) {
            insertedStyles.push(child);
            styleInsertionCallbacks.forEach(function (callback) {
              callback(child);
            });
          } else {
            originalAppendChild.call(this, child);
          }
        };
      }

      isStyleInsertionPatched = true;
    }

    insertedStyles.forEach(function (existingStyle) {
      callback(existingStyle);
    });
    styleInsertionCallbacks.push(callback);
    var index = styleInsertionCallbacks.length - 1;
    return function () {
      styleInsertionCallbacks.splice(index, 1);
    };
  }

  function getNotebookData(url) {
    var _split = split(url, ['/obj/', '/objects/']),
        domain = _split[0],
        remainingPaths = _split[1];

    if (!domain || !remainingPaths) {
      throw new Error('InvalidCloudObjectURL');
    }

    var path = remainingPaths.split('?', 1)[0];

    if (!path) {
      throw new Error('InvalidCloudObjectURL');
    }

    var embeddingAPI = domain + '/notebooks/embedding?path=' + path;
    return new Promise$2(function (resolve, reject) {
      var req = new XMLHttpRequest();
      req.addEventListener('load', function () {
        if (req.status === 200) {
          var text = req.responseText;
          var data = JSON.parse(text);
          resolve({
            notebookID: data.notebookID,
            mainScript: domain + data.mainScript,
            otherScripts: (data.otherScripts || []).map(function (script) {
              return domain + script;
            }),
            stylesheetDomains: [domain].concat(data.stylesheetDomains)
          });
        } else {
          reject(new Error('ResolveError'));
        }
      });
      req.addEventListener('error', function () {
        reject(new Error('RequestError'));
      });
      req.addEventListener('abort', function () {
        reject(new Error('RequestAborted'));
      });
      req.open('GET', embeddingAPI);
      req.send();
    });
  }

  function defaultValue(value, fallback) {
    if (value === undefined) {
      return fallback;
    } else {
      return value;
    }
  }

  function embed(url, node, options) {
    var theNotebookID;
    var theOptions = options || {};
    var _theOptions$useShadow = theOptions.useShadowDOM,
        useShadowDOM = _theOptions$useShadow === void 0 ? false : _theOptions$useShadow;
    var useShadow = useShadowDOM && node.attachShadow;
    var container;
    var shadowRoot;
    var containerNodes = [node];
    var cleanupHandlers = [];

    function onContainerDimensionsChange(_ref) {
      var width = _ref.width,
          height = _ref.height;
      containerNodes.forEach(function (containerNode) {
        if (width != null) {
          containerNode.style.width = width + "px";
        }

        if (height != null) {
          containerNode.style.height = height + "px";
        }
      });
    }

    return Promise$2.resolve().then(function () {
      if (useShadow) {
        var shadowHost = document.createElement('div');
        shadowHost.style.width = '100%';
        shadowHost.style.height = '100%';
        shadowRoot = shadowHost.attachShadow({
          mode: 'open'
        });
        container = document.createElement('div');
        container.style.width = '100%';
        container.style.height = '100%';
        node.appendChild(shadowHost);
        Object.defineProperty(container, 'ownerDocument', {
          value: shadowRoot
        });

        shadowRoot.createElement = function () {
          var _document;

          return (_document = document).createElement.apply(_document, arguments);
        };

        shadowRoot.createElementNS = function () {
          var _document2;

          return (_document2 = document).createElementNS.apply(_document2, arguments);
        };

        shadowRoot.createTextNode = function () {
          var _document3;

          return (_document3 = document).createTextNode.apply(_document3, arguments);
        };

        shadowRoot.createDocumentFragment = function () {
          var _document4;

          return (_document4 = document).createDocumentFragment.apply(_document4, arguments);
        };

        shadowRoot.documentElement = container;
        shadowRoot.defaultView = window;
        containerNodes.push(shadowHost);
        containerNodes.push(container);
        shadowRoot.appendChild(container);
      } else {
        container = node;
      }

      return getNotebookData(url);
    }).then(function (_ref2) {
      var notebookID = _ref2.notebookID,
          mainScript = _ref2.mainScript,
          otherScripts = _ref2.otherScripts,
          stylesheetDomains = _ref2.stylesheetDomains;

      if (useShadow) {
        var cleanup = patchShadowStyleInsertion(shadowRoot, stylesheetDomains);
        cleanupHandlers.push(cleanup);
      }

      theNotebookID = notebookID;

      for (var i = 0; i < otherScripts.length; ++i) {
        installScript(otherScripts[i]);
      }

      return loadLibrary(mainScript);
    }).then(function (lib) {
      return lib.embed(theNotebookID, container, {
        width: defaultValue(theOptions.width, null),
        maxHeight: defaultValue(theOptions.maxHeight, Infinity),
        allowInteract: defaultValue(theOptions.allowInteract, true),
        showRenderProgress: defaultValue(theOptions.showRenderProgress, true),
        onContainerDimensionsChange: onContainerDimensionsChange
      });
    }).then(function (embedding) {
      return _extends({}, embedding, {
        detach: function detach() {
          embedding.detach();
          cleanupHandlers.forEach(function (cleanup) {
            cleanup();
          });
        },
        setAttributes: function setAttributes(attrs) {
          var width = attrs.width,
              maxHeight = attrs.maxHeight,
              allowInteract = attrs.allowInteract,
              showRenderProgress = attrs.showRenderProgress;
          embedding.setAttributes({
            width: width,
            maxHeight: maxHeight,
            allowInteract: allowInteract,
            showRenderProgress: showRenderProgress
          });
        }
      });
    });
  }

  exports.embed = embed;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=wolfram-notebook-embedder.js.map
