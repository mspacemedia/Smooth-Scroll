/**
 * Smooth Scroll Utility - Open Source Edition (M-SpaceMedia)
 * * Adds explicit Direction Control (Up/Down) to the UI.
 */
(function() {
    // --- Configuration ---
    const PANEL_ID = 'dev-scroll-utility-panel';
    const DEFAULT_SPEED = 10; 
    const DEFAULT_COUNTDOWN_SECONDS = 3;
    const DEFAULT_INTERVAL_MS = 16; 
    const SCROLL_AMOUNT_PER_CLICK = 1000;
    const SPEED_STEP = 1; 
    
    // --- State Variables ---
    let scrollInterval = null;
    let currentSpeed = DEFAULT_SPEED;
    let currentDirection = 1; // 1 for down (default), -1 for up
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    
    // Touch/Slide variables
    let touchStartX = 0;
    let touchStartY = 0;

    // --- Core Scrolling Logic ---

    function startScroll() {
        if (scrollInterval) return; 

        // Apply direction to the speed. If currentDirection is -1, scrollUp will be used.
        const scrollAmount = currentSpeed * currentDirection;

        scrollInterval = setInterval(() => {
            window.scrollBy(0, scrollAmount);

            // Logic to stop at the end or top of the page
            if (currentDirection === 1) {
                 // Stop when reaching the bottom
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                     stopScroll();
                }
            } else {
                 // Stop when reaching the top
                 if (window.scrollY <= 0) {
                     stopScroll();
                 }
            }
        }, DEFAULT_INTERVAL_MS);

        console.log(`Smooth Scroll Started: Speed=${currentSpeed}, Direction=${currentDirection === 1 ? 'Down' : 'Up'}.`);
    }

    function stopScroll() {
        if (scrollInterval) {
            clearInterval(scrollInterval);
            scrollInterval = null;

            const panel = document.getElementById(PANEL_ID);
            if (panel) {
                panel.style.visibility = 'visible';
                panel.classList.remove('is-active');
            }
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
        console.log(`Scroll speed set to: ${currentSpeed}`);
    }
    
    function setDirection(newDirection) {
        currentDirection = parseInt(newDirection, 10);
        if (scrollInterval) {
            stopScroll(); 
            startScroll();
        }
        console.log(`Scroll direction set to: ${currentDirection === 1 ? 'Down' : 'Up'}.`);
    }

    // --- Countdown and Start Logic ---

    function startCountdownAndScroll() {
        const display = document.getElementById('countdown-display');
        const startBtn = document.getElementById('scroll-start-btn');
        const stopBtn = document.getElementById('scroll-stop-btn');
        const panel = document.getElementById(PANEL_ID);
        const countdownInput = document.getElementById('countdown-input');

        if (!display || !startBtn || !stopBtn || !panel || scrollInterval) return;

        let counter = Math.max(1, parseInt(countdownInput.value, 10) || DEFAULT_COUNTDOWN_SECONDS);

        panel.style.visibility = 'visible';
        panel.classList.add('is-active');

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

                startScroll();
                stopBtn.disabled = false;

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
                    <label for="scroll-direction-select">Direction:</label>
                    <select id="scroll-direction-select" style="width: 100%; padding: 8px; margin-top: 5px; border-radius: 4px; background: #333; color: white;">
                        <option value="1">Down (Default)</option>
                        <option value="-1">Up</option>
                    </select>
                </div>

                <div class="control-group" style="margin-top: 10px;">
                    <label for="scroll-speed-input">Speed (px/frame):</label>
                    <input type="number" id="scroll-speed-input" value="${DEFAULT_SPEED}" min="1" step="1">
                </div>
                
                <div class="control-group" style="margin-top: 10px;">
                    <label for="countdown-input">Countdown (seconds):</label>
                    <input type="number" id="countdown-input" value="${DEFAULT_COUNTDOWN_SECONDS}" min="1" max="10" step="1" style="width: 50%; display: inline-block;">
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
            #${PANEL_ID} .controls input[type="number"], #${PANEL_ID} .controls select { background: #333; color: white; text-align: center; }
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
        const directionSelect = document.getElementById('scroll-direction-select'); // NEW
        const upBtn = document.getElementById('scroll-up-btn');
        const downBtn = document.getElementById('scroll-down-btn');

        // Main actions and speed input
        startBtn.addEventListener('click', startCountdownAndScroll);
        stopBtn.addEventListener('click', stopScroll);
        speedInput.addEventListener('change', (e) => setSpeed(e.target.value));
        directionSelect.addEventListener('change', (e) => setDirection(e.target.value)); // NEW
        
        upBtn.addEventListener('click', () => window.scrollBy(0, -SCROLL_AMOUNT_PER_CLICK));
        downBtn.addEventListener('click', () => window.scrollBy(0, SCROLL_AMOUNT_PER_CLICK));

        // --- Keyboard Control (Ctrl+S, ArrowUp, ArrowDown) ---
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault(); 
                
                if (scrollInterval) {
                    stopScroll();
                } else if (!startBtn.disabled) {
                    startCountdownAndScroll();
                } else {
                    if (panel && panel.style.visibility === 'hidden') {
                         panel.style.visibility = 'visible';
                    }
                }
            } 
            else if (e.key === 'ArrowUp' && scrollInterval) {
                e.preventDefault();
                setSpeed(currentSpeed + SPEED_STEP);
            }
            else if (e.key === 'ArrowDown' && scrollInterval) {
                e.preventDefault();
                setSpeed(currentSpeed - SPEED_STEP);
            }
        });

        // --- Draggable Panel Logic (Mouse) ---
        panel.addEventListener('mousedown', (e) => {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'SELECT') {
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

        // --- Touch/Slide Control (Mobile) ---
        panel.addEventListener('touchstart', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT') return;
            
            e.preventDefault(); 
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            
            isDragging = true; 
            dragOffsetX = touchStartX - panel.offsetLeft;
            dragOffsetY = touchStartY - panel.offsetTop;
        });

        panel.addEventListener('touchmove', (e) => {
            e.preventDefault(); 
            if (e.touches.length === 0) return;

            const touchMoveX = e.touches[0].clientX;
            const touchMoveY = e.touches[0].clientY;

            if (isDragging) {
                panel.style.left = `${touchMoveX - dragOffsetX}px`;
                panel.style.top = `${touchMoveY - dragOffsetY}px`;
            }

            if (scrollInterval) {
                const deltaY = touchMoveY - touchStartY;
                
                if (Math.abs(deltaY) > 10) { 
                    const directionMultiplier = currentDirection; // Use current direction for speed change logic
                    // Swiping against the current scroll direction (e.g., swiping down when scrolling up) increases speed
                    const newSpeed = currentSpeed + (deltaY * directionMultiplier < 0 ? SPEED_STEP : -SPEED_STEP); 
                    
                    setSpeed(newSpeed);
                    touchStartY = touchMoveY; 
                }
            }
        });

        panel.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    // Initialize the panel when the DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPanel);
    } else {
        initPanel();
    }

})();
