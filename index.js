// ✅ Always fade the page in — no blank screen risk
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

document.addEventListener("DOMContentLoaded", () => {
  const main = document.getElementById("main-content");
  const menuIcon = document.querySelector(".dropdown-icon");
  const dropdown = document.querySelector(".dropdown-content");
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const overlay = document.getElementById("transition-overlay");

  // ✅ Route table
  const routes = {
    "/": "partials/home.html",
    "/products.html": "partials/products.html",
    "/about.html": "partials/about.html",
    "/contact.html": "partials/contact.html"
  };

  // ✅ Fade helpers
  function fadeOut(callback) {
    overlay?.classList.add("active");

    const bg1 = document.getElementById("bg1");
    const bg2 = document.getElementById("bg2");
    if (bg1) bg1.style.opacity = "0";
    if (bg2) bg2.style.opacity = "0";

    setTimeout(callback, 400);
  }

  function fadeIn() {
    overlay?.classList.remove("active");
    document.body.classList.remove("fade-out");
    document.body.classList.add("loaded");

    const bg1 = document.getElementById("bg1");
    const bg2 = document.getElementById("bg2");
    if (bg1) bg1.style.opacity = "1";
    if (bg2) bg2.style.opacity = "1";
  }

  // ✅ Load dynamic content
  async function loadPage(path) {
    const file = routes[path];
    if (!file) {
      main.innerHTML = "<p>404 - Page Not Found</p>";
      fadeIn();
      return;
    }

    try {
      const res = await fetch(file);
      const html = await res.text();
      main.innerHTML = html;
      fadeIn();
    } catch {
      main.innerHTML = "<p>Failed to load content.</p>";
      fadeIn();
    }
  }

  // ✅ Initial page load
  loadPage(window.location.pathname);

  // ✅ Handle SPA link clicks
  document.body.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (
      link &&
      link.origin === window.location.origin &&
      link.getAttribute("href") in routes
    ) {
      e.preventDefault();
      const path = link.getAttribute("href");

      document.body.classList.remove("loaded");
      document.body.classList.add("fade-out");

      fadeOut(() => {
        history.pushState({}, "", path);
        loadPage(path);
      });
    }
  });

  // ✅ Back/forward button support
  window.addEventListener("popstate", () => {
    document.body.classList.remove("loaded");
    document.body.classList.add("fade-out");

    fadeOut(() => {
      loadPage(window.location.pathname);
    });
  });

  // ✅ Mobile dropdown menu
  menuIcon?.addEventListener("click", () => {
    dropdown.classList.toggle("show");
  });

  document.querySelectorAll(".dropdown-content a").forEach((link) => {
    link.addEventListener("click", () => {
      dropdown.classList.remove("show");
    });
  });

  document.addEventListener("click", (event) => {
    if (
      !menuIcon?.contains(event.target) &&
      !dropdown?.contains(event.target)
    ) {
      dropdown?.classList.remove("show");
    }
  });

  // ✅ Form submission
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: formData,
          headers: {
            Accept: "application/json"
          }
        });

        if (response.ok) {
          status.textContent = "Message sent! ✅";
          status.style.color = "green";
          form.reset();
        } else {
          status.textContent = "Something went wrong. ❌";
          status.style.color = "red";
        }
      } catch {
        status.textContent = "Network error. Try again later. ❌";
        status.style.color = "red";
      }
    });
  }
});

// ✅ Homepage slideshow logic
if (document.body.classList.contains("home-page")) {
  const images = [
    "images/store3.jpg",
    "images/store1.jpg",
    "images/store12.jpg",
    "images/store15.jpg"
  ];

  let current = 0;
  let showingFirst = true;

  const bg1 = document.createElement("div");
  const bg2 = document.createElement("div");
  bg1.id = "bg1";
  bg2.id = "bg2";
  bg1.className = bg2.className = "background-layer";

  document.body.appendChild(bg1);
  document.body.appendChild(bg2);

  bg1.style.backgroundImage = `url('${images[0]}')`;
  bg2.style.backgroundImage = `url('${images[1]}')`;

  function crossfade() {
    const nextIndex = (current + 1) % images.length;

    if (showingFirst) {
      bg2.style.backgroundImage = `url('${images[nextIndex]}')`;
      bg2.style.opacity = "1";
      bg1.style.opacity = "0";
    } else {
      bg1.style.backgroundImage = `url('${images[nextIndex]}')`;
      bg1.style.opacity = "1";
      bg2.style.opacity = "0";
    }

    current = nextIndex;
    showingFirst = !showingFirst;
  }

  setInterval(crossfade, 6000);
}
