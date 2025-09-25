# Smooth Scroll Utility

## 💡 About

The Smooth Scroll Utility is a simple, lightweight, and cross-browser JavaScript snippet designed for web developers, quality assurance (QA) testers, and content creators who need to record high-quality, jitter-free video demonstrations of webpages.

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

### 2. Operation Guide

| Action | Control | Notes |
| :--- | :--- | :--- |
| **Start Scroll** | Click **"Start Auto Scroll"** or press **<kbd>Ctrl</kbd> + <kbd>S</kbd>** | A 3-second countdown will start, and the panel will hide once scrolling begins. |
| **Stop Scroll** | Click **"Stop Scroll"** or press **<kbd>Ctrl</kbd> + <kbd>S</kbd>** | The panel will instantly reappear. |
| **Adjust Speed** | Use the **Speed (px/frame)** input field. | Changes take effect on the next start (or immediately if scrolling is active). |
| **Manual Scroll** | Use the **Scroll Up/Down** buttons. | Useful for setting the starting position before a recording. |

---

## 🛠️ Development & Testing

A test page is included in this repository to immediately verify the utility's function:

* **`test-page.html`:** An example HTML file with six colored screens (100vh deep) to easily test the scroll effect across various speeds and devices.

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## ✍️ Contribution

Contributions are welcome! If you find a bug or have an idea for an enhancement, please open an Issue or submit a Pull Request.
