define(["dust", "dusthelpers"], function(dust, dust_helpers) {
  // javascript/templates/demo-wrapper.dust
  (function() {
    dust.register("demo-wrapper", body_0);

    function body_0(chk, ctx) {
      return chk.w("<div></div><div class=\"childViewContainer\"></div>");
    }
    body_0.__dustBody = !0;
    return body_0;
  })();
  // javascript/templates/hello-world.dust
  (function() {
    dust.register("hello-world", body_0);

    function body_0(chk, ctx) {
      return chk.w("Hello World");
    }
    body_0.__dustBody = !0;
    return body_0;
  })();
  // javascript/templates/hello_world.dust
  (function() {
    dust.register("hello_world", body_0);

    function body_0(chk, ctx) {
      return chk.w("<div>Hello World</div>");
    }
    body_0.__dustBody = !0;
    return body_0;
  })();
  // javascript/templates/individual-example.dust
  (function() {
    dust.register("individual-example", body_0);

    function body_0(chk, ctx) {
      return chk.w("<h3>").f(ctx.get(["title"], false), ctx, "h").w("</h3><span class=\"description\"></span><div class=\"exampleContainer group\"><div class=\"jsonContent\"></div><div class=\"wizardView\"></div></div>");
    }
    body_0.__dustBody = !0;
    return body_0;
  })();
  // javascript/templates/json-content.dust
  (function() {
    dust.register("json-content", body_0);

    function body_0(chk, ctx) {
      return chk;
    }
    body_0.__dustBody = !0;
    return body_0;
  })();
  // javascript/templates/simple-wizard-view.dust
  (function() {
    dust.register("simple-wizard-view", body_0);

    function body_0(chk, ctx) {
      return chk.w("<div class=\"contentDiv\"></div>");
    }
    body_0.__dustBody = !0;
    return body_0;
  })();
  define("demo-wrapper", function() {
    return function(locals, callback) {
      var rendered;

      dust.render("demo-wrapper", locals, function(err, result) {
        if (typeof callback === "function") {
          try {
            callback(err, result);
          } catch (e) {}
        }

        if (err) {
          throw err
        } else {
          rendered = result;
        }
      });

      return rendered;
    }
  });
  define("hello-world", function() {
    return function(locals, callback) {
      var rendered;

      dust.render("hello-world", locals, function(err, result) {
        if (typeof callback === "function") {
          try {
            callback(err, result);
          } catch (e) {}
        }

        if (err) {
          throw err
        } else {
          rendered = result;
        }
      });

      return rendered;
    }
  });
  define("hello_world", function() {
    return function(locals, callback) {
      var rendered;

      dust.render("hello_world", locals, function(err, result) {
        if (typeof callback === "function") {
          try {
            callback(err, result);
          } catch (e) {}
        }

        if (err) {
          throw err
        } else {
          rendered = result;
        }
      });

      return rendered;
    }
  });
  define("individual-example", function() {
    return function(locals, callback) {
      var rendered;

      dust.render("individual-example", locals, function(err, result) {
        if (typeof callback === "function") {
          try {
            callback(err, result);
          } catch (e) {}
        }

        if (err) {
          throw err
        } else {
          rendered = result;
        }
      });

      return rendered;
    }
  });
  define("json-content", function() {
    return function(locals, callback) {
      var rendered;

      dust.render("json-content", locals, function(err, result) {
        if (typeof callback === "function") {
          try {
            callback(err, result);
          } catch (e) {}
        }

        if (err) {
          throw err
        } else {
          rendered = result;
        }
      });

      return rendered;
    }
  });
  define("simple-wizard-view", function() {
    return function(locals, callback) {
      var rendered;

      dust.render("simple-wizard-view", locals, function(err, result) {
        if (typeof callback === "function") {
          try {
            callback(err, result);
          } catch (e) {}
        }

        if (err) {
          throw err
        } else {
          rendered = result;
        }
      });

      return rendered;
    }
  });
  return ["demo-wrapper", "hello-world", "hello_world", "individual-example", "json-content", "simple-wizard-view"];
});