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
  // javascript/templates/first-screen.dust
  (function() {
    dust.register("first-screen", body_0);

    function body_0(chk, ctx) {
      return chk.w("<div>First Screen</div><div><button class=\"next\">Next</button></div>");
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
      return chk.w("<h3>").f(ctx.get(["title"], false), ctx, "h").w("</h3><span class=\"description\"></span><div class=\"row group\"><h4 class=\"column\">JSON</h4><h4 class=\"column\">Wizard</h4></div><div class=\"exampleContainer group row\"><div class=\"jsonContent column\"></div><div class=\"wizardView column\"></div></div>");
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
  // javascript/templates/second-screen.dust
  (function() {
    dust.register("second-screen", body_0);

    function body_0(chk, ctx) {
      return chk.w("<div>Second Screen</div>");
    }
    body_0.__dustBody = !0;
    return body_0;
  })();
  // javascript/templates/simple-decider.dust
  (function() {
    dust.register("simple-decider", body_0);

    function body_0(chk, ctx) {
      return chk.w("<div><input type=\"radio\" val=\"hello-world\" name=\"decider\"/><span>Yes</span><input type=\"radio\" val=\"second-screen\" name=\"decider\"/><span>No</span></div><div><button class=\"next\">Next</button></div>");
    }
    body_0.__dustBody = !0;
    return body_0;
  })();
  // javascript/templates/simple-wizard-view.dust
  (function() {
    dust.register("simple-wizard-view", body_0);

    function body_0(chk, ctx) {
      return chk.w("<div class=\"contentDiv\"></div><div class=\"\"><button class=\"exitButton\">Exit</button><button class=\"previousButton\" style=\"display:none;\">Previous</button></div>");
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
  define("first-screen", function() {
    return function(locals, callback) {
      var rendered;

      dust.render("first-screen", locals, function(err, result) {
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
  define("second-screen", function() {
    return function(locals, callback) {
      var rendered;

      dust.render("second-screen", locals, function(err, result) {
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
  define("simple-decider", function() {
    return function(locals, callback) {
      var rendered;

      dust.render("simple-decider", locals, function(err, result) {
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
  return ["demo-wrapper", "first-screen", "hello-world", "hello_world", "individual-example", "json-content", "second-screen", "simple-decider", "simple-wizard-view"];
});