# Dev Scroll Utility

## 💡 About

The Dev Scroll Utility is a simple, lightweight, and cross-browser JavaScript snippet designed for web developers, quality assurance (QA) testers, and content creators who need to record high-quality, jitter-free video demonstrations of webpages.

This utility creates a discreet, auto-hiding control panel that allows for consistent, slow, and smooth scrolling of any webpage, making your screen recordings professional and seamless.

Developed and open-sourced by **M-SpaceMedia**.

## ✨ Features

* **Cross-Browser/Cross-Device:** Works on Chrome, Firefox, Safari, Edge, and is fully functional on mobile browsers (iOS/Android) for testing responsive designs.
* **Draggable Control Panel:** A small UI panel for easy operation that can be moved anywhere on the screen.
* **Auto-Hide Feature:** The panel automatically disappears when the smooth scroll starts and reappears when it stops, ensuring a clean recording.
* **Adjustable Speed:** Fine-tune the scroll speed in pixels per frame for perfect recording synchronization. (Lower is slower.)
* **Countdown Timer:** A 3-second countdown gives you time to prepare your screen recorder before the scroll begins.
* **Keyboard Shortcut:** Use **Ctrl** + **S** to quickly toggle the utility (start/stop/show panel).

---

## 🚀 Installation & Usage

### 1. The Recommended Way (External File)

1.  **Download:** Save the full code from the primary file, `smooth-scroll.js`.
2.  **Include:** Link the file in your HTML using a `<script>` tag, preferably right before the closing `</body>` tag.

### 2. Operation Guide (Diagonal Scroll)
The utility allows for complex smooth scrolling by controlling four independent variables, enabling vertical, horizontal, or diagonal motion.

| Control | Purpose | Default Value | Notes |
| :--- | :--- | :--- | :--- |
| **Y-Distance (px/fr)** | Sets the **Vertical** distance to travel per frame. | `4` | `4` is recommended for standard smooth video. |
| **X-Distance (px/fr)** | Sets the **Horizontal** distance to travel per frame. | `0` | Set this value $>0$ for diagonal scrolling. |
| **Y/X Direction** | Sets the direction for each axis (Down/Up and Right/Left). | `+` (Down/Right) | Set to `-` for Up/Left travel. |
| **Interval (ms) / FPS** | Sets the time delay between each scroll step (controls smoothness). | `16` ms ($\approx 60 \text{ FPS}$) | Use a lower value for higher frame rates (e.g., $8\text{ms}$ for $120 \text{ FPS}$). |

### 3. Quick Actions
| Action | Control | Notes |
| :--- | :--- | :--- |
| **Start/Stop Toggle** | Click **"Start/Stop"** or press **<kbd>Ctrl</kbd> + <kbd>S</kbd>** | Requires at least one X or Y distance to be set above 0. Panel hides on start. |
| **Fine Tune Y-Speed** | **Arrow Keys** (UP/DOWN) or **Vertical Touch Slide** over panel. | Adjusts the **Y-Distance** per frame while scrolling. |
| **Fine Tune X-Speed** | **Horizontal Touch Slide** over panel. | Adjusts the **X-Distance** per frame while scrolling. |
| **Manual Scroll** | Use the **Scroll Up/Down** buttons. | Useful for setting the starting position before a recording. |

## 🛠️ Development & Testing

A test page is included in this repository to immediately verify the utility's function:

* **`smooth-scroll.htm`:** An example HTML file with six colored screens (100vh deep) to easily test the scroll effect across various speeds and devices.

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## ✍️ Contribution

Contributions are welcome! If you find a bug or have an idea for an enhancement, please open an Issue or submit a Pull Request.
