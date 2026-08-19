document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // CONTACT PAGE VIRTUALINDU
    // SAME AI FEATURE AS HOME PAGE
    // =========================================================

    const form =
        document.getElementById("assistantForm");

    const input =
        document.getElementById("assistantInput");

    const responseBox =
        document.getElementById("assistantResponse");

    const status =
        document.getElementById("assistantStatus");

    const micBtn =
        document.getElementById("assistantMic");

    const speakBtn =
        document.getElementById("assistantSpeak");

    const sendBtn =
        document.getElementById("assistantSend");

    const quickQuestions =
        document.querySelectorAll(".assistant-option");


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
    // GET BEST VOICE
    // =========================================================

    function getBestVoice() {

        if (!("speechSynthesis" in window)) {
            return null;
        }


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

            const voice =
                voices.find(v =>
                    v.name
                        .toLowerCase()
                        .includes(
                            name.toLowerCase()
                        )
                );


            if (voice) {
                return voice;
            }
        }


        return voices.find(v =>
            v.lang &&
            v.lang
                .toLowerCase()
                .startsWith("en")
        ) || voices[0];
    }


    // =========================================================
    // SPEAK
    // EXACT SAME HOME PAGE SPEECH FEATURE
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
         * IMPORTANT:
         * These opening words are intentional.
         * They prevent Chrome from cutting the first
         * words of the actual answer.
         */

        const speechText =
            "Hello there. Welcome to my portfolio. " +
            "This is Virtual Induja speaking. " +
            text;


        speechTimer =
            setTimeout(() => {

                speechTimer = null;


                if (isMuted) {
                    return;
                }


                const utterance =
                    new SpeechSynthesisUtterance(
                        speechText
                    );


                currentUtterance =
                    utterance;


                const voice =
                    getBestVoice();


                if (voice) {

                    utterance.voice =
                        voice;

                    utterance.lang =
                        voice.lang;

                } else {

                    utterance.lang =
                        "en-IN";
                }


                utterance.rate =
                    0.92;

                utterance.pitch =
                    1;

                utterance.volume =
                    1;


                utterance.onstart = () => {

                    if (isMuted) {

                        stopSpeaking();

                        return;
                    }


                    if (speakBtn) {

                        speakBtn.textContent =
                            "🔊";

                        speakBtn.title =
                            "Mute";
                    }


                    if (status) {

                        status.textContent =
                            "VirtualINDU is speaking...";
                    }
                };


                utterance.onend = () => {

                    currentUtterance =
                        null;


                    if (!isMuted) {

                        if (speakBtn) {

                            speakBtn.textContent =
                                "🔊";

                            speakBtn.title =
                                "Listen to response";
                        }


                        if (status) {

                            status.textContent =
                                "VirtualINDU is ready to help.";
                        }
                    }
                };


                utterance.onerror =
                    (event) => {

                        console.log(
                            "Speech ended:",
                            event.error
                        );


                        currentUtterance =
                            null;
                    };


                window.speechSynthesis.speak(
                    utterance
                );


            }, 300);
    }


    // =========================================================
    // LOAD VOICES
    // =========================================================

    if ("speechSynthesis" in window) {

        window.speechSynthesis.onvoiceschanged =
            () => {

                window.speechSynthesis
                    .getVoices();
            };


        window.speechSynthesis
            .getVoices();
    }


    // =========================================================
    // ASK VIRTUALINDU
    // SAME API AS HOME
    // =========================================================

    async function askVirtualIndu(question) {

        question =
            question.trim();


        if (!question) {
            return;
        }


        // Stop previous speech

        stopSpeaking();


        // Clear previous answer

        lastAnswer = "";


        if (responseBox) {

            responseBox.textContent =
                "Thinking...";
        }


        // Reset speaker

        isMuted = false;


        if (speakBtn) {

            speakBtn.textContent =
                "🔊";

            speakBtn.title =
                "Listen to response";
        }


        if (status) {

            status.textContent =
                "VirtualINDU is thinking...";
        }


        if (sendBtn) {
            sendBtn.disabled = true;
        }


        if (input) {
            input.disabled = true;
        }


        try {

            // =================================================
            // SAME API USED BY HOME PAGE
            // =================================================

            const apiResponse =
                await fetch(
                    "/api/virtualindu/",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                question:
                                    question
                            })
                    }
                );


            let data;


            try {

                data =
                    await apiResponse.json();

            } catch (error) {

                throw new Error(
                    "Invalid server response."
                );
            }


            if (
                !apiResponse.ok ||
                !data.success
            ) {

                throw new Error(
                    data.error ||
                    "VirtualINDU could not answer."
                );
            }


            const answer =
                (data.answer || "")
                    .trim();


            if (!answer) {

                throw new Error(
                    "Empty response."
                );
            }


            // Save answer

            lastAnswer =
                answer;


            // Display answer

            if (responseBox) {

                responseBox.textContent =
                    answer;
            }


            if (status) {

                status.textContent =
                    "VirtualINDU is ready to help.";
            }


            // Speak answer

            speakText(answer);


        } catch (error) {

            console.error(
                "VirtualINDU error:",
                error
            );


            if (responseBox) {

                responseBox.textContent =
                    "Sorry, I couldn't get an answer right now.";
            }


            if (status) {

                status.textContent =
                    "Please try again.";
            }


        } finally {

            if (sendBtn) {
                sendBtn.disabled = false;
            }


            if (input) {

                input.disabled =
                    false;

                input.focus();
            }
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


                askVirtualIndu(
                    question
                );

            }
        );
    }


    // =========================================================
    // SEND BUTTON
    // =========================================================

    if (sendBtn) {

        sendBtn.addEventListener(
            "click",
            (event) => {

                event.preventDefault();


                const question =
                    input.value.trim();


                if (!question) {
                    return;
                }


                askVirtualIndu(
                    question
                );
            }
        );
    }


    // =========================================================
    // ENTER KEY
    // =========================================================

    if (input) {

        input.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();


                    const question =
                        input.value.trim();


                    if (!question) {
                        return;
                    }


                    askVirtualIndu(
                        question
                    );
                }
            }
        );
    }


    // =========================================================
    // QUICK QUESTIONS
    // =========================================================

    quickQuestions.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const question =
                        button.dataset.question ||
                        button.textContent.trim();


                    if (!question) {
                        return;
                    }


                    input.value =
                        question;


                    askVirtualIndu(
                        question
                    );
                }
            );
        }
    );


    // =========================================================
    // SPEAKER / MUTE
    // SAME AS HOME
    // =========================================================

    if (speakBtn) {

        speakBtn.addEventListener(
            "click",
            () => {


                /*
                 * Currently speaking OR
                 * waiting to speak
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


                    speakBtn.textContent =
                        "🔇";

                    speakBtn.title =
                        "Unmute";


                    if (status) {

                        status.textContent =
                            "VirtualINDU is muted.";
                    }


                    return;
                }


                /*
                 * Currently muted
                 */

                if (isMuted) {

                    isMuted = false;


                    speakBtn.textContent =
                        "🔊";

                    speakBtn.title =
                        "Mute";


                    if (lastAnswer) {

                        speakText(
                            lastAnswer
                        );
                    }


                    return;
                }


                /*
                 * Not speaking
                 */

                if (lastAnswer) {

                    speakText(
                        lastAnswer
                    );
                }
            }
        );
    }


    // =========================================================
    // MICROPHONE
    // EXACT SAME SYSTEM AS HOME PAGE
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

                    if (status) {

                        status.textContent =
                            "Please use Google Chrome for microphone input.";
                    }
                }
            );
        }


    } else {


        // =====================================================
        // CREATE MICROPHONE
        // =====================================================

        recognition =
            new SpeechRecognition();


        recognition.lang =
            "en-IN";


        recognition.continuous =
            false;


        /*
         * SAME AS HOME PAGE
         */

        recognition.interimResults =
            false;


        recognition.maxAlternatives =
            1;


        // =====================================================
        // MICROPHONE START
        // =====================================================

        recognition.onstart = () => {

            isListening =
                true;


            if (micBtn) {

                micBtn.textContent =
                    "🔴";

                micBtn.classList.add(
                    "listening"
                );
            }


            if (status) {

                status.textContent =
                    "Listening... speak now.";
            }
        };


        // =====================================================
        // MICROPHONE RESULT
        // SAME AS HOME PAGE
        // =====================================================

        recognition.onresult =
            (event) => {

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

                if (input) {

                    input.value =
                        transcript;
                }


                if (status) {

                    status.textContent =
                        "Question received.";
                }


                // Send question

                askVirtualIndu(
                    transcript
                );
            };


        // =====================================================
        // MICROPHONE ERROR
        // =====================================================

        recognition.onerror =
            (event) => {

                console.error(
                    "Microphone error:",
                    event.error
                );


                isListening =
                    false;


                if (micBtn) {

                    micBtn.textContent =
                        "🎙";

                    micBtn.classList.remove(
                        "listening"
                    );
                }


                if (
                    event.error ===
                    "not-allowed"
                ) {

                    if (status) {

                        status.textContent =
                            "Microphone permission is blocked. Allow microphone access in Chrome.";
                    }

                } else if (
                    event.error ===
                    "no-speech"
                ) {

                    if (status) {

                        status.textContent =
                            "I didn't hear anything. Please try again.";
                    }

                } else if (
                    event.error ===
                    "audio-capture"
                ) {

                    if (status) {

                        status.textContent =
                            "No microphone was detected.";
                    }

                } else if (
                    event.error ===
                    "network"
                ) {

                    if (status) {

                        status.textContent =
                            "Microphone network error. Please try again.";
                    }

                } else {

                    if (status) {

                        status.textContent =
                            "Microphone error. Please try again.";
                    }
                }
            };


        // =====================================================
        // MICROPHONE END
        // =====================================================

        recognition.onend =
            () => {

                isListening =
                    false;


                if (micBtn) {

                    micBtn.textContent =
                        "🎙";

                    micBtn.classList.remove(
                        "listening"
                    );
                }


                if (
                    status &&
                    status.textContent ===
                    "Listening... speak now."
                ) {

                    status.textContent =
                        "VirtualINDU is ready to help.";
                }
            };


        // =====================================================
        // MICROPHONE BUTTON
        // SAME PERMISSION LOGIC AS HOME
        // =====================================================

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

                            console.log(
                                error
                            );
                        }


                        return;
                    }


                    /*
                     * Stop VirtualINDU speaking
                     * before microphone starts.
                     */

                    stopSpeaking();


                    /*
                     * Mute speech while listening.
                     */

                    isMuted =
                        true;


                    /*
                     * Ask browser for microphone
                     * permission.
                     *
                     * SAME AS HOME.
                     */

                    try {

                        await navigator
                            .mediaDevices
                            .getUserMedia({
                                audio: true
                            });

                    } catch (error) {

                        console.error(
                            "Microphone permission error:",
                            error
                        );


                        if (status) {

                            status.textContent =
                                "Please allow microphone access in Chrome.";
                        }


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


                        if (status) {

                            status.textContent =
                                "Could not start microphone. Please try again.";
                        }
                    }
                }
            );
        }
    }


    // =========================================================
    // INITIAL STATUS
    // =========================================================

    if (status) {

        status.textContent =
            "VirtualINDU is ready to help.";
    }

});