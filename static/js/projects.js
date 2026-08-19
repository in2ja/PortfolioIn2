document.addEventListener("DOMContentLoaded", () => {

    const sliders = document.querySelectorAll(".project-image-slider");

    sliders.forEach((slider) => {

        const slides = slider.querySelectorAll(".project-slide");
        const dotsContainer = slider.querySelector(".slide-dots");
        const nextButton = slider.querySelector(".next");
        const prevButton = slider.querySelector(".prev");

        if (!slides.length) return;

        let currentIndex = 0;
        let autoSlide;


        /* =========================
           CREATE DOTS
        ========================= */

        if (dotsContainer) {

            dotsContainer.innerHTML = "";

            slides.forEach((slide, index) => {

                const dot = document.createElement("button");

                dot.type = "button";
                dot.className = "slide-dot";

                if (index === 0) {
                    dot.classList.add("active");
                }

                dot.addEventListener("click", () => {
                    showSlide(index);
                    restartAutoSlide();
                });

                dotsContainer.appendChild(dot);

            });

        }


        /* =========================
           GET DOTS
        ========================= */

        const getDots = () => {

            return slider.querySelectorAll(".slide-dot");

        };


        /* =========================
           SHOW SLIDE
        ========================= */

        function showSlide(index) {

            if (index >= slides.length) {
                index = 0;
            }

            if (index < 0) {
                index = slides.length - 1;
            }

            currentIndex = index;


            slides.forEach((slide, i) => {

                slide.classList.toggle(
                    "active",
                    i === currentIndex
                );

            });


            const dots = getDots();

            dots.forEach((dot, i) => {

                dot.classList.toggle(
                    "active",
                    i === currentIndex
                );

            });

        }


        /* =========================
           NEXT
        ========================= */

        if (nextButton) {

            nextButton.addEventListener("click", () => {

                showSlide(currentIndex + 1);

                restartAutoSlide();

            });

        }


        /* =========================
           PREVIOUS
        ========================= */

        if (prevButton) {

            prevButton.addEventListener("click", () => {

                showSlide(currentIndex - 1);

                restartAutoSlide();

            });

        }


        /* =========================
           AUTO SLIDE
        ========================= */

        function startAutoSlide() {

            if (slides.length <= 1) {
                return;
            }

            autoSlide = setInterval(() => {

                showSlide(currentIndex + 1);

            }, 4000);

        }


        /* =========================
           RESTART AUTO SLIDE
        ========================= */

        function restartAutoSlide() {

            clearInterval(autoSlide);

            startAutoSlide();

        }


        /* =========================
           PAUSE ON HOVER
        ========================= */

        slider.addEventListener("mouseenter", () => {

            clearInterval(autoSlide);

        });


        /* =========================
           RESUME AFTER HOVER
        ========================= */

        slider.addEventListener("mouseleave", () => {

            startAutoSlide();

        });


        /* =========================
           TOUCH SWIPE
        ========================= */

        let touchStartX = 0;
        let touchEndX = 0;


        slider.addEventListener("touchstart", (event) => {

            touchStartX =
                event.changedTouches[0].screenX;

        }, { passive: true });


        slider.addEventListener("touchend", (event) => {

            touchEndX =
                event.changedTouches[0].screenX;

            const distance =
                touchEndX - touchStartX;


            if (distance < -50) {

                showSlide(currentIndex + 1);

                restartAutoSlide();

            }


            if (distance > 50) {

                showSlide(currentIndex - 1);

                restartAutoSlide();

            }

        }, { passive: true });


        /* =========================
           INITIAL SLIDE
        ========================= */

        showSlide(0);

        startAutoSlide();

    });

});