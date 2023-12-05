/**
 * Template Name: Eterna
 * Updated: Sep 18 2023 with Bootstrap v5.3.2
 * Template URL: https://bootstrapmade.com/eterna-free-multipurpose-bootstrap-template/
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */
(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener);
  };

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select("#header");
    let offset = header.offsetHeight;

    if (!header.classList.contains("header-scrolled")) {
      offset -= 16;
    }

    let elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos - offset,
      behavior: "smooth",
    });
  };

  /**
   * Header fixed top on scroll
   */
  let selectHeader = select("#header");
  if (selectHeader) {
    let headerOffset = selectHeader.offsetTop;
    let nextElement = selectHeader.nextElementSibling;
    const headerFixed = () => {
      if (headerOffset - window.scrollY <= 0) {
        selectHeader.classList.add("fixed-top");
        nextElement.classList.add("scrolled-offset");
      } else {
        selectHeader.classList.remove("fixed-top");
        nextElement.classList.remove("scrolled-offset");
      }
    };
    window.addEventListener("load", headerFixed);
    onscroll(document, headerFixed);
  }

  /**
   * Back to top button
   */
  let backtotop = select(".back-to-top");
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add("active");
      } else {
        backtotop.classList.remove("active");
      }
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /**
   * Mobile nav toggle
   */
  on("click", ".mobile-nav-toggle", function (e) {
    select("#navbar").classList.toggle("navbar-mobile");
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  /**
   * Mobile nav dropdowns activate
   */
  on(
    "click",
    ".navbar .dropdown > a",
    function (e) {
      if (select("#navbar").classList.contains("navbar-mobile")) {
        e.preventDefault();
        this.nextElementSibling.classList.toggle("dropdown-active");
      }
    },
    true
  );

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on(
    "click",
    ".scrollto",
    function (e) {
      if (select(this.hash)) {
        e.preventDefault();

        let navbar = select("#navbar");
        if (navbar.classList.contains("navbar-mobile")) {
          navbar.classList.remove("navbar-mobile");
          let navbarToggle = select(".mobile-nav-toggle");
          navbarToggle.classList.toggle("bi-list");
          navbarToggle.classList.toggle("bi-x");
        }
        scrollto(this.hash);
      }
    },
    true
  );

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener("load", () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Hero carousel indicators
   */
  let heroCarouselIndicators = select("#hero-carousel-indicators");
  let heroCarouselItems = select("#heroCarousel .carousel-item", true);

  heroCarouselItems.forEach((item, index) => {
    index === 0
      ? (heroCarouselIndicators.innerHTML +=
        "<li data-bs-target='#heroCarousel' data-bs-slide-to='" +
        index +
        "' class='active'></li>")
      : (heroCarouselIndicators.innerHTML +=
        "<li data-bs-target='#heroCarousel' data-bs-slide-to='" +
        index +
        "'></li>");
  });

  // ----------------------------------------- //
  // Check if the user is logged in by checking if the "user" key exists in localStorage
  const currUser = JSON.parse(localStorage.getItem("user"));
  const bestSellerCity = localStorage.getItem("best_seller_city");
  if (!bestSellerCity && currUser) getUserCity();
  if (currUser) {
    // Define navigation items with title, link, and show properties
    const NAV_ITEMS = [
      {
        title: "Home",
        link: "index.html",
        role: ['admin', 'user'],
        show: true,
      },
      {
        title: "Explore Books",
        link: "explore.html",
        role: ['admin', 'user'],
        show: true,
      },
      {
        title: "My Book",
        link: "books.html",
        role: ['admin', 'user'],
        show: currUser?.id ? true : false, // Show only if the user is logged in,
      },
      {
        title: "My Reviews",
        link: "my-reviews.html",
        role: ['admin', 'user'],
        show: currUser?.id ? true : false, // Show only if the user is logged in
      },
      {
        title: "Profile",
        link: "user-profile.html",
        role: ['admin', 'user'],
        show: currUser?.id ? true : false, // Show only if the user is logged in
      },
      {
        title: "Location Best Seller",
        link: "best-sellers.html",
        role: ['admin'],
        show: currUser?.id ? true : false, // Show only if the user is logged in
      },
      {
        title: "Logout",
        link: "logout.html",
        role: ['admin', 'user'],
        show: currUser?.id ? true : false, // Show only if the user is logged in
      },
    ];

    // Select the navigation items container in the HTML
    const navigationItems = document.querySelector("#navbar ul");

    // Clear the existing content and create a new unordered list
    navigationItems.innerHTML = "<ul></ul>";

    // Filter NAV_ITEMS on base of role
    const FILTERED_NAV_ITEMS = NAV_ITEMS.filter(item => item.role.includes(currUser?.role));

    // Iterate over each navigation item and create list items dynamically
    FILTERED_NAV_ITEMS.forEach((item) => {
      if (item.show) {
        // Create a list item
        const li = document.createElement("li");

        // Set the inner HTML of the list item with a link
        li.innerHTML = `<a href=${item.link} class=${window.location.href.includes(item.link) ? "active" : ""
          }> ${item.title} </a>`;

        // Append the list item to the unordered list
        navigationItems.appendChild(li);
      }
    });
  }

  async function getUserCity() {
    try {
      const response = await axios.get(`https://ipinfo.io/103.18.10.50?token=78b50100a80b1b`);
      if (response.status === 200) {
        localStorage.setItem("best_seller_city", response.data.city)
      }

    } catch (error) {
      console.error("Error getting user city from IP:", error);
    }
    return null;
  }


})();
function toTitleCase(str) {
  return str.replace(/\b\w/g, function(match) {
    return match.toUpperCase();
  });
}