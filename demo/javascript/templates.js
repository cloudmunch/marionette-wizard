define(["dust", "dusthelpers"], function(dust, dust_helpers) {
  // javascript/templates/hello_world.dust
  (function() {
    dust.register("hello_world", body_0);

    function body_0(chk, ctx) {
      return chk.w("<div>Hello World</div>");
    }
    body_0.__dustBody = !0;
    return body_0;
  })();
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