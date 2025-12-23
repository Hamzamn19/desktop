# [GitHub Desktop](https://desktop.github.com)

[GitHub Desktop](https://desktop.github.com/) is an open-source [Electron](https://www.electronjs.org/)-based
GitHub app. It is written in [TypeScript](https://www.typescriptlang.org) and
uses [React](https://reactjs.org/).

<picture>
  <source
    srcset="https://user-images.githubusercontent.com/634063/202742848-63fa1488-6254-49b5-af7c-96a6b50ea8af.png"
    media="(prefers-color-scheme: dark)"
  />
  <img
    width="1072"
    src="https://user-images.githubusercontent.com/634063/202742985-bb3b3b94-8aca-404a-8d8a-fd6a6f030672.png"
    alt="A screenshot of the GitHub Desktop application showing changes being viewed and committed with two attributed co-authors"
  />
</picture>

## Where can I get it?

Download the official installer for your operating system:

 - [macOS](https://central.github.com/deployments/desktop/desktop/latest/darwin)
 - [macOS (Apple silicon)](https://central.github.com/deployments/desktop/desktop/latest/darwin-arm64)
 - [Windows](https://central.github.com/deployments/desktop/desktop/latest/win32)
 - [Windows machine-wide install](https://central.github.com/deployments/desktop/desktop/latest/win32?format=msi)

GitHub Desktop (Modern Linux Port) 🐧
GitHub Desktop is an open-source GitHub app built on Electron. While Linux isn't officially supported by GitHub, this fork provides a modernized, secure, and AI-ready version specifically optimized for Linux distributions like Fedora.

🚀 Why this version?
Most community-driven Linux builds are outdated and suffer from persistent login issues. This port solves these problems by tracking the latest official Windows/macOS features.

✨ Key Features
Latest Upstream Sync (v3.5.4+): Tracks the newest official releases for fewer bugs and better performance.

Native AI Summaries: Fully supports the new AI-powered commit summary feature directly on Linux.

AES-256-GCM Security: Implemented a high-security layer using AES-256-GCM encryption to protect authentication tokens "At Rest".

Persistent Login Fix: Solved the "Keyring" instability on Linux by using a secure, encrypted local JSON store for sessions.

Manual OAuth Injection: Includes a fallback mechanism to manually inject OAuth codes if the system protocol handler fails.

🛠 Engineering Details
Native Module Shims: Replaced problematic native modules like keytar and desktop-trampoline with custom JavaScript-based shims to ensure cross-distro stability.

Crypto Integration: Uses Node.js crypto for robust data encryption.

📦 Installation (AppImage)
Download the latest GitHub Desktop-3.5.4.AppImage from the Releases section.

Make the file executable:

Bash

chmod +x "GitHub Desktop-3.5.4.AppImage"
Run the application:

Bash

./"GitHub Desktop-3.5.4.AppImage" --no-sandbox

🎓 About the Developer
Developed by Hamzah, a Computer Engineering student at Beykoz University, Istanbul. This project focuses on bridging the gap between security and usability for Linux developers.

## License

**[MIT](LICENSE)**

The MIT license grant is not for GitHub's trademarks, which include the logo
designs. GitHub reserves all trademark and copyright rights in and to all
GitHub trademarks. GitHub's logos include, for instance, the stylized
Invertocat designs that include "logo" in the file title in the following
folder: [logos](app/static/logos).

GitHub® and its stylized versions and the Invertocat mark are GitHub's
Trademarks or registered Trademarks. When using GitHub's logos, be sure to
follow the GitHub [logo guidelines](https://github.com/logos).
