define(["dust", "dusthelpers"], function(dust, dust_helpers) {
  // javascript/templates/demo-wrapper.dust
  (function() {
    dust.register("demo-wrapper", body_0);

    function body_0(chk, ctx) {
      return chk.w("<div class=\"jsonContent\"></div><div class=\"wizardView\"></div>");
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
  return ["demo-wrapper", "json-content"];
});