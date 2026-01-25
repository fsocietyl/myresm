(() => {
    const yearTargets = document.querySelectorAll(".js-year");
    const currentYear = new Date().getFullYear();
    yearTargets.forEach((node) => {
        node.textContent = String(currentYear);
    });

    const navLinks = document.querySelectorAll(".nav-link");
    const navMenu = document.getElementById("navMenu");
    const navToggle = document.querySelector(".nav-toggle");

    const normalize = (href) => {
        if (!href) return "";
        const clean = href.split("#")[0].split("?")[0];
        return clean.endsWith("/") ? `${clean}index.html` : clean;
    };

    const currentPath = normalize(window.location.pathname);
    let matched = false;
    navLinks.forEach((link) => {
        const linkPath = normalize(link.getAttribute("href"));
        if (linkPath && currentPath.endsWith(linkPath)) {
            navLinks.forEach((item) => item.classList.remove("active"));
            link.classList.add("active");
            matched = true;
        }
    });

    if (!matched && currentPath.endsWith("/")) {
        const fallback = Array.from(navLinks).find((link) => {
            const linkPath = normalize(link.getAttribute("href"));
            return linkPath.endsWith("index.html") || linkPath.endsWith("mainPage.html");
        });
        if (fallback) {
            navLinks.forEach((item) => item.classList.remove("active"));
            fallback.classList.add("active");
        }
    }

    if (navToggle) {
        navToggle.addEventListener("click", () => {
            const isOpen = document.body.classList.toggle("nav-open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                document.body.classList.remove("nav-open");
                navToggle.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                document.body.classList.remove("nav-open");
                navToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    const fadeTargets = document.querySelectorAll(".fade-in");
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );
        fadeTargets.forEach((target) => observer.observe(target));
    } else {
        fadeTargets.forEach((target) => target.classList.add("is-visible"));
    }

    const backToTop = document.createElement("button");
    backToTop.className = "back-to-top";
    backToTop.type = "button";
    backToTop.setAttribute("aria-label", "Back to top");
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTop);

    const toggleBackToTop = () => {
        if (window.scrollY > 300) {
            backToTop.classList.add("is-visible");
        } else {
            backToTop.classList.remove("is-visible");
        }
    };

    window.addEventListener("scroll", toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
})();
