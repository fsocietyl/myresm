(() => {
    const yearTargets = document.querySelectorAll(".js-year");
    const currentYear = new Date().getFullYear();
    yearTargets.forEach((node) => {
        node.textContent = String(currentYear);
    });

    const navLinks = document.querySelectorAll(".nav-link");
    const navMenu = document.getElementById("navMenu");
    const navToggle = document.querySelector(".nav-toggle");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const prefersLightScheme = window.matchMedia("(prefers-color-scheme: light)").matches;

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

    const typingTargets = document.querySelectorAll(".js-typing");
    if (typingTargets.length && !prefersReducedMotion) {
        typingTargets.forEach((target) => {
            const text = target.dataset.text || target.textContent.trim();
            if (!text) return;
            target.textContent = "";
            let index = 0;
            const typeNext = () => {
                target.textContent += text.charAt(index);
                index += 1;
                if (index < text.length) {
                    window.setTimeout(typeNext, 70);
                }
            };
            window.setTimeout(typeNext, 300);
        });
    }

    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        const formStatus = document.getElementById("formStatus");
        const fields = {
            name: contactForm.querySelector("#contactName"),
            email: contactForm.querySelector("#contactEmail"),
            message: contactForm.querySelector("#contactMessage"),
        };

        const errorFor = (key) =>
            contactForm.querySelector(`[data-error-for="${key}"]`);

        const setError = (key, message) => {
            const field = fields[key];
            const errorNode = errorFor(key);
            if (field) field.classList.toggle("input-error", Boolean(message));
            if (errorNode) errorNode.textContent = message || "";
        };

        const validate = () => {
            let valid = true;
            const nameValue = fields.name.value.trim();
            const emailValue = fields.email.value.trim();
            const messageValue = fields.message.value.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (nameValue.length < 2) {
                setError("name", "Please enter your name.");
                valid = false;
            } else {
                setError("name", "");
            }

            if (!emailPattern.test(emailValue)) {
                setError("email", "Please enter a valid email address.");
                valid = false;
            } else {
                setError("email", "");
            }

            if (messageValue.length < 10) {
                setError("message", "Message should be at least 10 characters.");
                valid = false;
            } else {
                setError("message", "");
            }

            return valid;
        };

        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();
            if (formStatus) formStatus.textContent = "";
            if (!validate()) return;

            const subject = encodeURIComponent("Contact from Portfolio");
            const bodyLines = [
                `Name: ${fields.name.value.trim()}`,
                `Email: ${fields.email.value.trim()}`,
                "",
                fields.message.value.trim(),
            ];
            const body = encodeURIComponent(bodyLines.join("\n"));
            const mailtoLink = `mailto:spacewalkersa@gmail.com?subject=${subject}&body=${body}`;

            if (formStatus) {
                formStatus.textContent = "Opening your email client...";
            }
            window.location.href = mailtoLink;
            contactForm.reset();
        });
    }

    const themeToggle = document.createElement("button");
    themeToggle.className = "theme-toggle";
    themeToggle.type = "button";
    themeToggle.setAttribute("aria-label", "Toggle theme");
    const setThemeIcon = (isLight) => {
        themeToggle.innerHTML = isLight ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    };

    const savedTheme = localStorage.getItem("theme");
    const initialLight = savedTheme ? savedTheme === "light" : prefersLightScheme;
    document.body.classList.toggle("theme-light", initialLight);
    setThemeIcon(initialLight);
    document.body.appendChild(themeToggle);

    themeToggle.addEventListener("click", () => {
        const isLight = document.body.classList.toggle("theme-light");
        localStorage.setItem("theme", isLight ? "light" : "dark");
        setThemeIcon(isLight);
    });

    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    document.body.appendChild(progressBar);

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

    const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${progress}%`;
    };

    const handleScroll = () => {
        toggleBackToTop();
        updateProgress();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
})();
