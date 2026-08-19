document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("aiForm");
    const input = document.getElementById("aiInput");
    const responseBox = document.getElementById("aiResponse");
    const status = document.getElementById("aiStatus");
    const micBtn = document.getElementById("micBtn");
    const speakBtn = document.getElementById("speakBtn");
    const sendBtn = document.getElementById("sendBtn");

    const quickQuestions =
        document.querySelectorAll(".quick-question");


    // =========================================================
    // VARIABLES
    // =========================================================

    let lastAnswer = "";
    let recognition = null;
    let isListening = false;

    let isMuted = false;

    let speechTimer = null;
    let currentUtterance = null;


    // =========================================================
    // STOP SPEECH
    // =========================================================

    function stopSpeaking() {

        if (speechTimer) {
            clearTimeout(speechTimer);
            speechTimer = null;
        }

        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            window.speechSynthesis.resume();
        }

        currentUtterance = null;
    }


    // =========================================================
    // GET VOICE
    // =========================================================

    function getBestVoice() {

        const voices =
            window.speechSynthesis.getVoices();

        if (!voices.length) {
            return null;
        }

        const preferred = [
            "Google US English",
            "Microsoft Aria",
            "Microsoft Jenny",
            "Microsoft Zira",
            "Google UK English"
        ];

        for (const name of preferred) {

            const voice = voices.find(v =>
                v.name
                    .toLowerCase()
                    .includes(name.toLowerCase())
            );

            if (voice) {
                return voice;
            }
        }

        return voices.find(v =>
            v.lang &&
            v.lang.toLowerCase().startsWith("en")
        ) || voices[0];
    }


    // =========================================================
    // SPEAK
    // =========================================================

    function speakText(text) {

        if (!text || !text.trim()) {
            return;
        }

        if (isMuted) {
            return;
        }

        stopSpeaking();

        /*
         * These opening words are intentional.
         * They prevent Chrome from cutting the first
         * words of the actual answer.
         */

        const speechText =
            "Hello there. Welcome to my portfolio. " +
            "This is Virtual Induja speaking. " +
            text;


        speechTimer = setTimeout(() => {

            speechTimer = null;

            if (isMuted) {
                return;
            }

            const utterance =
                new SpeechSynthesisUtterance(
                    speechText
                );

            currentUtterance = utterance;

            const voice = getBestVoice();

            if (voice) {
                utterance.voice = voice;
                utterance.lang = voice.lang;
            } else {
                utterance.lang = "en-IN";
            }

            utterance.rate = 0.92;
            utterance.pitch = 1;
            utterance.volume = 1;


            utterance.onstart = () => {

                if (isMuted) {
                    stopSpeaking();
                    return;
                }

                speakBtn.textContent = "🔊";
                speakBtn.title = "Mute";

                status.textContent =
                    "VirtualINDU is speaking...";
            };


            utterance.onend = () => {

                currentUtterance = null;

                if (!isMuted) {

                    speakBtn.textContent = "🔊";
                    speakBtn.title =
                        "Listen to response";

                    status.textContent =
                        "VirtualINDU is ready to help.";
                }
            };


            utterance.onerror = (event) => {

                console.log(
                    "Speech ended:",
                    event.error
                );

                currentUtterance = null;
            };


            window.speechSynthesis.speak(
                utterance
            );

        }, 300);
    }


    // =========================================================
    // LOAD SPEECH VOICES
    // =========================================================

    if ("speechSynthesis" in window) {

        window.speechSynthesis.onvoiceschanged =
            () => {
                window.speechSynthesis.getVoices();
            };

        window.speechSynthesis.getVoices();
    }


    // =========================================================
    // ASK VIRTUALINDU
    // =========================================================

    async function askVirtualIndu(question) {

        question = question.trim();

        if (!question) {
            return;
        }


        // Stop any previous speech
        stopSpeaking();


        // Clear previous answer
        lastAnswer = "";

        responseBox.textContent =
            "Thinking...";


        // Reset speaker
        isMuted = false;

        speakBtn.textContent = "🔊";
        speakBtn.title = "Listen to response";


        status.textContent =
            "VirtualINDU is thinking...";


        sendBtn.disabled = true;
        input.disabled = true;


        try {

            const response = await fetch(
                "/api/virtualindu/",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        question: question
                    })
                }
            );


            let data;

            try {

                data = await response.json();

            } catch (error) {

                throw new Error(
                    "Invalid server response."
                );
            }


            if (!response.ok || !data.success) {

                throw new Error(
                    data.error ||
                    "VirtualINDU could not answer."
                );
            }


            const answer =
                (data.answer || "").trim();


            if (!answer) {

                throw new Error(
                    "Empty response."
                );
            }


            // Save current answer
            lastAnswer = answer;


            // Display new answer
            responseBox.textContent =
                answer;


            status.textContent =
                "VirtualINDU is ready to help.";


            // Speak new answer
            speakText(answer);


        } catch (error) {

            console.error(
                "VirtualINDU error:",
                error
            );


            responseBox.textContent =
                "Sorry, I couldn't get an answer right now.";

            status.textContent =
                "Please try again.";

        } finally {

            sendBtn.disabled = false;
            input.disabled = false;

            input.focus();
        }
    }


    // =========================================================
    // SEND BUTTON / FORM
    // =========================================================

    if (form) {

        form.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();

                const question =
                    input.value.trim();

                if (!question) {
                    return;
                }

                askVirtualIndu(question);
            }
        );
    }


    // =========================================================
    // QUICK QUESTIONS
    // =========================================================

    quickQuestions.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const question =
                    button.dataset.question || "";

                if (!question) {
                    return;
                }

                input.value = question;

                askVirtualIndu(question);
            }
        );
    });


    // =========================================================
    // SPEAKER / MUTE
    // =========================================================

    if (speakBtn) {

        speakBtn.addEventListener(
            "click",
            () => {

                /*
                 * Currently speaking OR waiting to speak
                 */

                if (
                    currentUtterance ||
                    speechTimer ||
                    (
                        "speechSynthesis" in window &&
                        window.speechSynthesis.speaking
                    )
                ) {

                    isMuted = true;

                    stopSpeaking();

                    speakBtn.textContent = "🔇";
                    speakBtn.title = "Unmute";

                    status.textContent =
                        "VirtualINDU is muted.";

                    return;
                }


                /*
                 * Currently muted
                 */

                if (isMuted) {

                    isMuted = false;

                    speakBtn.textContent = "🔊";
                    speakBtn.title = "Mute";

                    if (lastAnswer) {
                        speakText(lastAnswer);
                    }

                    return;
                }


                /*
                 * Not speaking
                 */

                if (lastAnswer) {
                    speakText(lastAnswer);
                }
            }
        );
    }


    // =========================================================
    // MICROPHONE
    // =========================================================

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        console.error(
            "Speech Recognition is not supported."
        );

        if (micBtn) {

            micBtn.addEventListener(
                "click",
                () => {

                    status.textContent =
                        "Please use Google Chrome for microphone input.";

                }
            );
        }

        return;
    }


    // =========================================================
    // CREATE MICROPHONE
    // =========================================================

    recognition =
        new SpeechRecognition();


    recognition.lang = "en-IN";

    recognition.continuous = false;

    recognition.interimResults = false;

    recognition.maxAlternatives = 1;


    // =========================================================
    // MICROPHONE START
    // =========================================================

    recognition.onstart = () => {

        isListening = true;

        micBtn.textContent = "🔴";

        micBtn.classList.add("listening");

        status.textContent =
            "Listening... speak now.";
    };


    // =========================================================
    // MICROPHONE RESULT
    // =========================================================

    recognition.onresult = (event) => {

        const result =
            event.results[0];

        if (!result) {
            return;
        }


        const transcript =
            result[0]
                .transcript
                .trim();


        if (!transcript) {
            return;
        }


        console.log(
            "Microphone heard:",
            transcript
        );


        // Put voice text into input
        input.value = transcript;


        status.textContent =
            "Question received.";


        // Send question
        askVirtualIndu(transcript);
    };


    // =========================================================
    // MICROPHONE ERROR
    // =========================================================

    recognition.onerror = (event) => {

        console.error(
            "Microphone error:",
            event.error
        );


        isListening = false;

        micBtn.textContent = "🎙";

        micBtn.classList.remove("listening");


        if (event.error === "not-allowed") {

            status.textContent =
                "Microphone permission is blocked. Allow microphone access in Chrome.";

        }

        else if (event.error === "no-speech") {

            status.textContent =
                "I didn't hear anything. Please try again.";

        }

        else if (event.error === "audio-capture") {

            status.textContent =
                "No microphone was detected.";

        }

        else if (event.error === "network") {

            status.textContent =
                "Microphone network error. Please try again.";

        }

        else {

            status.textContent =
                "Microphone error. Please try again.";
        }
    };


    // =========================================================
    // MICROPHONE END
    // =========================================================

    recognition.onend = () => {

        isListening = false;

        micBtn.textContent = "🎙";

        micBtn.classList.remove("listening");

        /*
         * Don't overwrite an important status message.
         */

        if (
            status.textContent ===
            "Listening... speak now."
        ) {

            status.textContent =
                "VirtualINDU is ready to help.";
        }
    };


    // =========================================================
    // MICROPHONE BUTTON
    // =========================================================

    if (micBtn) {

        micBtn.addEventListener(
            "click",
            async (event) => {

                event.preventDefault();

                /*
                 * If already listening, stop.
                 */

                if (isListening) {

                    try {
                        recognition.stop();
                    } catch (error) {
                        console.log(error);
                    }

                    return;
                }


                /*
                 * Stop VirtualINDU speaking before
                 * starting microphone.
                 */

                stopSpeaking();

                isMuted = true;


                /*
                 * Ask browser for microphone permission.
                 *
                 * This is important because Chrome may
                 * otherwise block SpeechRecognition.
                 */

                try {

                    await navigator.mediaDevices
                        .getUserMedia({
                            audio: true
                        });

                } catch (error) {

                    console.error(
                        "Microphone permission error:",
                        error
                    );

                    status.textContent =
                        "Please allow microphone access in Chrome.";

                    return;
                }


                /*
                 * Start speech recognition.
                 */

                try {

                    recognition.start();

                } catch (error) {

                    console.error(
                        "Recognition start error:",
                        error
                    );

                    status.textContent =
                        "Could not start microphone. Please try again.";
                }
            }
        );
    }


    // =========================================================
    // INITIAL STATUS
    // =========================================================

    status.textContent =
        "VirtualINDU is ready to help.";

});