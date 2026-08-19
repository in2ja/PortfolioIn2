// ==========================================
// INDUJA R - PORTFOLIO MAIN JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // ------------------------------------------
    // 1. Smooth scrolling
    // ------------------------------------------

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", function (e) {

            const targetId = this.getAttribute("href");

            if (targetId === "#") return;

            const target = document.querySelector(targetId);

            if (target) {
                e.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });


    // ------------------------------------------
    // 2. Navbar active link
    // ------------------------------------------

    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a");

    function updateActiveNav() {

        let currentSection = "";

        sections.forEach(section => {

            const sectionTop = section.offsetTop - 200;
            const sectionHeight = section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionTop + sectionHeight
            ) {
                currentSection = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {

            link.classList.remove("active");

            if (
                link.getAttribute("href") === `#${currentSection}`
            ) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", updateActiveNav);

    updateActiveNav();


    // ------------------------------------------
    // 3. Navbar background while scrolling
    // ------------------------------------------

    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {

        if (!navbar) return;

        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });


    // ------------------------------------------
    // 4. Reveal animations
    // ------------------------------------------

    const revealElements = document.querySelectorAll(
        ".reveal, .skill-card, .project-card, .about-content"
    );

    const observer = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    observer.unobserve(entry.target);
                }
            });

        },
        {
            threshold: 0.15
        }
    );

    revealElements.forEach(element => {
        observer.observe(element);
    });


    // ------------------------------------------
    // 5. Hero image floating effect
    // ------------------------------------------

    const heroImage = document.querySelector(".hero-image");

    if (heroImage) {

        window.addEventListener("mousemove", (e) => {

            const x = (window.innerWidth / 2 - e.clientX) / 80;
            const y = (window.innerHeight / 2 - e.clientY) / 80;

            heroImage.style.transform =
                `translate(${x}px, ${y}px)`;
        });
    }


    // ------------------------------------------
    // 6. Typing effect
    // ------------------------------------------

    const typingElement = document.querySelector(".typing-text");

    if (typingElement) {

        const words = [
            "Full Stack Developer",
            "Python Developer",
            "Django Developer",
            "Web Developer"
        ];

        let wordIndex = 0;
        let charIndex = 0;
        let deleting = false;

        function typeEffect() {

            const currentWord = words[wordIndex];

            if (!deleting) {

                typingElement.textContent =
                    currentWord.substring(0, charIndex + 1);

                charIndex++;

                if (charIndex === currentWord.length) {

                    deleting = true;

                    setTimeout(typeEffect, 1500);

                    return;
                }

            } else {

                typingElement.textContent =
                    currentWord.substring(0, charIndex - 1);

                charIndex--;

                if (charIndex === 0) {

                    deleting = false;

                    wordIndex++;

                    if (wordIndex >= words.length) {
                        wordIndex = 0;
                    }
                }
            }

            setTimeout(
                typeEffect,
                deleting ? 60 : 100
            );
        }

        typeEffect();
    }


    // ------------------------------------------
    // 7. In2Talk AI Chat
    // ------------------------------------------

    const chatButton = document.querySelector(".chat-button");
    const chatWindow = document.querySelector(".chat-window");
    const chatClose = document.querySelector(".chat-close");
    const chatForm = document.querySelector(".chat-form");
    const chatInput = document.querySelector(".chat-input");
    const chatMessages = document.querySelector(".chat-messages");


    // Open chat
    if (chatButton && chatWindow) {

        chatButton.addEventListener("click", () => {

            chatWindow.classList.add("open");

            if (chatInput) {
                setTimeout(() => {
                    chatInput.focus();
                }, 300);
            }
        });
    }


    // Close chat
    if (chatClose && chatWindow) {

        chatClose.addEventListener("click", () => {

            chatWindow.classList.remove("open");
        });
    }


    // ------------------------------------------
    // 8. Chat messages
    // ------------------------------------------

    if (chatForm) {

        chatForm.addEventListener("submit", async (e) => {

            e.preventDefault();

            const message = chatInput.value.trim();

            if (!message) return;


            // User message
            addMessage(message, "user");

            chatInput.value = "";


            // Typing indicator
            const typingMessage = addMessage(
                "Typing...",
                "bot"
            );


            // --------------------------------------
            // Django backend API
            // --------------------------------------

            try {

                const response = await fetch("/chat/", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCSRFToken()
                    },

                    body: JSON.stringify({
                        message: message
                    })
                });


                const data = await response.json();


                typingMessage.remove();


                if (data.reply) {

                    addMessage(
                        data.reply,
                        "bot"
                    );

                } else {

                    addMessage(
                        "Sorry, I couldn't understand that.",
                        "bot"
                    );
                }


            } catch (error) {

                console.error("Chat error:", error);

                typingMessage.remove();

                addMessage(
                    "I'm having trouble connecting right now. Please try again.",
                    "bot"
                );
            }

        });
    }


    // ------------------------------------------
    // Add chat message
    // ------------------------------------------

    function addMessage(text, type) {

        if (!chatMessages) return null;

        const messageDiv = document.createElement("div");

        messageDiv.classList.add(
            "chat-message",
            type
        );

        messageDiv.textContent = text;

        chatMessages.appendChild(messageDiv);

        chatMessages.scrollTop =
            chatMessages.scrollHeight;

        return messageDiv;
    }


    // ------------------------------------------
    // Django CSRF token
    // ------------------------------------------

    function getCSRFToken() {

        const cookieValue = document.cookie
            .split("; ")
            .find(row => row.startsWith("csrftoken="));

        if (!cookieValue) {
            return "";
        }

        return decodeURIComponent(
            cookieValue.split("=")[1]
        );
    }


    // ------------------------------------------
    // 9. Button hover effect
    // ------------------------------------------

    document.querySelectorAll(".btn").forEach(button => {

        button.addEventListener("mousemove", (e) => {

            const rect = button.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            button.style.setProperty(
                "--mouse-x",
                `${x}px`
            );

            button.style.setProperty(
                "--mouse-y",
                `${y}px`
            );
        });
    });


    // ------------------------------------------
    // 10. Current year in footer
    // ------------------------------------------

    const yearElement =
        document.querySelector("#current-year");

    if (yearElement) {

        yearElement.textContent =
            new Date().getFullYear();
    }


    // ------------------------------------------
    // 11. Page loaded
    // ------------------------------------------

    document.body.classList.add("page-loaded");

});