/**
 * Smooth Scroll Utility - Open Source Edition
 * * A developer tool that creates a draggable, auto-hiding panel 
 * to control smooth, automated scrolling for screen recording.
 * * Install: Place this entire script in a <script> tag before the 
 * closing </body> tag on any web page.
 * * Features:
 * - Draggable UI panel (Ctrl+S to toggle visibility/start/stop).
 * - Adjustable scroll speed (px/frame).
 * - 3-second countdown before starting scroll.
 * - Panel auto-hides when scrolling starts.
 * - Panel reappears when scrolling stops.
 */
(function() {
    // --- Configuration ---
    const PANEL_ID = 'dev-scroll-utility-panel';
    const DEFAULT_SPEED = 10; // Pixels to scroll per interval (approx 60 FPS)
    const DEFAULT_INTERVAL_MS = 16; 
    const SCROLL_AMOUNT_PER_CLICK = 1000;

    // --- State Variables ---
    let scrollInterval = null;
    let currentSpeed = DEFAULT_SPEED;
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    // --- Core Scrolling Logic ---

    function startScroll() {
        if (scrollInterval) return; 

        scrollInterval = setInterval(() => {
            window.scrollBy(0, currentSpeed);

            // Stop when reaching the end of the page
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                 stopScroll();
            }

        }, DEFAULT_INTERVAL_MS);

        console.log(`Smooth Scroll Started at speed: ${currentSpeed}px/frame.`);
    }

    function stopScroll() {
        if (scrollInterval) {
            clearInterval(scrollInterval);
            scrollInterval = null;

            const panel = document.getElementById(PANEL_ID);
            if (panel) {
                // REAPPEAR: Make the panel visible again when the scroll stops
                panel.style.visibility = 'visible';
                panel.classList.remove('is-active');
            }
            // Re-enable start button, disable stop button
            document.getElementById('scroll-start-btn').disabled = false;
            document.getElementById('scroll-stop-btn').disabled = true;

            console.log('Smooth Scroll Stopped.');
        }
    }

    function setSpeed(newSpeed) {
        currentSpeed = Math.max(1, parseInt(newSpeed, 10));
        const speedInput = document.getElementById('scroll-speed-input');
        if (speedInput) speedInput.value = currentSpeed;

        if (scrollInterval) {
            stopScroll();
            startScroll();
        }
    }

    // --- Countdown and Start Logic ---

    function startCountdownAndScroll(seconds = 3) {
        const display = document.getElementById('countdown-display');
        const startBtn = document.getElementById('scroll-start-btn');
        const stopBtn = document.getElementById('scroll-stop-btn');
        const panel = document.getElementById(PANEL_ID);

        if (!display || !startBtn || !stopBtn || !panel || scrollInterval) return;

        let counter = seconds;

        // Ensure panel is visible and active for the countdown
        panel.style.visibility = 'visible';
        panel.classList.add('is-active');

        // Disable buttons during countdown
        startBtn.disabled = true;
        stopBtn.disabled = true;
        display.classList.add('active');

        const countdownInterval = setInterval(() => {
            if (counter > 0) {
                display.textContent = `Starting in ${counter}...`;
                counter--;
            } else {
                clearInterval(countdownInterval);
                display.classList.remove('active');
                display.textContent = ''; 

                // Start scroll, but keep buttons disabled until stop
                startScroll();
                stopBtn.disabled = false; // Enable stop button

                // HIDE: Hide the panel immediately after scroll starts
                panel.style.visibility = 'hidden';
            }
        }, 1000);
    }

    // --- UI/Panel Creation Logic & Event Handlers ---

    function initPanel() {
        if (document.getElementById(PANEL_ID)) return;

        // 1. Panel Structure
        const panel = document.createElement('div');
        panel.id = PANEL_ID;
        panel.innerHTML = `
            <div class="header">
                <span class="title">Dev Scroll Utility</span>
                <span class="shortcut">Shortcut: <kbd>Ctrl+S</kbd></span>
            </div>
            <div class="controls">
                <div class="control-group">
                    <label for="scroll-speed-input">Speed (px/frame):</label>
                    <input type="number" id="scroll-speed-input" value="${DEFAULT_SPEED}" min="1" step="1">
                </div>

                <button id="scroll-start-btn" class="action-btn start">Start Auto Scroll</button>
                <button id="scroll-stop-btn" class="action-btn stop" disabled>Stop Scroll</button>

                <div class="manual-control">
                    <p>Manual Control:</p>
                    <button id="scroll-up-btn" class="manual-btn">Scroll Up ${SCROLL_AMOUNT_PER_CLICK}</button>
                    <button id="scroll-down-btn" class="manual-btn">Scroll Down ${SCROLL_AMOUNT_PER_CLICK}</button>
                </div>
            </div>
            <div id="countdown-display" class="countdown-display"></div>
            <div class="disclaimer">
                <p>Record using OS tools. Supports all devices/browsers.</p>
            </div>
        `;

        // 2. Panel Styles (Injected for simplicity in one OSS file)
        const style = document.createElement('style');
        style.textContent = `
            #${PANEL_ID} {
                position: fixed; top: 20px; right: 20px; z-index: 99999;
                background: #282c34; color: #fff; border: 1px solid #61dafb;
                padding: 10px; border-radius: 5px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
                font-family: Arial, sans-serif; font-size: 14px; width: 250px;
                cursor: grab; transition: transform 0.3s ease;
            }
            #${PANEL_ID}.is-active { box-shadow: 0 0 15px 3px #61dafb; border-color: #61dafb; }
            #${PANEL_ID} .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #444; padding-bottom: 5px; }
            #${PANEL_ID} .title { font-weight: bold; color: #61dafb; }
            #${PANEL_ID} .shortcut kbd { background: #555; padding: 2px 4px; border-radius: 3px; font-size: 12px; color: #fff; }
            #${PANEL_ID} .controls button, #${PANEL_ID} .controls input { width: 100%; padding: 8px; margin-top: 5px; border: none; border-radius: 4px; cursor: pointer; box-sizing: border-box; }
            #${PANEL_ID} .controls .action-btn.start { background: #4caf50; color: white; }
            #${PANEL_ID} .controls .action-btn.stop { background: #f44336; color: white; }
            #${PANEL_ID} .controls input[type="number"] { background: #333; color: white; text-align: center; }
            #${PANEL_ID} .control-group { margin-bottom: 10px; }
            #${PANEL_ID} .control-group label { display: block; margin-bottom: 5px; }
            #${PANEL_ID} .manual-control { margin-top: 10px; border-top: 1px solid #444; padding-top: 10px; }
            #${PANEL_ID} .manual-control p { margin: 0 0 5px 0; font-size: 12px; color: #aaa; }
            #${PANEL_ID} .manual-btn { background: #3f51b5; color: white; margin-bottom: 5px;}
            #${PANEL_ID} .disclaimer { font-size: 10px; color: #aaa; margin-top: 10px; border-top: 1px solid #444; padding-top: 5px; }
            #${PANEL_ID} .countdown-display { font-size: 2em; font-weight: bold; color: #ffeb3b; text-align: center; height: 0; overflow: hidden; transition: height 0.3s ease, opacity 0.3s ease; opacity: 0; }
            #${PANEL_ID} .countdown-display.active { height: 35px; opacity: 1; margin-bottom: 10px; }
        `;
        document.head.appendChild(style);
        document.body.appendChild(panel);
        
        // 3. Attach Event Listeners
        attachListeners(panel);
    }

    function attachListeners(panel) {
        const startBtn = document.getElementById('scroll-start-btn');
        const stopBtn = document.getElementById('scroll-stop-btn');
        const speedInput = document.getElementById('scroll-speed-input');
        const upBtn = document.getElementById('scroll-up-btn');
        const downBtn = document.getElementById('scroll-down-btn');

        startBtn.addEventListener('click', () => startCountdownAndScroll(3));
        stopBtn.addEventListener('click', stopScroll);
        speedInput.addEventListener('change', (e) => setSpeed(e.target.value));
        upBtn.addEventListener('click', () => window.scrollBy(0, -SCROLL_AMOUNT_PER_CLICK));
        downBtn.addEventListener('click', () => window.scrollBy(0, SCROLL_AMOUNT_PER_CLICK));

        // Keyboard Shortcut: Ctrl+S to Start/Stop/Toggle Visibility
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault(); 
                
                // If scrolling, stop it
                if (scrollInterval) {
                    stopScroll();
                // If not scrolling, start the countdown
                } else if (!startBtn.disabled) {
                    startCountdownAndScroll(3);
                }
                // If panel is hidden (but scroll isn't active), show it (for manual control)
                else {
                    const panel = document.getElementById(PANEL_ID);
                    if (panel && panel.style.visibility === 'hidden') {
                         panel.style.visibility = 'visible';
                    }
                }
            }
        });

        // Draggable Panel Logic
        panel.addEventListener('mousedown', (e) => {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
                isDragging = true;
                dragOffsetX = e.clientX - panel.offsetLeft;
                dragOffsetY = e.clientY - panel.offsetTop;
                panel.style.cursor = 'grabbing';
            }
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            panel.style.left = `${e.clientX - dragOffsetX}px`;
            panel.style.top = `${e.clientY - dragOffsetY}px`;
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
            panel.style.cursor = 'grab';
        });
    }

    // Initialize the panel when the DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPanel);
    } else {
        initPanel();
    }

})();
