(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".js-demo-auth-form").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
      });
    });
  });
})();
