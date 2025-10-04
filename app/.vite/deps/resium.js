import {
  require_react_dom
} from "./chunk-JK2DCYAP.js";
import {
  require_react
} from "./chunk-2QD4QDCM.js";
import {
  BillboardCollection_default,
  BillboardGraphics_default,
  BoxGraphics_default,
  Cesium3DTilesetGraphics_default,
  Cesium3DTileset_default,
  CesiumWidget_default,
  ClassificationPrimitive_default,
  CloudCollection_default,
  CorridorGraphics_default,
  CustomDataSource_default,
  CylinderGraphics_default,
  CzmlDataSource_default,
  EllipseGraphics_default,
  EllipsoidGraphics_default,
  Entity_default,
  Event_default,
  Fog_default,
  GeoJsonDataSource_default,
  GroundPolylinePrimitive_default,
  GroundPrimitive_default,
  ImageryLayer_default,
  KmlDataSource_default,
  LabelCollection_default,
  LabelGraphics_default,
  ModelGraphics_default,
  Model_default,
  Moon_default,
  ParticleSystem_default,
  PathGraphics_default,
  PlaneGraphics_default,
  PointGraphics_default,
  PointPrimitiveCollection_default,
  PolygonGraphics_default,
  PolylineCollection_default,
  PolylineGraphics_default,
  PolylineVolumeGraphics_default,
  PostProcessStageComposite_default,
  PostProcessStageLibrary_default,
  PostProcessStage_default,
  Primitive_default,
  RectangleGraphics_default,
  SceneMode_default,
  ScreenSpaceEventHandler_default,
  ScreenSpaceEventType_default,
  Sun_default,
  TimeDynamicPointCloud_default,
  Viewer_default,
  WallGraphics_default
} from "./chunk-54Z2MEYA.js";
import {
  __toESM
} from "./chunk-7D4SUZUM.js";

// node_modules/resium/dist/resium.mjs
var import_react = __toESM(require_react(), 1);
var import_react_dom = __toESM(require_react_dom(), 1);
var ni = Object.defineProperty;
var ti = (i, e, n) => e in i ? ni(i, e, { enumerable: true, configurable: true, writable: true, value: n }) : i[e] = n;
var Y = (i, e, n) => ti(i, typeof e != "symbol" ? e + "" : e, n);
var ke = (0, import_react.createContext)({});
var { Provider: Do, Consumer: Zi } = ke;
var we = () => (0, import_react.useContext)(ke) || {};
var Se = (i, e) => {
  const n = (o) => {
    const r = we(), s = (0, import_react.useRef)(void 0), u = (0, import_react.useRef)(false);
    return (0, import_react.useEffect)(() => () => {
      r.camera && o.cancelFlightOnUnmount && r.camera.cancelFlight();
    }, [r.camera, o.cancelFlightOnUnmount]), (0, import_react.useEffect)(() => {
      r.camera && r.scene && !r.scene.isDestroyed() && (!o.once || !u.current) && (r.camera.cancelFlight(), e(r.camera, o, s.current), u.current = true), s.current = o;
    }), null;
  };
  return n.displayName = i, n;
};
var Ce = { exports: {} };
var ye = {};
var ze;
function Qi() {
  return ze || (ze = 1, (function() {
    function i(t) {
      if (t == null) return null;
      if (typeof t == "function")
        return t.$$typeof === $ ? null : t.displayName || t.name || null;
      if (typeof t == "string") return t;
      switch (t) {
        case X:
          return "Fragment";
        case ae:
          return "Portal";
        case ce:
          return "Profiler";
        case Q:
          return "StrictMode";
        case ie:
          return "Suspense";
        case ne:
          return "SuspenseList";
      }
      if (typeof t == "object")
        switch (typeof t.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), t.$$typeof) {
          case H:
            return (t.displayName || "Context") + ".Provider";
          case W:
            return (t._context.displayName || "Context") + ".Consumer";
          case ee:
            var c = t.render;
            return t = t.displayName, t || (t = c.displayName || c.name || "", t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"), t;
          case te:
            return c = t.displayName || null, c !== null ? c : i(t.type) || "Memo";
          case P:
            c = t._payload, t = t._init;
            try {
              return i(t(c));
            } catch {
            }
        }
      return null;
    }
    function e(t) {
      return "" + t;
    }
    function n(t) {
      try {
        e(t);
        var c = false;
      } catch {
        c = true;
      }
      if (c) {
        c = console;
        var l = c.error, h = typeof Symbol == "function" && Symbol.toStringTag && t[Symbol.toStringTag] || t.constructor.name || "Object";
        return l.call(
          c,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          h
        ), e(t);
      }
    }
    function o() {
    }
    function r() {
      if (I === 0) {
        z = console.log, le = console.info, x = console.warn, Le = console.error, Oe = console.group, Ae = console.groupCollapsed, _e = console.groupEnd;
        var t = {
          configurable: true,
          enumerable: true,
          value: o,
          writable: true
        };
        Object.defineProperties(console, {
          info: t,
          log: t,
          warn: t,
          error: t,
          group: t,
          groupCollapsed: t,
          groupEnd: t
        });
      }
      I++;
    }
    function s() {
      if (I--, I === 0) {
        var t = { configurable: true, enumerable: true, writable: true };
        Object.defineProperties(console, {
          log: k({}, t, { value: z }),
          info: k({}, t, { value: le }),
          warn: k({}, t, { value: x }),
          error: k({}, t, { value: Le }),
          group: k({}, t, { value: Oe }),
          groupCollapsed: k({}, t, { value: Ae }),
          groupEnd: k({}, t, { value: _e })
        });
      }
      0 > I && console.error(
        "disabledDepth fell below zero. This is a bug in React. Please file an issue."
      );
    }
    function u(t) {
      if (be === void 0)
        try {
          throw Error();
        } catch (l) {
          var c = l.stack.trim().match(/\n( *(at )?)/);
          be = c && c[1] || "", Be = -1 < l.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < l.stack.indexOf("@") ? "@unknown:0:0" : "";
        }
      return `
` + be + t + Be;
    }
    function f(t, c) {
      if (!t || De) return "";
      var l = Re.get(t);
      if (l !== void 0) return l;
      De = true, l = Error.prepareStackTrace, Error.prepareStackTrace = void 0;
      var h = null;
      h = D.H, D.H = null, r();
      try {
        var R = {
          DetermineComponentFrameRoot: function() {
            try {
              if (c) {
                var q = function() {
                  throw Error();
                };
                if (Object.defineProperty(q.prototype, "props", {
                  set: function() {
                    throw Error();
                  }
                }), typeof Reflect == "object" && Reflect.construct) {
                  try {
                    Reflect.construct(q, []);
                  } catch (N) {
                    var pe = N;
                  }
                  Reflect.construct(t, [], q);
                } else {
                  try {
                    q.call();
                  } catch (N) {
                    pe = N;
                  }
                  t.call(q.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (N) {
                  pe = N;
                }
                (q = t()) && typeof q.catch == "function" && q.catch(function() {
                });
              }
            } catch (N) {
              if (N && pe && typeof N.stack == "string")
                return [N.stack, pe.stack];
            }
            return [null, null];
          }
        };
        R.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
        var v = Object.getOwnPropertyDescriptor(
          R.DetermineComponentFrameRoot,
          "name"
        );
        v && v.configurable && Object.defineProperty(
          R.DetermineComponentFrameRoot,
          "name",
          { value: "DetermineComponentFrameRoot" }
        );
        var d = R.DetermineComponentFrameRoot(), j = d[0], ue = d[1];
        if (j && ue) {
          var T = j.split(`
`), re = ue.split(`
`);
          for (d = v = 0; v < T.length && !T[v].includes(
            "DetermineComponentFrameRoot"
          ); )
            v++;
          for (; d < re.length && !re[d].includes(
            "DetermineComponentFrameRoot"
          ); )
            d++;
          if (v === T.length || d === re.length)
            for (v = T.length - 1, d = re.length - 1; 1 <= v && 0 <= d && T[v] !== re[d]; )
              d--;
          for (; 1 <= v && 0 <= d; v--, d--)
            if (T[v] !== re[d]) {
              if (v !== 1 || d !== 1)
                do
                  if (v--, d--, 0 > d || T[v] !== re[d]) {
                    var fe = `
` + T[v].replace(
                      " at new ",
                      " at "
                    );
                    return t.displayName && fe.includes("<anonymous>") && (fe = fe.replace("<anonymous>", t.displayName)), typeof t == "function" && Re.set(t, fe), fe;
                  }
                while (1 <= v && 0 <= d);
              break;
            }
        }
      } finally {
        De = false, D.H = h, s(), Error.prepareStackTrace = l;
      }
      return T = (T = t ? t.displayName || t.name : "") ? u(T) : "", typeof t == "function" && Re.set(t, T), T;
    }
    function m(t) {
      if (t == null) return "";
      if (typeof t == "function") {
        var c = t.prototype;
        return f(
          t,
          !(!c || !c.isReactComponent)
        );
      }
      if (typeof t == "string") return u(t);
      switch (t) {
        case ie:
          return u("Suspense");
        case ne:
          return u("SuspenseList");
      }
      if (typeof t == "object")
        switch (t.$$typeof) {
          case ee:
            return t = f(t.render, false), t;
          case te:
            return m(t.type);
          case P:
            c = t._payload, t = t._init;
            try {
              return m(t(c));
            } catch {
            }
        }
      return "";
    }
    function p() {
      var t = D.A;
      return t === null ? null : t.getOwner();
    }
    function C(t) {
      if (M.call(t, "key")) {
        var c = Object.getOwnPropertyDescriptor(t, "key").get;
        if (c && c.isReactWarning) return false;
      }
      return t.key !== void 0;
    }
    function O(t, c) {
      function l() {
        Ge || (Ge = true, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          c
        ));
      }
      l.isReactWarning = true, Object.defineProperty(t, "key", {
        get: l,
        configurable: true
      });
    }
    function B() {
      var t = i(this.type);
      return We[t] || (We[t] = true, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), t = this.props.ref, t !== void 0 ? t : null;
    }
    function y(t, c, l, h, R, v) {
      return l = v.ref, t = {
        $$typeof: se,
        type: t,
        key: c,
        props: v,
        _owner: R
      }, (l !== void 0 ? l : null) !== null ? Object.defineProperty(t, "ref", {
        enumerable: false,
        get: B
      }) : Object.defineProperty(t, "ref", { enumerable: false, value: null }), t._store = {}, Object.defineProperty(t._store, "validated", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: 0
      }), Object.defineProperty(t, "_debugInfo", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: null
      }), Object.freeze && (Object.freeze(t.props), Object.freeze(t)), t;
    }
    function S(t, c, l, h, R, v) {
      if (typeof t == "string" || typeof t == "function" || t === X || t === ce || t === Q || t === ie || t === ne || t === w || typeof t == "object" && t !== null && (t.$$typeof === P || t.$$typeof === te || t.$$typeof === H || t.$$typeof === W || t.$$typeof === ee || t.$$typeof === oe || t.getModuleId !== void 0)) {
        var d = c.children;
        if (d !== void 0)
          if (h)
            if (g(d)) {
              for (h = 0; h < d.length; h++)
                U(d[h], t);
              Object.freeze && Object.freeze(d);
            } else
              console.error(
                "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
              );
          else U(d, t);
      } else
        d = "", (t === void 0 || typeof t == "object" && t !== null && Object.keys(t).length === 0) && (d += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports."), t === null ? h = "null" : g(t) ? h = "array" : t !== void 0 && t.$$typeof === se ? (h = "<" + (i(t.type) || "Unknown") + " />", d = " Did you accidentally export a JSX literal instead of a component?") : h = typeof t, console.error(
          "React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s",
          h,
          d
        );
      if (M.call(c, "key")) {
        d = i(t);
        var j = Object.keys(c).filter(function(T) {
          return T !== "key";
        });
        h = 0 < j.length ? "{key: someKey, " + j.join(": ..., ") + ": ...}" : "{key: someKey}", Fe[d + h] || (j = 0 < j.length ? "{" + j.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          h,
          d,
          j,
          d
        ), Fe[d + h] = true);
      }
      if (d = null, l !== void 0 && (n(l), d = "" + l), C(c) && (n(c.key), d = "" + c.key), "key" in c) {
        l = {};
        for (var ue in c)
          ue !== "key" && (l[ue] = c[ue]);
      } else l = c;
      return d && O(
        l,
        typeof t == "function" ? t.displayName || t.name || "Unknown" : t
      ), y(t, d, v, R, p(), l);
    }
    function U(t, c) {
      if (typeof t == "object" && t && t.$$typeof !== ii) {
        if (g(t))
          for (var l = 0; l < t.length; l++) {
            var h = t[l];
            V(h) && A(h, c);
          }
        else if (V(t))
          t._store && (t._store.validated = 1);
        else if (t === null || typeof t != "object" ? l = null : (l = b && t[b] || t["@@iterator"], l = typeof l == "function" ? l : null), typeof l == "function" && l !== t.entries && (l = l.call(t), l !== t))
          for (; !(t = l.next()).done; )
            V(t.value) && A(t.value, c);
      }
    }
    function V(t) {
      return typeof t == "object" && t !== null && t.$$typeof === se;
    }
    function A(t, c) {
      if (t._store && !t._store.validated && t.key == null && (t._store.validated = 1, c = G(c), !Ue[c])) {
        Ue[c] = true;
        var l = "";
        t && t._owner != null && t._owner !== p() && (l = null, typeof t._owner.tag == "number" ? l = i(t._owner.type) : typeof t._owner.name == "string" && (l = t._owner.name), l = " It was passed a child from " + l + ".");
        var h = D.getCurrentStack;
        D.getCurrentStack = function() {
          var R = m(t.type);
          return h && (R += h() || ""), R;
        }, console.error(
          'Each child in a list should have a unique "key" prop.%s%s See https://react.dev/link/warning-keys for more information.',
          c,
          l
        ), D.getCurrentStack = h;
      }
    }
    function G(t) {
      var c = "", l = p();
      return l && (l = i(l.type)) && (c = `

Check the render method of \`` + l + "`."), c || (t = i(t)) && (c = `

Check the top-level render call using <` + t + ">."), c;
    }
    var Z = import_react.default, se = Symbol.for("react.transitional.element"), ae = Symbol.for("react.portal"), X = Symbol.for("react.fragment"), Q = Symbol.for("react.strict_mode"), ce = Symbol.for("react.profiler"), W = Symbol.for("react.consumer"), H = Symbol.for("react.context"), ee = Symbol.for("react.forward_ref"), ie = Symbol.for("react.suspense"), ne = Symbol.for("react.suspense_list"), te = Symbol.for("react.memo"), P = Symbol.for("react.lazy"), w = Symbol.for("react.offscreen"), b = Symbol.iterator, $ = Symbol.for("react.client.reference"), D = Z.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, M = Object.prototype.hasOwnProperty, k = Object.assign, oe = Symbol.for("react.client.reference"), g = Array.isArray, I = 0, z, le, x, Le, Oe, Ae, _e;
    o.__reactDisabledLog = true;
    var be, Be, De = false, Re = new (typeof WeakMap == "function" ? WeakMap : Map)(), ii = Symbol.for("react.client.reference"), Ge, We = {}, Fe = {}, Ue = {};
    ye.Fragment = X, ye.jsx = function(t, c, l, h, R) {
      return S(t, c, l, false, h, R);
    }, ye.jsxs = function(t, c, l, h, R) {
      return S(t, c, l, true, h, R);
    };
  })()), ye;
}
var xe;
function en() {
  return xe || (xe = 1, false ? Ce.exports = Xi() : Ce.exports = Qi()), Ce.exports;
}
var F = en();
function nn(i, e) {
  return e ? Te(i).reduce(
    (n, [o, r]) => (ge(e, o) && (n[o] = r), n),
    {}
  ) : {};
}
function Te(i) {
  return Object.keys(i).map((e) => [e, i[e]]);
}
function ge(i, e) {
  return !!i && i.indexOf(e) !== -1;
}
function tn(i, e) {
  return !!i && !!e && [...Object.keys(i), ...Object.keys(e)].every((n) => i[n] === e[n]);
}
function on(i) {
  return i && typeof i.isDestroyed == "function" && typeof i.destroy == "function";
}
function rn(i) {
  return on(i) && i.isDestroyed();
}
function K(i) {
  return i && typeof i == "object" && "then" in i && typeof i.then == "function";
}
var de = "__RESIUM_EVENT_MANAGER";
var $e = [
  "onClick",
  "onDoubleClick",
  "onMouseDown",
  "onMouseUp",
  "onMiddleClick",
  "onMiddleDown",
  "onMiddleUp",
  "onMouseMove",
  "onPinchEnd",
  "onPinchMove",
  "onPinchStart",
  "onRightClick",
  "onRightDown",
  "onRightUp",
  "onWheel",
  "onMouseEnter",
  "onMouseLeave"
];
var Ee = class Ee2 {
  constructor(e) {
    Y(this, "scene");
    Y(this, "sshe");
    Y(this, "events", {
      onClick: /* @__PURE__ */ new Map(),
      onDoubleClick: /* @__PURE__ */ new Map(),
      onMouseDown: /* @__PURE__ */ new Map(),
      onMouseUp: /* @__PURE__ */ new Map(),
      onMiddleClick: /* @__PURE__ */ new Map(),
      onMiddleDown: /* @__PURE__ */ new Map(),
      onMiddleUp: /* @__PURE__ */ new Map(),
      onMouseMove: /* @__PURE__ */ new Map(),
      onPinchEnd: /* @__PURE__ */ new Map(),
      onPinchMove: /* @__PURE__ */ new Map(),
      onPinchStart: /* @__PURE__ */ new Map(),
      onRightClick: /* @__PURE__ */ new Map(),
      onRightDown: /* @__PURE__ */ new Map(),
      onRightUp: /* @__PURE__ */ new Map(),
      onWheel: /* @__PURE__ */ new Map(),
      onMouseEnter: /* @__PURE__ */ new Map(),
      onMouseLeave: /* @__PURE__ */ new Map()
    });
    Y(this, "hovered");
    Y(this, "onMouseMove", (e2) => {
      var o, r, s, u, f, m;
      const n = this.pick(e2.endPosition);
      this.hovered !== n && (this.hovered && ((o = this.getEventCallback("onMouseLeave", this.hovered)) == null || o(e2, this.hovered), (r = this.getEventCallback("onMouseLeave", null)) == null || r(e2, this.hovered)), n && ((s = this.getEventCallback("onMouseEnter", n)) == null || s(e2, n), (u = this.getEventCallback("onMouseEnter", null)) == null || u(e2, n))), n && ((f = this.getEventCallback("onMouseMove", n)) == null || f(e2, n)), (m = this.getEventCallback("onMouseMove", null)) == null || m(e2, n), this.hovered = n;
    });
    Y(this, "eventCallback", (e2) => (n) => {
      var r, s;
      const o = this.pick(n == null ? void 0 : n.position);
      o && ((r = this.getEventCallback(e2, o)) == null || r(n, o)), (s = this.getEventCallback(e2, null)) == null || s(n, o);
    });
    this.scene = e, this.sshe = new ScreenSpaceEventHandler_default(e == null ? void 0 : e.canvas);
  }
  destroy() {
    this.hovered = void 0, this.sshe.isDestroyed() || this.sshe.destroy();
  }
  isDestroyed() {
    return this.sshe.isDestroyed();
  }
  on(e, n, o) {
    e && n === "onWheel" || this.events[n].set(e, o);
  }
  off(e, n) {
    this.events[n].delete(e), this.hovered === e && (this.hovered = void 0);
  }
  setEvents(e, n) {
    Te(n).forEach(([o, r]) => {
      const s = o;
      ge($e, s) && (r ? this.on(e, s, r) : this.off(e, s));
    }), this.commit();
  }
  clearEvents(e) {
    this.hovered = void 0, $e.forEach((n) => {
      this.off(e, n);
    }), this.commit();
  }
  commit() {
    const e = this.sshe, n = this.sshe.isDestroyed();
    n || (this.events.onMouseEnter.size === 0 && this.events.onMouseLeave.size === 0 && this.events.onMouseMove.size === 0 ? this.sshe.removeInputAction(ScreenSpaceEventType_default.MOUSE_MOVE) : this.sshe.getInputAction(ScreenSpaceEventType_default.MOUSE_MOVE) || this.sshe.setInputAction(this.onMouseMove, ScreenSpaceEventType_default.MOUSE_MOVE)), Te(this.events).forEach(([o, r]) => {
      if (o === "onMouseEnter" || o === "onMouseLeave" || o === "onMouseMove")
        return;
      const s = Ee2.eventTypeMap[o];
      n || (r.size === 0 ? e.removeInputAction(s) : e.getInputAction(s) || e.setInputAction(this.eventCallback(o), s));
    });
  }
  getScreenSpaceEventHandler() {
    return this.sshe;
  }
  getEventCallback(e, n) {
    var o, r;
    return n === null ? this.events[e].get(null) : this.events[e].get(n.id) || // Entity
    this.events[e].get((r = (o = n.id) == null ? void 0 : o.entityCollection) == null ? void 0 : r.owner) || // Entity in DataSource
    this.events[e].get(n.primitive) || // Primitive
    this.events[e].get(n.tileset);
  }
  pick(e) {
    var n;
    if (e)
      return (n = this.scene) == null ? void 0 : n.pick(e);
  }
};
Y(Ee, "eventTypeMap", {
  onClick: ScreenSpaceEventType_default.LEFT_CLICK,
  onDoubleClick: ScreenSpaceEventType_default.LEFT_DOUBLE_CLICK,
  onMouseDown: ScreenSpaceEventType_default.LEFT_DOWN,
  onMouseUp: ScreenSpaceEventType_default.LEFT_UP,
  onMiddleClick: ScreenSpaceEventType_default.MIDDLE_CLICK,
  onMiddleDown: ScreenSpaceEventType_default.MIDDLE_DOWN,
  onMiddleUp: ScreenSpaceEventType_default.MIDDLE_UP,
  onMouseMove: ScreenSpaceEventType_default.MOUSE_MOVE,
  onPinchEnd: ScreenSpaceEventType_default.PINCH_END,
  onPinchMove: ScreenSpaceEventType_default.PINCH_MOVE,
  onPinchStart: ScreenSpaceEventType_default.PINCH_START,
  onRightClick: ScreenSpaceEventType_default.RIGHT_CLICK,
  onRightDown: ScreenSpaceEventType_default.RIGHT_DOWN,
  onRightUp: ScreenSpaceEventType_default.RIGHT_UP,
  onWheel: ScreenSpaceEventType_default.WHEEL,
  onMouseEnter: ScreenSpaceEventType_default.MOUSE_MOVE,
  onMouseLeave: ScreenSpaceEventType_default.MOUSE_MOVE
});
var Pe = Ee;
var sn = ({
  name: i,
  create: e,
  destroy: n,
  provide: o,
  update: r,
  cesiumReadonlyProps: s,
  cesiumEventProps: u,
  otherProps: f,
  setCesiumPropsAfterCreate: m,
  useCommonEvent: p,
  useRootEvent: C
}, O, B) => {
  const y = (0, import_react.useRef)(void 0), S = we(), U = (0, import_react.useRef)(o ? {} : void 0), V = (0, import_react.useRef)({}), A = (0, import_react.useRef)(qe(O)), G = (0, import_react.useRef)({}), [Z, se] = (0, import_react.useState)(false), ae = (0, import_react.useRef)(false), X = (0, import_react.useRef)(null), Q = (0, import_react.useRef)(void 0), ce = S == null ? void 0 : S[de], W = (0, import_react.useRef)(void 0), H = (0, import_react.useRef)(void 0), ee = (0, import_react.useCallback)(
    async (P) => {
      var oe;
      if (!y.current) return;
      const w = y.current, b = Object.keys(P), $ = Object.keys(u || []), D = b.concat(
        Object.keys(G.current).filter((g) => !b.includes(g))
      ).filter((g) => G.current[g] !== P[g]).map((g) => [g, G.current[g], P[g]]), M = [];
      for (const [g, I, z] of D)
        if (s != null && s.includes(g))
          M.push(g);
        else if (ge($, g)) {
          const le = u == null ? void 0 : u[g], x = w[le];
          x instanceof Event_default && (typeof I > "u" ? (x.addEventListener(z), V.current[le] = z) : typeof z > "u" ? (x.removeEventListener(I), delete V.current[le]) : (x.removeEventListener(I), x.addEventListener(z)));
        } else g !== "children" && !$e.includes(g) && !(f != null && f.includes(g)) && (w[g] = z);
      const k = C ? (oe = U.current) == null ? void 0 : oe[de] : ce;
      if (p && k && y.current && k.setEvents(C ? null : y.current, P), r && ae.current) {
        const g = r(y.current, P, G.current, S);
        K(g) && await g;
      }
      G.current = P, A.current = P, ae.current && M.length > 0 && (console.warn(
        `Warning: <${i}> is recreated because following read-only props have been updated: ${M.join(
          ", "
        )}`
      ), ne(), await te(), W.current = ie());
    },
    []
    // eslint-disable-line react-hooks/exhaustive-deps
  ), ie = (0, import_react.useCallback)(async () => {
    var $;
    await new Promise((D) => queueMicrotask(() => D(void 0)));
    const P = e == null ? void 0 : e(S, A.current, X.current);
    let w;
    if (K(P) ? w = await P : w = P, Array.isArray(w) ? (y.current = w[0], Q.current = w[1]) : y.current = w, m)
      await ee(A.current);
    else {
      if (y.current && u) {
        const D = y.current;
        for (const M of Object.keys(A.current)) {
          const k = u[M];
          if (k) {
            const oe = A.current[M], g = D[k];
            oe && g instanceof Event_default && g.addEventListener(oe);
          }
        }
      }
      G.current = A.current;
    }
    o && y.current && (U.current = {
      ...S,
      ...o(y.current, S, O, Q.current)
    });
    const b = C ? ($ = U.current) == null ? void 0 : $[de] : ce;
    p && b && y.current && b.setEvents(C ? null : y.current, A.current), H.current || se(true);
  }, []), ne = (0, import_react.useCallback)(() => {
    se(false), ae.current = false;
  }, []), te = (0, import_react.useCallback)(async () => {
    var w, b;
    await new Promise(($) => queueMicrotask(() => $(void 0))), W.current && (await W.current, W.current = void 0), y.current && n && n(y.current, S, X.current, Q.current);
    const P = C ? (w = U.current) == null ? void 0 : w[de] : ce;
    if (p && P && y.current && P.clearEvents(C ? null : y.current), y.current && !rn(y.current)) {
      const $ = Object.keys(V.current);
      for (const D of $) {
        const M = y.current[D];
        (b = M == null ? void 0 : M.removeEventListener) == null || b.call(M, V.current[D]);
      }
    }
    V.current = {}, U.current = void 0, Q.current = void 0, y.current = void 0;
  }, []);
  return (0, import_react.useLayoutEffect)(() => ((async () => {
    H.current && (await H.current, H.current = void 0), W.current = ie();
  })(), () => {
    ne(), H.current = te();
  }), [ie, te, ne]), (0, import_react.useEffect)(() => {
    (async () => {
      var b, $;
      W.current && await W.current;
      const w = qe(O);
      Z ? tn(w, G.current) || (await ee(w), ($ = (b = S.__$internal) == null ? void 0 : b.onUpdate) == null || $.call(b)) : (G.current = w, A.current = w, ae.current = true);
    })();
  }, [S.__$internal, Z, O, ee]), (0, import_react.useImperativeHandle)(
    B,
    () => ({
      cesiumElement: Z ? y.current : null
    }),
    [Z]
  ), [U.current, Z, X];
};
function qe(i) {
  const { children: e, ...n } = i;
  return n;
}
var a = ({
  renderContainer: i,
  noChildren: e,
  containerProps: n,
  defaultProps: o,
  ...r
}) => {
  const s = (u, f) => {
    const m = {
      ...o,
      ...u
    }, [p, C, O] = sn(
      r,
      m,
      f
    );
    if (e) return null;
    const B = C && "children" in m ? m.children : null, y = i ? F.jsx(
      "div",
      {
        "data-testid": "resium-container",
        ref: O,
        ...typeof n == "function" ? n(m) : nn(m, n),
        children: B
      }
    ) : B ? F.jsx(F.Fragment, { children: B }) : null;
    return p ? F.jsx(ke.Provider, { value: p, children: y }) : y;
  };
  return s.displayName = r.name, (0, import_react.forwardRef)(s);
};
var an = ["enabled", "selected"];
var _ = (i) => a({
  name: i.name,
  create(e, n) {
    if (!e.scene) return;
    const o = i.create(n, e.scene.postProcessStages);
    return typeof n.enabled == "boolean" && (o.enabled = n.enabled), n.selected && "selected" in o && (o.selected = n.selected), i.props.forEach((r) => {
      !ge(i.readonlyProps, r) && typeof n[r] < "u" && (o.uniforms[r] = n[r]);
    }), !i.noMount && e.scene && !e.scene.isDestroyed() && e.scene.postProcessStages.add(o), o;
  },
  destroy(e, n) {
    i.noMount ? e.enabled = false : (n.scene && !n.scene.isDestroyed() && n.scene.postProcessStages.remove(e), e.isDestroyed() || e.destroy());
  },
  update(e, n, o) {
    i.props.forEach((r) => {
      !ge(i.readonlyProps, r) && n[r] !== o[r] && (e.uniforms[r] = n[r]);
    });
  },
  cesiumProps: an,
  cesiumReadonlyProps: i.readonlyProps,
  defaultProps: {
    enabled: true
  }
});
var Ro = (i) => (
  // supports both functional components and class components
  // eslint-disable-next-line react/display-name
  (0, import_react.forwardRef)((e, n) => F.jsx(Zi, { children: (o) => F.jsx(i, { ...e, ref: n, cesium: o }) }))
);
var cn = [
  "alignedAxis",
  "color",
  "disableDepthTestDistance",
  "distanceDisplayCondition",
  "eyeOffset",
  "height",
  "heightReference",
  "horizontalOrigin",
  "image",
  "pixelOffset",
  "splitDirection",
  "pixelOffsetScaleByDistance",
  "position",
  "rotation",
  "scale",
  "scaleByDistance",
  "show",
  "sizeInMeters",
  "translucencyByDistance",
  "verticalOrigin",
  "width",
  "id"
];
var Mo = a({
  name: "Billboard",
  create(i, e) {
    var n;
    return (n = i.billboardCollection) == null ? void 0 : n.add(e);
  },
  destroy(i, e) {
    e.billboardCollection && !e.billboardCollection.isDestroyed() && e.billboardCollection.remove(i);
  },
  cesiumProps: cn,
  useCommonEvent: true
});
var ln = [
  "blendOption",
  "debugShowBoundingVolume",
  "debugShowTextureAtlas",
  "modelMatrix",
  "show"
];
var To = a({
  name: "BillboardCollection",
  create(i, e) {
    if (!i.primitiveCollection) return;
    const n = new BillboardCollection_default({
      modelMatrix: e.modelMatrix,
      debugShowBoundingVolume: e.debugShowBoundingVolume,
      scene: i.scene,
      blendOption: e.blendOption
    });
    return i.primitiveCollection.add(n), n;
  },
  destroy(i, e) {
    e.primitiveCollection && !e.primitiveCollection.isDestroyed() && e.primitiveCollection.remove(i), i.isDestroyed() || i.destroy();
  },
  provide(i) {
    return {
      billboardCollection: i
    };
  },
  cesiumProps: ln
});
var un = [
  "image",
  "show",
  "scale",
  "horizontalOrigin",
  "verticalOrigin",
  "eyeOffset",
  "pixelOffset",
  "rotation",
  "alignedAxis",
  "splitDirection",
  "width",
  "height",
  "color",
  "scaleByDistance",
  "translucencyByDistance",
  "pixelOffsetScaleByDistance",
  "imageSubRegion",
  "sizeInMeters",
  "heightReference",
  "distanceDisplayCondition",
  "disableDepthTestDistance"
];
var dn = {
  onDefinitionChange: "definitionChanged"
};
var $o = a({
  name: "BillboardGraphics",
  create(i, e) {
    if (!i.entity) return;
    const n = new BillboardGraphics_default(e);
    return i.entity.billboard = n, n;
  },
  destroy(i, e) {
    e.entity && (e.entity.billboard = void 0);
  },
  cesiumProps: un,
  cesiumEventProps: dn
});
var mn = [
  "heightReference",
  "dimensions",
  "show",
  "fill",
  "material",
  "outline",
  "outlineColor",
  "outlineWidth",
  "shadows",
  "distanceDisplayCondition"
];
var fn = {
  onDefinitionChange: "definitionChanged"
};
var ko = a({
  name: "BoxGraphics",
  create(i, e) {
    if (!i.entity) return;
    const n = new BoxGraphics_default(e);
    return i.entity.box = n, n;
  },
  destroy(i, e) {
    e.entity && (e.entity.box = void 0);
  },
  cesiumProps: mn,
  cesiumEventProps: fn
});
var hn = [
  "position",
  "direction",
  "up",
  "right",
  "frustum",
  "defaultMoveAmount",
  "defaultLookAmount",
  "defaultRotateAmount",
  "defaultZoomAmount",
  "constrainedAxis",
  "maximumZoomFactor",
  "percentageChanged"
];
var yn = {
  onChange: "changed",
  onMoveEnd: "moveEnd",
  onMoveStart: "moveStart"
};
var Lo = a({
  name: "Camera",
  create: (i) => {
    var e;
    return (e = i.scene) == null ? void 0 : e.camera;
  },
  cesiumProps: hn,
  cesiumEventProps: yn,
  setCesiumPropsAfterCreate: true
});
var Oo = Se(
  "CameraFlyHome",
  (i, { duration: e }) => {
    i.flyHome(e);
  }
);
var Ao = Se(
  "CameraFlyTo",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (i, { onComplete: e, onCancel: n, ...o }) => {
    i.flyTo({ ...o, complete: e, cancel: n });
  }
);
var _o = Se(
  "CameraLookAt",
  (i, { target: e, offset: n }) => {
    i.lookAt(e, n);
  }
);
var Bo = Se(
  "CameraFlyToBoundingSphere",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (i, { boundingSphere: e, onComplete: n, onCancel: o, ...r }) => {
    i.flyToBoundingSphere(e, {
      ...r,
      complete: n,
      cancel: o
    });
  }
);
var gn = [
  "show",
  "modelMatrix",
  "shadows",
  "maximumScreenSpaceError",
  "cullRequestsWhileMoving",
  "cullRequestsWhileMovingMultiplier",
  "preloadWhenHidden",
  "preloadFlightDestinations",
  "preferLeaves",
  "progressiveResolutionHeightFraction",
  "foveatedScreenSpaceError",
  "foveatedConeSize",
  "foveatedMinimumScreenSpaceErrorRelaxation",
  "foveatedInterpolationCallback",
  "foveatedTimeDelay",
  "dynamicScreenSpaceError",
  "dynamicScreenSpaceErrorDensity",
  "dynamicScreenSpaceErrorFactor",
  "dynamicScreenSpaceErrorHeightFalloff",
  "skipLevelOfDetail",
  "baseScreenSpaceError",
  "skipScreenSpaceErrorFactor",
  "skipLevels",
  "immediatelyLoadDesiredLevelOfDetail",
  "loadSiblings",
  "clippingPlanes",
  "clippingPolygons",
  "classificationType",
  "ellipsoid",
  "lightColor",
  "colorBlendAmount",
  "colorBlendMode",
  "debugFreezeFrame",
  "debugColorizeTiles",
  "debugWireframe",
  "debugShowBoundingVolume",
  "debugShowContentBoundingVolume",
  "debugShowViewerRequestVolume",
  "debugShowGeometricError",
  "debugShowRenderingStatistics",
  "debugShowMemoryUsage",
  "debugShowUrl",
  "style",
  "backFaceCulling",
  "vectorClassificationOnly",
  "vectorKeepDecodedPositions",
  "splitDirection",
  "customShader",
  "imageBasedLighting",
  "showCreditsOnScreen",
  "featureIdLabel",
  "instanceFeatureIdLabel",
  "imageBasedLighting",
  "outlineColor",
  "cacheBytes",
  "maximumCacheOverflowBytes",
  "enableCollision"
];
var pn = [
  "showOutline",
  "cullWithChildrenBounds",
  "debugHeatmapTilePropertyName",
  "enableDebugWireframe",
  "environmentMapOptions",
  "modelUpAxis",
  "modelForwardAxis",
  "projectTo2D",
  "enableShowOutline",
  "enablePick"
];
var vn = {
  onAllTilesLoad: "allTilesLoaded",
  onInitialTilesLoad: "initialTilesLoaded",
  onLoadProgress: "loadProgress",
  onTileFailed: "tileFailed",
  onTileLoad: "tileLoad",
  onTileUnload: "tileUnload",
  onTileVisible: "tileVisible"
};
var Cn = ["onReady", "onError", "url"];
var Go = a({
  name: "Cesium3DTileset",
  async create(i, e) {
    var s, u;
    if (!i.primitiveCollection) return;
    const n = e.url;
    let o;
    K(n) ? o = await n : o = n;
    let r;
    try {
      r = await Cesium3DTileset_default.fromUrl(o, e), (s = e.onReady) == null || s.call(e, r);
    } catch (f) {
      (u = e.onError) == null || u.call(e, f);
      return;
    }
    return e.colorBlendAmount && (r.colorBlendAmount = e.colorBlendAmount), e.colorBlendMode && (r.colorBlendMode = e.colorBlendMode), e.style && (r.style = e.style), i.primitiveCollection.add(r), r;
  },
  destroy(i, e) {
    e.primitiveCollection && !e.primitiveCollection.isDestroyed() && e.primitiveCollection.remove(i), i.isDestroyed() || i.destroy();
  },
  cesiumProps: gn,
  cesiumReadonlyProps: pn,
  cesiumEventProps: vn,
  otherProps: Cn,
  useCommonEvent: true
});
var Pn = ["show", "uri", "maximumScreenSpaceError"];
var En = {
  onDefinitionChange: "definitionChanged"
};
var Wo = a({
  name: "Cesium3DTilesetGraphics",
  create(i, e) {
    if (!i.entity) return;
    const n = new Cesium3DTilesetGraphics_default(e);
    return i.entity.tileset = n, n;
  },
  destroy(i, e) {
    e.entity && (e.entity.tileset = void 0);
  },
  cesiumProps: Pn,
  cesiumEventProps: En
});
var wn = [
  "resolutionScale",
  "useDefaultRenderLoop",
  "targetFrameRate",
  "useBrowserRecommendedResolution",
  "creditDisplay"
];
var Sn = [
  "clock",
  "baseLayer",
  "terrainProvider",
  "skyBox",
  "skyAtmosphere",
  "sceneMode",
  "scene3DOnly",
  "orderIndependentTranslucency",
  "mapMode2D",
  "mapProjection",
  "globe",
  "showRenderLoopErrors",
  "contextOptions",
  "creditContainer",
  "creditViewport",
  "shadows",
  "terrainShadows",
  "ellipsoid",
  "dataSources",
  "allowDataSourcesToSuspendAnimation",
  "trackedEntity",
  "trackedEntityChanged",
  "clockTrackedDataSource",
  "shouldAnimate",
  "automaticallyTrackDataSourceClocks",
  "terrain",
  "requestRenderMode",
  "maximumRenderTimeChange",
  "msaaSamples",
  "blurActiveElementOnCanvasFocus"
];
var bn = ["className", "id", "style", "full", "containerProps"];
var Fo = a({
  name: "CesiumWidget",
  create(i, e, n) {
    if (!n) return;
    const o = new CesiumWidget_default(n, e);
    if (!o) return;
    typeof e.resolutionScale == "number" && (o.resolutionScale = e.resolutionScale);
    const r = new Pe(o.scene);
    return [o, r];
  },
  destroy(i, e, n, o) {
    o && !o.isDestroyed() && o.destroy(), i.isDestroyed() || i.destroy();
  },
  provide(i, e, n, o) {
    return {
      cesiumWidget: i,
      scene: i.scene,
      camera: i.scene.camera,
      imageryLayerCollection: i.scene.globe.imageryLayers,
      primitiveCollection: i.scene.primitives,
      globe: i.scene.globe,
      __$internal: {
        onUpdate: n == null ? void 0 : n.onUpdate
      },
      [de]: o
    };
  },
  containerProps: ({ id: i, className: e, style: n, full: o, containerProps: r }) => ({
    className: e,
    id: i,
    style: {
      ...o ? {
        position: "absolute",
        bottom: "0",
        left: "0",
        right: "0",
        top: "0"
      } : {},
      ...n
    },
    ...r
  }),
  cesiumProps: wn,
  cesiumReadonlyProps: Sn,
  otherProps: bn,
  renderContainer: true,
  useCommonEvent: true,
  useRootEvent: true
});
var Dn = [
  "classificationType",
  "debugShowBoundingVolume",
  "debugShowShadowVolume",
  "show"
];
var Rn = [
  "allowPicking",
  "asynchronous",
  "compressVertices",
  "geometryInstances",
  "interleave",
  "releaseGeometryInstances",
  "vertexCacheOptimize",
  "appearance"
];
var Mn = ["onReady"];
var Uo = a({
  name: "ClassificationPrimitive",
  async create(i, e) {
    var o;
    if (!i.primitiveCollection) return;
    const n = new ClassificationPrimitive_default(e);
    if (e.onReady) {
      const r = () => {
        var s, u;
        n.ready && ((s = e.onReady) == null || s.call(e, n), (u = i.scene) == null || u.postRender.removeEventListener(r));
      };
      (o = i.scene) == null || o.postRender.addEventListener(r);
    }
    return i.primitiveCollection.add(n), n;
  },
  destroy(i, e) {
    e.primitiveCollection && !e.primitiveCollection.isDestroyed() && e.primitiveCollection.remove(i), i.isDestroyed() || i.destroy();
  },
  cesiumProps: Dn,
  cesiumReadonlyProps: Rn,
  otherProps: Mn,
  useCommonEvent: true
});
var Tn = {
  onStop: "onStop",
  onTick: "onTick"
};
var $n = [
  "canAnimate",
  "clockRange",
  "clockStep",
  "currentTime",
  "multiplier",
  "shouldAnimate",
  "startTime",
  "stopTime"
];
var Vo = a({
  name: "Clock",
  create: (i) => {
    var e;
    return (e = i.cesiumWidget) == null ? void 0 : e.clock;
  },
  cesiumProps: $n,
  cesiumEventProps: Tn,
  setCesiumPropsAfterCreate: true
});
var kn = [
  "noiseDetail",
  "noiseOffset",
  "show",
  "debugBillboards",
  "debugEllipsoids"
];
var Io = a({
  name: "CloudCollection",
  create: (i) => {
    if (!i.primitiveCollection) return;
    const e = new CloudCollection_default();
    return i.primitiveCollection.add(e), e;
  },
  destroy(i, e) {
    e.primitiveCollection && !e.primitiveCollection.isDestroyed() && e.primitiveCollection.remove(i), i.isDestroyed() || i.destroy();
  },
  provide: (i) => ({
    cloudCollection: i
  }),
  cesiumProps: kn,
  setCesiumPropsAfterCreate: true
});
var Ln = [
  "positions",
  "width",
  "cornerType",
  "height",
  "heightReference",
  "extrudedHeight",
  "extrudedHeightReference",
  "show",
  "fill",
  "material",
  "outline",
  "outlineColor",
  "outlineWidth",
  "granularity",
  "shadows",
  "distanceDisplayCondition",
  "zIndex",
  "classificationType"
];
var On = {
  onDefinitionChange: "definitionChanged"
};
var jo = a({
  name: "CorridorGraphics",
  create(i, e) {
    if (!i.entity) return;
    const n = new CorridorGraphics_default(e);
    return e.classificationType && (n.classificationType = e.classificationType), i.entity.corridor = n, n;
  },
  destroy(i, e) {
    e.entity && (e.entity.corridor = void 0);
  },
  cesiumProps: Ln,
  cesiumEventProps: On
});
var An = [
  "show",
  "position",
  "scale",
  "maximumSize",
  "slice",
  "brightness",
  "color"
];
var No = a({
  name: "CumulusCloud",
  create: (i, e) => {
    var n;
    return (n = i.cloudCollection) == null ? void 0 : n.add(e);
  },
  destroy(i, e) {
    e.cloudCollection && !e.cloudCollection.isDestroyed() && e.cloudCollection.remove(i);
  },
  cesiumProps: An
});
var _n = ["clustering", "name", "show", "clock", "isLoading"];
var Bn = {
  onChange: "changedEvent",
  onError: "errorEvent",
  onLoading: "loadingEvent"
};
var Ho = a({
  name: "CustomDataSource",
  create(i, e) {
    if (!i.dataSourceCollection) return;
    const n = new CustomDataSource_default(e.name);
    return e.clustering && (n.clustering = e.clustering), typeof e.show == "boolean" && (n.show = e.show), typeof e.clock < "u" && (n.clock = e.clock), i.dataSourceCollection.add(n), n;
  },
  destroy(i, e) {
    e.dataSourceCollection && !e.dataSourceCollection.isDestroyed() && e.dataSourceCollection.remove(i);
  },
  provide(i) {
    return {
      entityCollection: i.entities,
      dataSource: i
    };
  },
  cesiumProps: _n,
  cesiumEventProps: Bn,
  useCommonEvent: true
});
var Gn = [
  "heightReference",
  "length",
  "topRadius",
  "bottomRadius",
  "show",
  "fill",
  "material",
  "outline",
  "outlineColor",
  "outlineWidth",
  "numberOfVerticalLines",
  "slices",
  "distanceDisplayCondition",
  "shadows"
];
var Wn = {
  onDefinitionChange: "definitionChanged"
};
var zo = a({
  name: "CylinderGraphics",
  create(i, e) {
    if (!i.entity) return;
    const n = new CylinderGraphics_default(e);
    return i.entity.cylinder = n, n;
  },
  destroy(i, e) {
    e.entity && (e.entity.cylinder = void 0);
  },
  cesiumProps: Gn,
  cesiumEventProps: Wn
});
var Fn = ["clustering", "show"];
var Un = ["name", "sourceUri", "credit"];
var Vn = {
  onChange: "changedEvent",
  onError: "errorEvent",
  onLoading: "loadingEvent"
};
var In = ["onLoad", "data"];
var Ye = (i, { data: e, onLoad: n, ...o }) => {
  e && i.load(e, o).then((r) => {
    n && n(r);
  });
};
var xo = a({
  name: "CzmlDataSource",
  create(i, e) {
    if (!i.dataSourceCollection) return;
    const n = new CzmlDataSource_default(e.name);
    return e.clustering && (n.clustering = e.clustering), typeof e.show == "boolean" && (n.show = e.show), i.dataSourceCollection.add(n), e.data && Ye(n, e), n;
  },
  update(i, e, n) {
    e.data ? n.show !== e.show && (i.show = typeof e.show == "boolean" ? e.show : true) : i.show = false, e.data && (n.data !== e.data || n.sourceUri !== e.sourceUri || n.credit !== e.credit) && Ye(i, e);
  },
  destroy(i, e) {
    e.dataSourceCollection && !e.dataSourceCollection.isDestroyed() && e.dataSourceCollection.remove(i);
  },
  provide(i) {
    return {
      dataSource: i
    };
  },
  cesiumProps: Fn,
  cesiumReadonlyProps: Un,
  cesiumEventProps: Vn,
  otherProps: In,
  useCommonEvent: true
});
var jn = [
  "semiMajorAxis",
  "semiMinorAxis",
  "height",
  "heightReference",
  "extrudedHeight",
  "show",
  "fill",
  "material",
  "outline",
  "outlineColor",
  "outlineWidth",
  "numberOfVerticalLines",
  "rotation",
  "stRotation",
  "granularity",
  "shadows",
  "distanceDisplayCondition",
  "zIndex",
  "classificationType",
  "extrudedHeightReference"
];
var Nn = {
  onDefinitionChange: "definitionChanged"
};
var qo = a({
  name: "EllipseGraphics",
  create(i, e) {
    if (!i.entity) return;
    const n = new EllipseGraphics_default(e);
    return i.entity.ellipse = n, n;
  },
  destroy(i, e) {
    e.entity && (e.entity.ellipse = void 0);
  },
  cesiumProps: jn,
  cesiumEventProps: Nn
});
var Hn = [
  "heightReference",
  "radii",
  "show",
  "fill",
  "innerRadii",
  "material",
  "maximumClock",
  "maximumCone",
  "minimumClock",
  "minimumCone",
  "outline",
  "outlineColor",
  "outlineWidth",
  "subdivisions",
  "stackPartitions",
  "slicePartitions",
  "shadows",
  "distanceDisplayCondition"
];
var zn = {
  onDefinitionChange: "definitionChanged"
};
var Yo = a({
  name: "EllipsoidGraphics",
  create(i, e) {
    if (!i.entity) return;
    const n = new EllipsoidGraphics_default(e);
    return i.entity.ellipsoid = n, n;
  },
  destroy(i, e) {
    e.entity && (e.entity.ellipsoid = void 0);
  },
  cesiumProps: Hn,
  cesiumEventProps: zn
});
var xn = [
  "availability",
  "billboard",
  "box",
  "corridor",
  "cylinder",
  "description",
  "ellipse",
  "ellipsoid",
  "entityCollection",
  "label",
  "model",
  "name",
  "trackingReferenceFrame",
  "orientation",
  "path",
  "plane",
  "parent",
  "point",
  "polygon",
  "polyline",
  "polylineVolume",
  "position",
  "properties",
  "rectangle",
  "show",
  "tileset",
  "viewFrom",
  "wall"
];
var qn = ["id"];
var Yn = {
  onDefinitionChange: "definitionChanged"
};
var Kn = ["selected", "tracked"];
var Ko = a({
  name: "Entity",
  create(i, e) {
    if (!i.entityCollection) return;
    const n = new Entity_default(e);
    return i.viewer && e.selected && (i.viewer.selectedEntity = n), i.viewer && e.tracked && (i.viewer.trackedEntity = n), i.entityCollection.add(n), n;
  },
  destroy(i, e) {
    e.entityCollection && e.entityCollection.remove(i);
  },
  update(i, e, n, o) {
    o.viewer && (e.selected !== n.selected && (e.selected ? o.viewer.selectedEntity = i : o.viewer.selectedEntity === i && (o.viewer.selectedEntity = void 0)), e.tracked !== n.tracked && (e.tracked ? o.viewer.trackedEntity = i : o.viewer.trackedEntity === i && (o.viewer.trackedEntity = void 0)));
  },
  provide(i, e, n) {
    return {
      entity: i,
      __$internal: {
        onUpdate: n == null ? void 0 : n.onUpdate
      }
    };
  },
  cesiumProps: xn,
  cesiumReadonlyProps: qn,
  cesiumEventProps: Yn,
  otherProps: Kn,
  useCommonEvent: true
});
var Jo = ({
  children: i,
  container: e,
  resizeInfoBox: n = true
}) => {
  const { viewer: o, entity: r } = we(), [s, u] = (0, import_react.useState)(false), f = (0, import_react.useMemo)(
    () => {
      var m;
      return e ?? ((m = o == null ? void 0 : o.infoBox.frame.contentDocument) == null ? void 0 : m.createElement("div"));
    },
    [e, o == null ? void 0 : o.infoBox.frame.contentDocument]
  );
  return (0, import_react.useEffect)(() => {
    if (!o || !r) return;
    const m = (p) => {
      u(!!p && p.id === r.id);
    };
    return o.selectedEntityChanged.addEventListener(m), () => {
      o.selectedEntityChanged.removeEventListener(m);
    };
  }, [r, o]), (0, import_react.useEffect)(() => {
    var O, B;
    if (e || !f || !o) return;
    const m = (O = o.infoBox) == null ? void 0 : O.frame, p = (B = m == null ? void 0 : m.contentDocument) == null ? void 0 : B.querySelector(".cesium-infoBox-description");
    if (!m || !p) return;
    let C;
    if (s) {
      if (n) {
        const y = p.getBoundingClientRect().height;
        m.style.height = y + "px", C = window.setInterval(() => {
          const S = o.infoBox.container.querySelector(
            ".cesium-infoBox.cesium-infoBox-visible"
          );
          S && (clearInterval(C), C = void 0, p.appendChild(f), S.classList.remove("cesium-infoBox-bodyless"), m.style.height = p.getBoundingClientRect().height + "px");
        }, 10);
      }
    } else f.parentElement === p && p.removeChild(f);
    return C ? () => clearTimeout(C) : void 0;
  }, [f, e, n, s, o]), f ? F.jsx(F.Fragment, { children: (0, import_react_dom.createPortal)(F.jsx(F.Fragment, { children: !e || s ? i : null }), f) }) : null;
};
var Jn = [
  "density",
  "enabled",
  "minimumBrightness",
  "screenSpaceErrorFactor",
  "heightScalar",
  "maxHeight",
  "visualDensityScalar",
  "heightFalloff",
  "renderable"
];
var Zo = a({
  name: "Fog",
  create(i) {
    if (!i.scene) return;
    const e = new Fog_default();
    return i.scene.fog = e, e;
  },
  destroy(i, e) {
    e.scene && !e.scene.isDestroyed() && (e.scene.fog = new Fog_default());
  },
  cesiumProps: Jn,
  setCesiumPropsAfterCreate: true
});
var Zn = ["clustering", "name", "show"];
var Xn = [
  "clampToGround",
  "sourceUri",
  "credit",
  "markerSize",
  "markerSymbol",
  "markerColor",
  "stroke",
  "strokeWidth",
  "fill",
  "describe"
];
var Qn = {
  onChange: "changedEvent",
  onError: "errorEvent",
  onLoading: "loadingEvent"
};
var et = ["onLoad", "data"];
var Ke = (i, { data: e, onLoad: n, ...o }) => {
  e && i.load(e, o).then((r) => {
    n && n(r);
  });
};
var Xo = a({
  name: "GeoJsonDataSource",
  create(i, e) {
    if (!i.dataSourceCollection) return;
    const n = new GeoJsonDataSource_default(e.name);
    return e.clustering && (n.clustering = e.clustering), typeof e.show == "boolean" && (n.show = e.show), i.dataSourceCollection.add(n), e.data && Ke(n, e), n;
  },
  update(i, e, n) {
    e.data ? n.show !== e.show && (i.show = typeof e.show == "boolean" ? e.show : true) : i.show = false, e.data && (n.data !== e.data || n.clampToGround !== e.clampToGround || n.sourceUri !== e.sourceUri || n.credit !== e.credit || n.markerSize !== e.markerSize || n.markerSymbol !== e.markerSymbol || n.markerColor !== e.markerColor || n.stroke !== e.stroke || n.strokeWidth !== e.strokeWidth || n.fill !== e.fill) && Ke(i, e);
  },
  destroy(i, e) {
    e.dataSourceCollection && !e.dataSourceCollection.isDestroyed() && e.dataSourceCollection.remove(i);
  },
  provide(i) {
    return {
      dataSource: i
    };
  },
  cesiumProps: Zn,
  cesiumReadonlyProps: Xn,
  cesiumEventProps: Qn,
  otherProps: et,
  useCommonEvent: true
});
var it = {
  onImageryLayersUpdate: "imageryLayersUpdatedEvent",
  onTerrainProviderChange: "terrainProviderChanged",
  onTileLoadProgress: "tileLoadProgressEvent"
};
var nt = [
  "atmosphereBrightnessShift",
  "atmosphereHueShift",
  "atmosphereSaturationShift",
  "backFaceCulling",
  "baseColor",
  "clippingPlanes",
  "clippingPolygons",
  "depthTestAgainstTerrain",
  "enableLighting",
  "lightingFadeInDistance",
  "lightingFadeOutDistance",
  "material",
  "maximumScreenSpaceError",
  "nightFadeInDistance",
  "nightFadeOutDistance",
  "oceanNormalMapUrl",
  "shadows",
  "show",
  "showGroundAtmosphere",
  "showWaterEffect",
  "tileCacheSize",
  "loadingDescendantLimit",
  "preloadAncestors",
  "preloadSiblings",
  "fillHighlightColor",
  "dynamicAtmosphereLighting",
  "dynamicAtmosphereLightingFromSun",
  "showSkirts",
  "cartographicLimitRectangle",
  "translucency",
  "undergroundColor",
  "undergroundColorAlphaByDistance",
  "lambertDiffuseMultiplier",
  "atmosphereLightIntensity",
  "atmosphereRayleighCoefficient",
  "atmosphereMieCoefficient",
  "atmosphereRayleighScaleHeight",
  "atmosphereMieScaleHeight",
  "atmosphereMieAnisotropy",
  "vertexShadowDarkness"
];
var tt = ["terrainProvider"];
var Qo = a({
  name: "Globe",
  create: (i) => {
    var e;
    return (e = i.scene) == null ? void 0 : e.globe;
  },
  update: async (i, e) => {
    const n = e.terrainProvider;
    let o;
    K(n) ? o = await n : o = n, i.terrainProvider = o;
  },
  cesiumProps: nt,
  cesiumEventProps: it,
  otherProps: tt,
  setCesiumPropsAfterCreate: true
});
var ot = [
  "appearance",
  "classificationType",
  "debugShowBoundingVolume",
  "debugShowShadowVolume",
  "show"
];
var rt = [
  "allowPicking",
  "asynchronous",
  "geometryInstances",
  "interleave",
  "releaseGeometryInstances"
];
var st = ["onReady"];
var er = a({
  name: "GroundPolylinePrimitive",
  create(i, e) {
    var o;
    if (!i.primitiveCollection) return;
    const n = new GroundPolylinePrimitive_default(e);
    if (e.onReady) {
      const r = () => {
        var s, u;
        n.ready && ((s = e.onReady) == null || s.call(e, n), (u = i.scene) == null || u.postRender.removeEventListener(r));
      };
      (o = i.scene) == null || o.postRender.addEventListener(r);
    }
    return i.primitiveCollection.add(n), n;
  },
  destroy(i, e) {
    e.primitiveCollection && !e.primitiveCollection.isDestroyed() && e.primitiveCollection.remove(i), i.isDestroyed() || i.destroy();
  },
  cesiumProps: ot,
  cesiumReadonlyProps: rt,
  otherProps: st,
  useCommonEvent: true
});
var at = [
  "appearance",
  "classificationType",
  "debugShowBoundingVolume",
  "debugShowShadowVolume",
  "show"
];
var ct = [
  "allowPicking",
  "asynchronous",
  "compressVertices",
  "geometryInstances",
  "interleave",
  "releaseGeometryInstances",
  "vertexCacheOptimize"
];
var lt = ["onReady"];
var ir = a({
  name: "GroundPrimitive",
  create(i, e) {
    var o;
    if (!i.primitiveCollection) return;
    const n = new GroundPrimitive_default(e);
    if (e.onReady) {
      const r = () => {
        var s, u;
        n.ready && ((s = e.onReady) == null || s.call(e, n), (u = i.scene) == null || u.postRender.removeEventListener(r));
      };
      (o = i.scene) == null || o.postRender.addEventListener(r);
    }
    return i.primitiveCollection.add(n), n;
  },
  destroy(i, e) {
    e.primitiveCollection && !e.primitiveCollection.isDestroyed() && e.primitiveCollection.remove(i), i.isDestroyed() || i.destroy();
  },
  cesiumProps: at,
  cesiumReadonlyProps: ct,
  otherProps: lt,
  useCommonEvent: true
});
var ut = ["show", "destroyPrimitives", "primitiveAdded", "primitiveRemoved"];
var nr = a({
  name: "GroundPrimitiveCollection",
  create: (i) => {
    var e;
    return (e = i.scene) == null ? void 0 : e.groundPrimitives;
  },
  provide: (i) => ({
    primitiveCollection: i
  }),
  cesiumProps: ut,
  setCesiumPropsAfterCreate: true
});
var dt = [
  "alpha",
  "brightness",
  "contrast",
  "hue",
  "saturation",
  "gamma",
  "splitDirection",
  "minificationFilter",
  "magnificationFilter",
  "cutoutRectangle",
  "show",
  "nightAlpha",
  "dayAlpha",
  "colorToAlpha",
  "colorToAlphaThreshold",
  "index"
];
var mt = [
  "rectangle",
  "maximumAnisotropy",
  "minimumTerrainLevel",
  "maximumTerrainLevel",
  "readyEvent",
  "imageryProvider"
];
var tr = a({
  name: "ImageryLayer",
  async create(i, e) {
    var u, f, m, p;
    if (!i.imageryLayerCollection) return;
    const n = K(e.imageryProvider) ? e.imageryProvider : new Promise((C) => queueMicrotask(() => C(e.imageryProvider))), o = (f = (u = i.__$internal) == null ? void 0 : u.imageryLayerWaitingList) == null ? void 0 : f.slice();
    (m = i.__$internal) != null && m.imageryLayerWaitingList && i.__$internal.imageryLayerWaitingList.push(n), o && await Promise.all(o.filter((C) => K(C)));
    const r = await n;
    if ((p = i.__$internal) != null && p.imageryLayerWaitingList && (i.__$internal.imageryLayerWaitingList = i.__$internal.imageryLayerWaitingList.filter((C) => C !== n)), !r) return;
    const s = new ImageryLayer_default(r, e);
    return i.imageryLayerCollection.add(s, e.index), s;
  },
  destroy(i, e) {
    e.imageryLayerCollection && e.imageryLayerCollection.remove(i);
  },
  cesiumProps: dt,
  cesiumReadonlyProps: mt
});
var ft = {
  onLayerAdd: "layerAdded",
  onLayerMove: "layerMoved",
  onLayerRemove: "layerRemoved",
  onLayerShowOrHide: "layerShownOrHidden"
};
var or = a({
  name: "ImageryLayerCollection",
  create: (i) => {
    var e;
    return (e = i.globe) == null ? void 0 : e.imageryLayers;
  },
  cesiumEventProps: ft
});
var ht = ["clustering", "name", "show"];
var yt = [
  "canvas",
  "camera",
  "ellipsoid",
  "clampToGround",
  "sourceUri",
  "credit",
  "screenOverlayContainer"
];
var gt = {
  onChange: "changedEvent",
  onError: "errorEvent",
  onLoading: "loadingEvent",
  onRefresh: "refreshEvent",
  onUnsupportedNode: "unsupportedNodeEvent"
};
var pt = ["onLoad", "data"];
var Je = (i, { data: e, onLoad: n, ...o }) => {
  e && i.load(e, o).then((r) => {
    n && n(r);
  });
};
var rr = a({
  name: "KmlDataSource",
  create(i, e) {
    if (!i.scene || !i.dataSourceCollection || !i.scene) return;
    const n = new KmlDataSource_default({
      camera: e.camera || i.scene.camera,
      canvas: e.canvas || i.scene.canvas,
      ellipsoid: e.ellipsoid,
      credit: e.credit
    });
    return e.clustering && (n.clustering = e.clustering), typeof e.show == "boolean" && (n.show = e.show), typeof e.name < "u" && (n.name = e.name), i.dataSourceCollection.add(n), e.data && Je(n, e), n;
  },
  update(i, e, n) {
    e.data ? n.show !== e.show && (i.show = typeof e.show == "boolean" ? e.show : true) : i.show = false, e.data && (n.data !== e.data || n.clampToGround !== e.clampToGround || n.ellipsoid !== e.ellipsoid || n.sourceUri !== e.sourceUri || n.credit !== e.credit) && Je(i, e);
  },
  destroy(i, e) {
    e.dataSourceCollection && !e.dataSourceCollection.isDestroyed() && e.dataSourceCollection.remove(i);
  },
  provide(i) {
    return {
      dataSource: i
    };
  },
  cesiumProps: ht,
  cesiumReadonlyProps: yt,
  cesiumEventProps: gt,
  otherProps: pt,
  useCommonEvent: true
});
var vt = [
  "backgroundColor",
  "backgroundPadding",
  "disableDepthTestDistance",
  "distanceDisplayCondition",
  "eyeOffset",
  "fillColor",
  "font",
  "heightReference",
  "horizontalOrigin",
  "id",
  "outlineColor",
  "outlineWidth",
  "pixelOffset",
  "pixelOffsetScaleByDistance",
  "position",
  "scale",
  "scaleByDistance",
  "show",
  "showBackground",
  "style",
  "text",
  "translucencyByDistance",
  "verticalOrigin"
];
var sr = a({
  name: "Label",
  create: (i, e) => {
    var n;
    return (n = i.labelCollection) == null ? void 0 : n.add(e);
  },
  destroy(i, e) {
    e.labelCollection && !e.labelCollection.isDestroyed() && e.labelCollection.remove(i);
  },
  cesiumProps: vt,
  useCommonEvent: true
});
var Ct = ["blendOption", "debugShowBoundingVolume", "modelMatrix", "show"];
var ar = a({
  name: "LabelCollection",
  create(i, e) {
    if (!i.scene || !i.primitiveCollection) return;
    const n = new LabelCollection_default({
      scene: i.scene,
      modelMatrix: e.modelMatrix,
      blendOption: e.blendOption,
      debugShowBoundingVolume: e.debugShowBoundingVolume
    });
    return i.primitiveCollection.add(n), n;
  },
  destroy(i, e) {
    e.primitiveCollection && !e.primitiveCollection.isDestroyed() && e.primitiveCollection.remove(i), i.isDestroyed() || i.destroy();
  },
  provide(i) {
    return {
      labelCollection: i
    };
  },
  cesiumProps: Ct
});
var Pt = [
  "text",
  "font",
  "style",
  "fillColor",
  "outlineColor",
  "outlineWidth",
  "show",
  "showBackground",
  "backgroundColor",
  "backgroundPadding",
  "scale",
  "horizontalOrigin",
  "verticalOrigin",
  "eyeOffset",
  "pixelOffset",
  "translucencyByDistance",
  "pixelOffsetScaleByDistance",
  "scaleByDistance",
  "heightReference",
  "distanceDisplayCondition",
  "disableDepthTestDistance"
];
var Et = {
  onDefinitionChange: "definitionChanged"
};
var cr = a({
  name: "LabelGraphics",
  create(i, e) {
    if (!i.entity) return;
    const n = new LabelGraphics_default(e);
    return i.entity.label = n, n;
  },
  destroy(i, e) {
    e.entity && (e.entity.label = void 0);
  },
  cesiumProps: Pt,
  cesiumEventProps: Et
});
var wt = [
  "backFaceCulling",
  "clampAnimations",
  "clippingPlanes",
  "color",
  "colorBlendAmount",
  "colorBlendMode",
  "customShader",
  "debugShowBoundingVolume",
  "debugWireframe",
  "distanceDisplayCondition",
  "featureIdLabel",
  "heightReference",
  "id",
  "imageBasedLighting",
  "instanceFeatureIdLabel",
  "lightColor",
  "maximumScale",
  "minimumPixelSize",
  "modelMatrix",
  "clippingPolygons",
  "outlineColor",
  "scale",
  "shadows",
  "show",
  "showCreditsOnScreen",
  "showOutline",
  "silhouetteColor",
  "silhouetteSize",
  "splitDirection",
  "style"
];
var St = [
  "allowPicking",
  "asynchronous",
  "basePath",
  "credit",
  "enableDebugWireframe",
  "gltf",
  "heightReference",
  "incrementallyLoadTextures",
  "scene",
  "releaseGltfJson",
  "cull",
  "opaquePass",
  "enableVerticalExaggeration",
  "environmentMapOptions",
  "upAxis",
  "forwardAxis",
  "content",
  "scene",
  "enableShowOutline",
  "projectTo2D",
  "classificationType",
  "errorEvent",
  "readyEvent",
  "texturesReadyEvent",
  "gltfCallback",
  "enablePick"
];
var bt = ["onReady", "onError", "url"];
var lr = a({
  name: "Model",
  async create(i, { scene: e, url: n, colorBlendMode: o, ...r }) {
    var m;
    if (!i.scene || !i.primitiveCollection || !n) return;
    const s = n;
    let u;
    K(s) ? u = await s : u = s;
    let f;
    try {
      f = await Model_default.fromGltfAsync({
        ...r,
        url: u,
        colorBlendMode: o,
        scene: e || i.scene
      });
    } catch (p) {
      (m = r.onError) == null || m.call(r, p);
      return;
    }
    return i.primitiveCollection.add(f), f;
  },
  destroy(i, e) {
    e.primitiveCollection && !e.primitiveCollection.isDestroyed() && e.primitiveCollection.remove(i), i.isDestroyed() || i.destroy();
  },
  cesiumEventProps: {
    onReady: "readyEvent"
  },
  cesiumProps: wt,
  cesiumReadonlyProps: St,
  otherProps: bt,
  useCommonEvent: true
});
var Dt = [
  "uri",
  "show",
  "scale",
  "minimumPixelSize",
  "maximumScale",
  "incrementallyLoadTextures",
  "runAnimations",
  "clampAnimations",
  "nodeTransformations",
  "environmentMapOptions",
  "enableVerticalExaggeration",
  "shadows",
  "heightReference",
  "distanceDisplayCondition",
  "silhouetteColor",
  "silhouetteSize",
  "color",
  "colorBlendMode",
  "colorBlendAmount",
  "clippingPlanes",
  "imageBasedLightingFactor",
  "lightColor",
  "articulations",
  "customShader"
];
var Rt = {
  onDefinitionChange: "definitionChanged"
};
var ur = a({
  name: "ModelGraphics",
  create(i, e) {
    if (!i.entity) return;
    const n = new ModelGraphics_default(e);
    return i.entity.model = n, n;
  },
  destroy(i, e) {
    e.entity && (e.entity.model = void 0);
  },
  cesiumProps: Dt,
  cesiumEventProps: Rt
});
var Mt = ["onlySunLighting", "show", "textureUrl"];
var Tt = ["ellipsoid"];
var dr = a({
  name: "Moon",
  create(i, e) {
    if (!i.scene) return;
    const n = new Moon_default(e);
    return i.scene.moon = n, n;
  },
  destroy(i, e) {
    e.scene && !e.scene.isDestroyed() && (e.scene.moon = new Moon_default());
  },
  cesiumProps: Mt,
  cesiumReadonlyProps: Tt
});
var $t = [
  "show",
  "emitter",
  "modelMatrix",
  "emitterModelMatrix",
  "emissionRate",
  "bursts",
  "loop",
  "startScale",
  "endScale",
  "startColor",
  "endColor",
  "image",
  "imageSize",
  "minimumImageSize",
  "maximumImageSize",
  "speed",
  "minimumSpeed",
  "maximumSpeed",
  "lifetime",
  "particleLife",
  "minimumParticleLife",
  "maximumParticleLife",
  "mass",
  "minimumMass",
  "maximumMass",
  "sizeInMeters"
];
var kt = {
  onComplete: "complete",
  onUpdate: "updateCallback"
};
var mr = a({
  name: "ParticleSystem",
  create(i, e) {
    if (!i.primitiveCollection) return;
    const n = new ParticleSystem_default({ ...e, updateCallback: e.onUpdate });
    return i.primitiveCollection.add(n), n;
  },
  update(i, e, n) {
    e.onUpdate !== n.onUpdate && (i.updateCallback = e.onUpdate);
  },
  destroy(i, e) {
    e.primitiveCollection && !e.primitiveCollection.isDestroyed() && e.primitiveCollection.remove(i);
  },
  cesiumProps: $t,
  cesiumEventProps: kt
});
var Lt = [
  "leadTime",
  "trailTime",
  "show",
  "width",
  "material",
  "resolution",
  "distanceDisplayCondition"
];
var Ot = {
  onDefinitionChange: "definitionChanged"
};
var fr = a({
  name: "PathGraphics",
  create(i, e) {
    if (!i.entity) return;
    const n = new PathGraphics_default(e);
    return i.entity.path = n, n;
  },
  destroy(i, e) {
    e.entity && (e.entity.path = void 0);
  },
  cesiumProps: Lt,
  cesiumEventProps: Ot
});
var At = [
  "plane",
  "dimensions",
  "show",
  "fill",
  "material",
  "outline",
  "outlineColor",
  "outlineWidth",
  "shadows",
  "distanceDisplayCondition"
];
var _t = {
  onDefinitionChange: "definitionChanged"
};
var hr = a({
  name: "PlaneGraphics",
  create(i, e) {
    if (!i.entity) return;
    const n = new PlaneGraphics_default(e);
    return i.entity.plane = n, n;
  },
  destroy(i, e) {
    e.entity && (e.entity.plane = void 0);
  },
  cesiumProps: At,
  cesiumEventProps: _t
});
var Bt = [
  "color",
  "pixelSize",
  "outlineColor",
  "outlineWidth",
  "show",
  "scaleByDistance",
  "translucencyByDistance",
  "heightReference",
  "splitDirection",
  "distanceDisplayCondition",
  "disableDepthTestDistance"
];
var Gt = {
  onDefinitionChange: "definitionChanged"
};
var yr = a({
  name: "PointGraphics",
  create(i, e) {
    if (!i.entity) return;
    const n = new PointGraphics_default(e);
    return i.entity.point = n, n;
  },
  destroy(i, e) {
    e.entity && (e.entity.point = void 0);
  },
  cesiumProps: Bt,
  cesiumEventProps: Gt
});
var Wt = [
  "color",
  "disableDepthTestDistance",
  "distanceDisplayCondition",
  "id",
  "outlineColor",
  "splitDirection",
  "outlineWidth",
  "pixelSize",
  "position",
  "scaleByDistance",
  "show",
  "translucencyByDistance"
];
var gr = a({
  name: "PointPrimitive",
  create: (i, e) => {
    var n;
    return (n = i.pointPrimitiveCollection) == null ? void 0 : n.add(e);
  },
  destroy(i, e) {
    e.pointPrimitiveCollection && !e.pointPrimitiveCollection.isDestroyed() && e.pointPrimitiveCollection.remove(i);
  },
  cesiumProps: Wt,
  useCommonEvent: true
});
var Ft = ["blendOption", "debugShowBoundingVolume", "modelMatrix", "show"];
var pr = a({
  name: "PointPrimitveCollection",
  create(i, e) {
    if (!i.primitiveCollection) return;
    const n = new PointPrimitiveCollection_default(e);
    return i.primitiveCollection.add(n), n;
  },
  destroy(i, e) {
    e.primitiveCollection && !e.primitiveCollection.isDestroyed() && e.primitiveCollection.remove(i), i.isDestroyed() || i.destroy();
  },
  provide(i) {
    return {
      pointPrimitiveCollection: i
    };
  },
  cesiumProps: Ft
});
var Ut = [
  "arcType",
  "hierarchy",
  "height",
  "heightReference",
  "extrudedHeight",
  "extrudedHeightReference",
  "show",
  "fill",
  "material",
  "outline",
  "outlineColor",
  "outlineWidth",
  "stRotation",
  "granularity",
  "perPositionHeight",
  "closeTop",
  "closeBottom",
  "shadows",
  "distanceDisplayCondition",
  "zIndex",
  "classificationType",
  "textureCoordinates"
];
var Vt = {
  onDefinitionChange: "definitionChanged"
};
var vr = a({
  name: "PolygonGraphics",
  create(i, e) {
    if (!i.entity) return;
    const n = new PolygonGraphics_default(e);
    return i.entity.polygon = n, n;
  },
  destroy(i, e) {
    e.entity && (e.entity.polygon = void 0);
  },
  cesiumProps: Ut,
  cesiumEventProps: Vt
});
var It = [
  "distanceDisplayCondition",
  "id",
  "loop",
  "material",
  "positions",
  "show",
  "width"
];
var Cr = a({
  name: "Polyline",
  create: (i, e) => {
    var n;
    return (n = i.polylineCollection) == null ? void 0 : n.add(e);
  },
  destroy(i, e) {
    e.polylineCollection && !e.polylineCollection.isDestroyed() && e.polylineCollection.remove(i);
  },
  cesiumProps: It,
  useCommonEvent: true
});
var jt = ["debugShowBoundingVolume", "length", "modelMatrix", "show"];
var Pr = a(
  {
    name: "PolylineCollection",
    create(i, e) {
      if (!i.primitiveCollection) return;
      const n = new PolylineCollection_default({
        modelMatrix: e.modelMatrix,
        debugShowBoundingVolume: e.debugShowBoundingVolume,
        length: e.length,
        scene: i.scene
      });
      return i.primitiveCollection.add(n), n;
    },
    destroy(i, e) {
      e.primitiveCollection && !e.primitiveCollection.isDestroyed() && e.primitiveCollection.remove(i), i.isDestroyed() || i.destroy();
    },
    provide(i) {
      return {
        polylineCollection: i
      };
    },
    cesiumProps: jt
  }
);
var Nt = [
  "arcType",
  "classificationType",
  "positions",
  "clampToGround",
  "width",
  "show",
  "material",
  "depthFailMaterial",
  "granularity",
  "shadows",
  "distanceDisplayCondition",
  "zIndex"
];
var Ht = {
  onDefinitionChange: "definitionChanged"
};
var Er = a({
  name: "PolylineGraphics",
  create(i, e) {
    if (!i.entity) return;
    const n = new PolylineGraphics_default(e);
    return i.entity.polyline = n, n;
  },
  destroy(i, e) {
    e.entity && (e.entity.polyline = void 0);
  },
  cesiumProps: Nt,
  cesiumEventProps: Ht
});
var zt = [
  "positions",
  "shape",
  "cornerType",
  "show",
  "fill",
  "material",
  "outline",
  "outlineColor",
  "outlineWidth",
  "granularity",
  "shadows",
  "distanceDisplayCondition"
];
var xt = {
  onDefinitionChange: "definitionChanged"
};
var wr = a({
  name: "PolylineVolumeGraphics",
  create(i, e) {
    if (!i.entity) return;
    const n = new PolylineVolumeGraphics_default(e);
    return i.entity.polylineVolume = n, n;
  },
  destroy(i, e) {
    e.entity && (e.entity.polylineVolume = void 0);
  },
  cesiumProps: zt,
  cesiumEventProps: xt
});
var qt = ["enabled", "selected"];
var Yt = [
  "clearColor",
  "forcePowerOfTwo",
  "fragmentShader",
  "name",
  "pixelDatatype",
  "pixelFormat",
  "sampleMode",
  "scissorRectangle",
  "textureScale",
  "uniforms"
];
var Sr = a({
  name: "PostProcessStage",
  create(i, e) {
    if (!i.scene) return;
    const n = new PostProcessStage_default(e);
    return typeof e.enabled == "boolean" && (n.enabled = e.enabled), e.selected && (n.selected = e.selected), i.scene.postProcessStages.add(n), n;
  },
  destroy(i, e) {
    e.scene && !e.scene.isDestroyed() && e.scene.postProcessStages.remove(i), i.isDestroyed() || i.destroy();
  },
  cesiumProps: qt,
  cesiumReadonlyProps: Yt
});
var br = _({
  name: "BlackAndWhiteStage",
  props: ["gradations"],
  create: () => PostProcessStageLibrary_default.createBlackAndWhiteStage()
});
var Dr = _({
  name: "BrightnessStage",
  props: ["brightness"],
  create: () => PostProcessStageLibrary_default.createBrightnessStage()
});
var Rr = _({
  name: "LensFlareStage",
  props: [
    "dirtTexture",
    "starTexture",
    "intensity",
    "distortion",
    "ghostDispersal",
    "haloWidth",
    "earthRadius"
  ],
  create: () => PostProcessStageLibrary_default.createLensFlareStage()
});
var Mr = _({
  name: "Fxaa",
  create: (i, e) => e.fxaa,
  props: []
});
var Tr = _({
  name: "NightVisionStage",
  props: [],
  create: () => PostProcessStageLibrary_default.createNightVisionStage()
});
var Kt = ["enabled", "selected"];
var Jt = ["inputPreviousStageTexture", "name", "stages", "uniforms"];
var $r = a({
  name: "PostProcessStageComposite",
  create(i, e) {
    if (!i.scene) return;
    const n = new PostProcessStageComposite_default(e);
    return typeof e.enabled == "boolean" && (n.enabled = e.enabled), e.selected && (n.selected = e.selected), i.scene.postProcessStages.add(n), n;
  },
  destroy(i, e) {
    e.scene && !e.scene.isDestroyed() && e.scene.postProcessStages.remove(i), i.isDestroyed() || i.destroy();
  },
  cesiumProps: Kt,
  cesiumReadonlyProps: Jt
});
var kr = _({
  name: "AmbientOcclusion",
  create: (i, e) => e.ambientOcclusion,
  props: [
    "ambientOcclusionOnly",
    "bias",
    "delta",
    "frustumLength",
    "intensity",
    "lengthCap",
    "sigma",
    "stepSize"
  ],
  noMount: true
});
var Lr = _({
  name: "Bloom",
  create: (i, e) => e.bloom,
  props: ["brightness", "contrast", "delta", "glowOnly", "sigma", "stepSize"],
  noMount: true
});
var Or = _({
  name: "BlurStage",
  props: ["delta", "sigma", "stepSize"],
  create: () => PostProcessStageLibrary_default.createBlurStage()
});
var Ar = _({
  name: "DepthOfFieldStage",
  props: ["delta", "focalDistance", "sigma", "stepSize"],
  create: () => PostProcessStageLibrary_default.createDepthOfFieldStage()
});
var _r = _({
  name: "EdgeDetectionStage",
  props: ["color", "length"],
  create: () => PostProcessStageLibrary_default.createEdgeDetectionStage()
});
var Br = _({
  name: "SilhouetteStage",
  props: ["color", "length"],
  create: () => PostProcessStageLibrary_default.createSilhouetteStage()
});
var Zt = [
  "appearance",
  "cull",
  "debugShowBoundingVolume",
  "depthFailAppearance",
  "modelMatrix",
  "shadows",
  "show"
];
var Xt = [
  "allowPicking",
  "asynchronous",
  "compressVertices",
  "geometryInstances",
  "interleave",
  "releaseGeometryInstances",
  "vertexCacheOptimize"
];
var Qt = ["onReady"];
var Gr = a({
  name: "Primitive",
  create(i, e) {
    var o;
    if (!i.primitiveCollection) return;
    const n = new Primitive_default(e);
    if (e.onReady) {
      const r = () => {
        var s, u;
        n.ready && ((s = e.onReady) == null || s.call(e, n), (u = i.scene) == null || u.postRender.removeEventListener(r));
      };
      (o = i.scene) == null || o.postRender.addEventListener(r);
    }
    return i.primitiveCollection.add(n), n;
  },
  destroy(i, e) {
    e.primitiveCollection && !e.primitiveCollection.isDestroyed() && e.primitiveCollection.remove(i), i.isDestroyed() || i.destroy();
  },
  cesiumProps: Zt,
  cesiumReadonlyProps: Xt,
  otherProps: Qt,
  useCommonEvent: true
});
var eo = [
  "classificationType",
  "coordinates",
  "height",
  "heightReference",
  "extrudedHeight",
  "extrudedHeightReference",
  "show",
  "fill",
  "material",
  "outline",
  "outlineColor",
  "outlineWidth",
  "rotation",
  "stRotation",
  "granularity",
  "shadows",
  "distanceDisplayCondition",
  "zIndex"
];
var io = {
  onDefinitionChange: "definitionChanged"
};
var Wr = a({
  name: "RectangleGraphics",
  create(i, e) {
    if (!i.entity) return;
    const n = new RectangleGraphics_default(e);
    return i.entity.rectangle = n, n;
  },
  destroy(i, e) {
    e.entity && (e.entity.rectangle = void 0);
  },
  cesiumProps: eo,
  cesiumEventProps: io
});
var no = [
  "backgroundColor",
  "completeMorphOnUserInput",
  "debugCommandFilter",
  "debugShowCommands",
  "debugShowDepthFrustum",
  "debugShowFramesPerSecond",
  "debugShowFrustumPlanes",
  "debugShowFrustums",
  "eyeSeparation",
  "farToNearRatio",
  "focalLength",
  "fog",
  "gamma",
  "globe",
  "highDynamicRange",
  "invertClassification",
  "invertClassificationColor",
  "light",
  "logarithmicDepthBuffer",
  "logarithmicDepthFarToNearRatio",
  "maximumRenderTimeChange",
  "minimumDisableDepthTestDistance",
  // "mode", // enable morph with animation
  "moon",
  "morphTime",
  "nearToFarDistance2D",
  "pickTranslucentDepth",
  "requestRenderMode",
  "rethrowRenderErrors",
  "shadowMap",
  "skyAtmosphere",
  "skyBox",
  "specularEnvironmentMaps",
  "sphericalHarmonicCoefficients",
  "sun",
  "sunBloom",
  "terrainProvider",
  "useDepthPicking",
  "useWebVR",
  "postProcessStages",
  "msaaSamples",
  "splitPosition",
  "debugCommandFilter",
  "verticalExaggeration",
  "verticalExaggerationRelativeHeight",
  "atmosphere"
];
var to = {
  onMorphComplete: "morphComplete",
  onMorphStart: "morphStart",
  onPostRender: "postRender",
  onPreRender: "preRender",
  onPreUpdate: "preUpdate",
  onPostUpdate: "postUpdate",
  onRenderError: "renderError",
  onTerrainProviderChange: "terrainProviderChanged"
};
var oo = ["mode", "morphDuration"];
var Ze = (i, e, n) => {
  switch (e) {
    case SceneMode_default.SCENE2D:
      i.morphTo2D(n);
      break;
    case SceneMode_default.COLUMBUS_VIEW:
      i.morphToColumbusView(n);
      break;
    case SceneMode_default.SCENE3D:
      i.morphTo3D(n);
      break;
  }
};
var Fr = a({
  name: "Scene",
  create(i, e) {
    return i.scene && e.mode && Ze(i.scene, e.mode, e.morphDuration), i.scene;
  },
  update(i, e, n) {
    e.mode !== n.mode && e.mode && Ze(i, e.mode, e.morphDuration);
  },
  cesiumProps: no,
  cesiumEventProps: to,
  otherProps: oo,
  setCesiumPropsAfterCreate: true
});
var ro = [
  "bounceAnimationTime",
  "enableCollisionDetection",
  "enableInputs",
  "enableLook",
  "enableRotate",
  "enableTilt",
  "enableTranslate",
  "enableZoom",
  "zoomFactor",
  "maximumTiltAngle",
  "inertiaSpin",
  "inertiaTranslate",
  "inertiaZoom",
  "lookEventTypes",
  "maximumMovementRatio",
  "maximumZoomDistance",
  "minimumCollisionTerrainHeight",
  "minimumPickingTerrainHeight",
  "minimumTrackBallHeight",
  "minimumZoomDistance",
  "rotateEventTypes",
  "tiltEventTypes",
  "translateEventTypes",
  "zoomEventTypes",
  "minimumPickingTerrainDistanceWithInertia"
];
var Ur = a({
  name: "ScreenSpaceCameraController",
  create: (i) => {
    var e;
    return (e = i.scene) == null ? void 0 : e.screenSpaceCameraController;
  },
  cesiumProps: ro,
  setCesiumPropsAfterCreate: true
});
var Vr = ({ action: i, modifier: e, type: n }) => {
  const o = we();
  return (0, import_react.useEffect)(() => {
    if (!(!o.screenSpaceEventHandler || o.screenSpaceEventHandler.isDestroyed())) {
      if (i)
        return o.screenSpaceEventHandler.setInputAction(i, n, e), () => {
          !o.screenSpaceEventHandler || o.screenSpaceEventHandler.isDestroyed() || o.screenSpaceEventHandler.removeInputAction(n, e);
        };
      o.screenSpaceEventHandler.removeInputAction(n, e);
    }
  }, [i, o.screenSpaceEventHandler, e, n]), null;
};
var Ir = a({
  name: "ScreenSpaceEventHandler",
  create(i, e) {
    var n;
    return e.useDefault ? (n = i.cesiumWidget) == null ? void 0 : n.screenSpaceEventHandler : i.scene ? new ScreenSpaceEventHandler_default(i.scene.canvas) : void 0;
  },
  destroy(i) {
    i.isDestroyed() || i.destroy();
  },
  provide(i) {
    return {
      screenSpaceEventHandler: i
    };
  }
});
var so = [
  "darkness",
  "fadingEnabled",
  "maximumDistance",
  "enabled",
  "normalOffset",
  "softShadows",
  "size"
];
var jr = a({
  name: "ShadowMap",
  create: (i) => {
    var e;
    return (e = i.scene) == null ? void 0 : e.shadowMap;
  },
  cesiumProps: so
});
var ao = [
  "brightnessShift",
  "hueShift",
  "saturationShift",
  "show",
  "perFragmentAtmosphere",
  "atmosphereLightIntensity",
  "atmosphereRayleighCoefficient",
  "atmosphereMieCoefficient",
  "atmosphereRayleighScaleHeight",
  "atmosphereMieScaleHeight",
  "atmosphereMieAnisotropy"
];
var Nr = a({
  name: "SkyAtmosphere",
  create: (i) => {
    var e;
    return (e = i.scene) == null ? void 0 : e.skyAtmosphere;
  },
  cesiumProps: ao,
  setCesiumPropsAfterCreate: true
});
var co = ["sources", "show"];
var Hr = a({
  name: "SkyBox",
  create: (i) => {
    var e;
    return (e = i.scene) == null ? void 0 : e.skyBox;
  },
  cesiumProps: co,
  setCesiumPropsAfterCreate: true
});
var lo = ["glowFactor", "show"];
var zr = a({
  name: "Sun",
  create(i) {
    if (!i.scene) return;
    const e = new Sun_default();
    return i.scene.sun = e, e;
  },
  destroy(i, e) {
    e.scene && !e.scene.isDestroyed() && (e.scene.sun = new Sun_default());
  },
  cesiumProps: lo,
  setCesiumPropsAfterCreate: true
});
var uo = [
  "clippingPlanes",
  "maximumMemoryUsage",
  "modelMatrix",
  "shadows",
  "show",
  "style",
  "intervals"
];
var mo = ["clock", "shading"];
var fo = ["onReady"];
var ho = {
  onFrameChange: "frameChanged"
};
var xr = a({
  name: "TimeDynamicPointCloud",
  create(i, e) {
    var o;
    if (!i.cesiumWidget || !i.primitiveCollection || !((o = i.cesiumWidget) != null && o.clock))
      return;
    const n = new TimeDynamicPointCloud_default({
      ...e,
      clock: e.clock ?? i.cesiumWidget.clock
    });
    if (e.onReady) {
      const r = () => {
        var s;
        (s = e.onReady) == null || s.call(e, n), n.frameChanged.removeEventListener(r);
      };
      n.frameChanged.addEventListener(r);
    }
    return i.primitiveCollection.add(n), n;
  },
  destroy(i, e) {
    e.primitiveCollection && !e.primitiveCollection.isDestroyed() && e.primitiveCollection.remove(i), i.isDestroyed() || i.destroy();
  },
  cesiumProps: uo,
  cesiumReadonlyProps: mo,
  cesiumEventProps: ho,
  otherProps: fo,
  useCommonEvent: true
});
var yo = [
  "terrainShadows",
  "clockTrackedDataSource",
  "targetFrameRate",
  "useDefaultRenderLoop",
  "resolutionScale",
  "allowDataSourcesToSuspendAnimation",
  "trackedEntity",
  "ellipsoid",
  "selectedEntity",
  "shadows",
  "useBrowserRecommendedResolution",
  "creditDisplay"
];
var go = [
  "baseLayer",
  "animation",
  "baseLayerPicker",
  "fullscreenButton",
  "vrButton",
  "geocoder",
  "homeButton",
  "infoBox",
  "sceneModePicker",
  "selectionIndicator",
  "timeline",
  "navigationHelpButton",
  "navigationInstructionsInitiallyVisible",
  "scene3DOnly",
  "shouldAnimate",
  "clockViewModel",
  "selectedImageryProviderViewModel",
  "imageryProviderViewModels",
  "selectedTerrainProviderViewModel",
  "terrainProviderViewModels",
  "skyBox",
  "skyAtmosphere",
  "fullscreenElement",
  "showRenderLoopErrors",
  "automaticallyTrackDataSourceClocks",
  "contextOptions",
  "sceneMode",
  "mapProjection",
  "globe",
  "orderIndependentTranslucency",
  "creditContainer",
  "creditViewport",
  "dataSources",
  "mapMode2D",
  "projectionPicker",
  "requestRenderMode",
  "maximumRenderTimeChange",
  "depthPlaneEllipsoidOffset",
  "msaaSamples",
  "blurActiveElementOnCanvasFocus",
  "terrain"
];
var po = {
  onSelectedEntityChange: "selectedEntityChanged",
  onTrackedEntityChange: "trackedEntityChanged"
};
var vo = [
  "className",
  "id",
  "style",
  "full",
  "containerProps",
  "extend",
  "terrainProvider"
];
var qr = a({
  name: "Viewer",
  async create(i, { baseLayer: e, terrainProvider: n, ...o }, r) {
    if (!r) return;
    let s;
    K(n) ? s = await n : s = n;
    const u = new Viewer_default(r, {
      ...o,
      terrainProvider: s,
      baseLayer: e === false ? void 0 : e
    });
    if (!u) return;
    e === false && u.imageryLayers.removeAll(), u && o.extend && (Array.isArray(o.extend) ? o.extend.forEach((m) => {
      u.extend(m, {});
    }) : u.extend(o.extend, {}));
    const f = new Pe(u.scene);
    return [u, f];
  },
  destroy(i, e, n, o) {
    o && !o.isDestroyed() && o.destroy(), i.isDestroyed() || i.destroy();
  },
  provide(i, e, n, o) {
    return {
      viewer: i,
      cesiumWidget: i.cesiumWidget,
      dataSourceCollection: i.dataSources,
      entityCollection: i.entities,
      scene: i.scene,
      camera: i.scene.camera,
      imageryLayerCollection: i.scene.globe.imageryLayers,
      primitiveCollection: i.scene.primitives,
      globe: i.scene.globe,
      __$internal: {
        onUpdate: n == null ? void 0 : n.onUpdate,
        imageryLayerWaitingList: []
      },
      [de]: o
    };
  },
  containerProps: ({ id: i, className: e, style: n, full: o, containerProps: r }) => ({
    className: e,
    id: i,
    style: {
      ...o ? {
        position: "absolute",
        bottom: "0",
        left: "0",
        right: "0",
        top: "0"
      } : {},
      ...n
    },
    ...r
  }),
  cesiumProps: yo,
  cesiumReadonlyProps: go,
  cesiumEventProps: po,
  otherProps: vo,
  renderContainer: true,
  useCommonEvent: true,
  useRootEvent: true
});
var Co = [
  "positions",
  "maximumHeights",
  "minimumHeights",
  "show",
  "fill",
  "material",
  "outline",
  "outlineColor",
  "outlineWidth",
  "granularity",
  "shadows",
  "distanceDisplayCondition"
];
var Po = {
  onDefinitionChange: "definitionChanged"
};
var Yr = a({
  name: "WallGraphics",
  create(i, e) {
    if (!i.entity) return;
    const n = new WallGraphics_default(e);
    return i.entity.wall = n, n;
  },
  destroy(i, e) {
    e.entity && (e.entity.wall = void 0);
  },
  cesiumProps: Co,
  cesiumEventProps: Po
});
export {
  kr as AmbientOcclusion,
  Mo as Billboard,
  To as BillboardCollection,
  $o as BillboardGraphics,
  br as BlackAndWhiteStage,
  Lr as Bloom,
  Or as BlurStage,
  ko as BoxGraphics,
  Dr as BrightnessStage,
  Lo as Camera,
  Oo as CameraFlyHome,
  Ao as CameraFlyTo,
  Bo as CameraFlyToBoundingSphere,
  _o as CameraLookAt,
  Go as Cesium3DTileset,
  Wo as Cesium3DTilesetGraphics,
  ke as CesiumContext,
  Fo as CesiumWidget,
  Uo as ClassificationPrimitive,
  Vo as Clock,
  Io as CloudCollection,
  Zi as Consumer,
  jo as CorridorGraphics,
  No as CumulusCloud,
  Ho as CustomDataSource,
  zo as CylinderGraphics,
  xo as CzmlDataSource,
  Ar as DepthOfFieldStage,
  _r as EdgeDetectionStage,
  qo as EllipseGraphics,
  Yo as EllipsoidGraphics,
  Ko as Entity,
  Jo as EntityDescription,
  Pe as EventManager,
  Zo as Fog,
  Mr as Fxaa,
  Xo as GeoJsonDataSource,
  Qo as Globe,
  er as GroundPolylinePrimitive,
  ir as GroundPrimitive,
  nr as GroundPrimitiveCollection,
  tr as ImageryLayer,
  or as ImageryLayerCollection,
  rr as KmlDataSource,
  sr as Label,
  ar as LabelCollection,
  cr as LabelGraphics,
  Rr as LensFlareStage,
  lr as Model,
  ur as ModelGraphics,
  dr as Moon,
  Tr as NightVisionStage,
  mr as ParticleSystem,
  fr as PathGraphics,
  hr as PlaneGraphics,
  yr as PointGraphics,
  gr as PointPrimitive,
  pr as PointPrimitiveCollection,
  vr as PolygonGraphics,
  Cr as Polyline,
  Pr as PolylineCollection,
  Er as PolylineGraphics,
  wr as PolylineVolumeGraphics,
  Sr as PostProcessStage,
  $r as PostProcessStageComposite,
  Gr as Primitive,
  Do as Provider,
  Wr as RectangleGraphics,
  Fr as Scene,
  Ur as ScreenSpaceCameraController,
  Vr as ScreenSpaceEvent,
  Ir as ScreenSpaceEventHandler,
  jr as ShadowMap,
  Br as SilhouetteStage,
  Nr as SkyAtmosphere,
  Hr as SkyBox,
  zr as Sun,
  xr as TimeDynamicPointCloud,
  qr as Viewer,
  Yr as WallGraphics,
  Se as createCameraOperation,
  a as createCesiumComponent,
  _ as createPostProcessStage,
  Te as entries,
  de as eventManagerContextKey,
  $e as eventNames,
  ge as includes,
  on as isDestroyable,
  rn as isDestroyed,
  K as isPromise,
  nn as pick,
  tn as shallowEquals,
  we as useCesium,
  sn as useCesiumComponent,
  Ro as withCesium
};
/*! Bundled license information:

resium/dist/resium.mjs:
  (**
   * @license React
   * react-jsx-runtime.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

resium/dist/resium.mjs:
  (**
   * @license React
   * react-jsx-runtime.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=resium.js.map
