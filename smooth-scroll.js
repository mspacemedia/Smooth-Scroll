/**
 * Smooth Scroll Utility - Open Source Edition (M-SpaceMedia)
 * * FINAL VERSION: Enables Diagonal Scrolling by allowing independent control 
 * of Horizontal (X) and Vertical (Y) distance per frame.
 */
(function() {
    // --- Configuration ---
    const PANEL_ID = 'dev-scroll-utility-panel';
    const DEFAULT_X_DISTANCE_PER_FRAME = 0; // New default: 0 for no horizontal movement
    const DEFAULT_Y_DISTANCE_PER_FRAME = 4; // Vertical distance (default smooth speed)
    const DEFAULT_COUNTDOWN_SECONDS = 3;
    const DEFAULT_INTERVAL_MS = 16; 
    const SCROLL_AMOUNT_PER_CLICK = 1000;
    const DISTANCE_STEP = 1; 

    // --- State Variables ---
    let scrollInterval = null;
    let distancePerFrameX = DEFAULT_X_DISTANCE_PER_FRAME; // Horizontal distance
    let distancePerFrameY = DEFAULT_Y_DISTANCE_PER_FRAME; // Vertical distance
    let currentDirectionX = 1; // 1 for right (default), -1 for left
    let currentDirectionY = 1; // 1 for down (default), -1 for up
    let intervalMS = DEFAULT_INTERVAL_MS;
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    
    // Touch/Slide variables
    let touchStartX = 0;
    let touchStartY = 0;

    // --- Core Scrolling Logic ---

    function startScroll() {
        if (scrollInterval) return; 

        // Calculate final scroll amounts for X and Y
        const scrollAmountX = distancePerFrameX * currentDirectionX;
        const scrollAmountY = distancePerFrameY * currentDirectionY;

        // Check if any movement is specified
        if (scrollAmountX === 0 && scrollAmountY === 0) {
             console.warn("Scroll aborted: Both X and Y distances are set to zero.");
             // Show the panel again so the user can fix the input
             document.getElementById(PANEL_ID).style.visibility = 'visible';
             return; 
        }

        scrollInterval = setInterval(() => {
            // Diagonal Scroll Engine
            window.scrollBy(scrollAmountX, scrollAmountY);

            // Simple stop logic: Stop if the scroll hits the edge in the direction of travel
            const reachedEnd = (
                (currentDirectionY === 1 && (window.innerHeight + window.scrollY) >= document.body.offsetHeight) ||
                (currentDirectionY === -1 && window.scrollY <= 0)
            );
            const reachedSide = (
                (currentDirectionX === 1 && (window.innerWidth + window.scrollX) >= document.body.scrollWidth) ||
                (currentDirectionX === -1 && window.scrollX <= 0)
            );

            // Stop if both scrolls have hit their respective bounds or if only one is active and it hits its bound
            if ((scrollAmountY !== 0 && reachedEnd) || (scrollAmountX !== 0 && reachedSide)) {
                stopScroll();
            }

        }, intervalMS);

        console.log(`Diagonal Scroll Started: X=${scrollAmountX}, Y=${scrollAmountY}, Interval=${intervalMS}ms.`);
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

    // --- State Control Functions ---

    function setDistanceX(newDistance) {
        distancePerFrameX = Math.max(0, parseInt(newDistance, 10)); // Allows 0
        const input = document.getElementById('scroll-distance-x-input');
        if (input) input.value = distancePerFrameX;

        if (scrollInterval) { stopScroll(); startScroll(); }
        console.log(`X Distance set to: ${distancePerFrameX}`);
    }

    function setDistanceY(newDistance) {
        distancePerFrameY = Math.max(0, parseInt(newDistance, 10)); // Allows 0
        const input = document.getElementById('scroll-distance-y-input');
        if (input) input.value = distancePerFrameY;

        if (scrollInterval) { stopScroll(); startScroll(); }
        console.log(`Y Distance set to: ${distancePerFrameY}`);
    }
    
    function setDirectionX(newDirection) {
        currentDirectionX = parseInt(newDirection, 10);
        if (scrollInterval) { stopScroll(); startScroll(); }
    }

    function setDirectionY(newDirection) {
        currentDirectionY = parseInt(newDirection, 10);
        if (scrollInterval) { stopScroll(); startScroll(); }
    }

    function setIntervalMS(newInterval) {
        intervalMS = Math.max(1, parseInt(newInterval, 10));
        const intervalInput = document.getElementById('scroll-interval-input');
        if (intervalInput) intervalInput.value = intervalMS;
        
        if (scrollInterval) { stopScroll(); startScroll(); }
        console.log(`Interval set to: ${intervalMS}ms (approx ${Math.round(1000 / intervalMS)} FPS).`);
    }

    // --- Countdown and Start Logic (Unchanged) ---

    function startCountdownAndScroll() {
        const display = document.getElementById('countdown-display');
        const startBtn = document.getElementById('scroll-start-btn');
        const stopBtn = document.getElementById('scroll-stop-btn');
        const panel = document.getElementById(PANEL_ID);
        const countdownInput = document.getElementById('countdown-input');

        if (!display || !startBtn || !stopBtn || !panel || scrollInterval) return;
        
        // Ensure at least one distance is non-zero before starting countdown
        if (distancePerFrameX === 0 && distancePerFrameY === 0) {
            alert("Set a distance greater than zero for either X or Y axis.");
            return;
        }

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

        // 1. Panel Structure (Modified for X/Y distance and direction)
        const panel = document.createElement('div');
        panel.id = PANEL_ID;
        panel.innerHTML = `
            <div class="header">
                <span class="title">Dev Scroll Utility</span>
                <span class="shortcut">Shortcut: <kbd>Ctrl+S</kbd></span>
            </div>
            <div class="controls">
                
                <div class="control-group" style="display: flex; justify-content: space-between;">
                    <div style="flex-basis: 48%;">
                        <label for="scroll-direction-x-select" style="font-size: 0.8em; color: #aaa;">X-Direction</label>
                        <select id="scroll-direction-x-select" style="width: 100%; padding: 8px; border-radius: 4px; background: #333; color: white;">
                            <option value="1">Right ( + )</option>
                            <option value="-1">Left ( - )</option>
                        </select>
                    </div>
                    <div style="flex-basis: 48%;">
                        <label for="scroll-distance-x-input" style="font-size: 0.8em; color: #aaa;">X-Distance (px/fr)</label>
                        <input type="number" id="scroll-distance-x-input" value="${DEFAULT_X_DISTANCE_PER_FRAME}" min="0" step="1" style="width: 100%;">
                    </div>
                </div>

                <div class="control-group" style="display: flex; justify-content: space-between; margin-top: 10px; border-bottom: 1px solid #444; padding-bottom: 10px;">
                    <div style="flex-basis: 48%;">
                        <label for="scroll-direction-y-select" style="font-size: 0.8em; color: #aaa;">Y-Direction</label>
                        <select id="scroll-direction-y-select" style="width: 100%; padding: 8px; border-radius: 4px; background: #333; color: white;">
                            <option value="1">Down ( + )</option>
                            <option value="-1">Up ( - )</option>
                        </select>
                    </div>
                    <div style="flex-basis: 48%;">
                        <label for="scroll-distance-y-input" style="font-size: 0.8em; color: #aaa;">Y-Distance (px/fr)</label>
                        <input type="number" id="scroll-distance-y-input" value="${DEFAULT_Y_DISTANCE_PER_FRAME}" min="0" step="1" style="width: 100%;">
                    </div>
                </div>
                
                <div class="control-group" style="margin-top: 10px;">
                    <label for="scroll-interval-input">Interval (ms) / FPS:</label>
                    <input type="number" id="scroll-interval-input" value="${DEFAULT_INTERVAL_MS}" min="1" step="1" title="Lower ms = Higher FPS/Smoother Recording">
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

        // 2. Panel Styles (Updated to reflect new input layout)
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
            #${PANEL_ID} .controls button, #${PANEL_ID} .controls input, #${PANEL_ID} .controls select { width: 100%; padding: 8px; margin-top: 5px; border: none; border-radius: 4px; cursor: pointer; box-sizing: border-box; }
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
            /* Specific style for dual inputs */
            #${PANEL_ID} .control-group > div { margin-top: 0; } 
            #${PANEL_ID} .control-group input[type="number"] { margin-top: 2px; }
            #${PANEL_ID} .control-group select { margin-top: 2px; }

        `;
        document.head.appendChild(style);
        document.body.appendChild(panel);
        
        // 3. Attach Event Listeners
        attachListeners(panel);
        
        // Initial setup for direction labels
        setAxisDirectionLabels();
    }
    
    function setAxisDirectionLabels() {
        const directionYSelect = document.getElementById('scroll-direction-y-select');
        const directionXSelect = document.getElementById('scroll-direction-x-select');

        // This function is run once at init, labels are set via HTML template for Y and X
        if (directionYSelect) {
            directionYSelect.addEventListener('change', (e) => setDirectionY(e.target.value));
        }
        if (directionXSelect) {
            directionXSelect.addEventListener('change', (e) => setDirectionX(e.target.value));
        }
    }


    function attachListeners(panel) {
        const startBtn = document.getElementById('scroll-start-btn');
        const stopBtn = document.getElementById('scroll-stop-btn');
        const distanceInputX = document.getElementById('scroll-distance-x-input'); // NEW
        const distanceInputY = document.getElementById('scroll-distance-y-input'); // NEW
        const directionSelectX = document.getElementById('scroll-direction-x-select'); 
        const directionSelectY = document.getElementById('scroll-direction-y-select'); 
        const intervalInput = document.getElementById('scroll-interval-input'); 
        const upBtn = document.getElementById('scroll-up-btn');
        const downBtn = document.getElementById('scroll-down-btn');

        // Main actions and inputs
        startBtn.addEventListener('click', startCountdownAndScroll);
        stopBtn.addEventListener('click', stopScroll);
        
        // Distance and Interval listeners
        distanceInputX.addEventListener('change', (e) => setDistanceX(e.target.value)); 
        distanceInputY.addEventListener('change', (e) => setDistanceY(e.target.value)); 
        intervalInput.addEventListener('change', (e) => setIntervalMS(e.target.value)); 
        
        // Direction listeners are handled by setAxisDirectionLabels during init
        
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
            // ArrowUp/Down controls Y-axis distance if Y is non-zero
            else if (distancePerFrameY > 0) {
                 if (e.key === 'ArrowUp' && scrollInterval) {
                    e.preventDefault();
                    setDistanceY(distancePerFrameY + DISTANCE_STEP); 
                }
                else if (e.key === 'ArrowDown' && scrollInterval) {
                    e.preventDefault();
                    setDistanceY(distancePerFrameY - DISTANCE_STEP); 
                }
            }
            // Add ArrowLeft/Right for X-axis distance control if X is non-zero (Optional, for completeness)
            else if (distancePerFrameX > 0) {
                 if (e.key === 'ArrowRight' && scrollInterval) {
                    e.preventDefault();
                    setDistanceX(distancePerFrameX + DISTANCE_STEP); 
                }
                else if (e.key === 'ArrowLeft' && scrollInterval) {
                    e.preventDefault();
                    setDistanceX(distancePerFrameX - DISTANCE_STEP); 
                }
            }
        });

        // --- Draggable Panel Logic (Mouse & Touch) ---
        panel.addEventListener('mousedown', (e) => {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'SELECT' && e.target.id !== 'scroll-distance-x-input' && e.target.id !== 'scroll-distance-y-input') {
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
                const deltaX = touchMoveX - touchStartX;
                
                // --- Speed/Distance control via vertical touch slide (for Y-axis distance)
                if (distancePerFrameY > 0 && Math.abs(deltaY) > 10) { 
                    const newDistance = distancePerFrameY + (deltaY * currentDirectionY < 0 ? DISTANCE_STEP : -DISTANCE_STEP); 
                    setDistanceY(newDistance); 
                    touchStartY = touchMoveY; 
                }
                
                // --- Speed/Distance control via horizontal touch slide (for X-axis distance)
                if (distancePerFrameX > 0 && Math.abs(deltaX) > 10) { 
                    const newDistance = distancePerFrameX + (deltaX * currentDirectionX < 0 ? DISTANCE_STEP : -DISTANCE_STEP); 
                    setDistanceX(newDistance); 
                    touchStartX = touchMoveX; 
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
