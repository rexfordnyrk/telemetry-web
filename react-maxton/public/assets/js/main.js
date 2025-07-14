$(function () {
  "use strict";

  /* scrollar */

  // Initialize PerfectScrollbar only if elements exist
  if (document.querySelector(".notify-list")) {
    new PerfectScrollbar(".notify-list");
  }

  if (document.querySelector(".search-content")) {
    new PerfectScrollbar(".search-content");
  }

  // new PerfectScrollbar(".mega-menu-widgets")

  /* toggle button */

  $(".btn-toggle").click(function () {
    $("body").hasClass("toggled")
      ? ($("body").removeClass("toggled"),
        $(".sidebar-wrapper").unbind("hover"))
      : ($("body").addClass("toggled"),
        $(".sidebar-wrapper").hover(
          function () {
            $("body").addClass("sidebar-hovered");
          },
          function () {
            $("body").removeClass("sidebar-hovered");
          },
        ));
  });

  /* menu */

  $(function () {
    // Only initialize MetisMenu if element exists
    if (document.getElementById("sidenav")) {
      $("#sidenav").metisMenu();
    }
  });

  $(".sidebar-close").on("click", function () {
    $("body").removeClass("toggled");
  });

  /* dark mode button */

  $(".dark-mode i").click(function () {
    $(this).text(function (i, v) {
      return v === "dark_mode" ? "light_mode" : "dark_mode";
    });
  });
});
