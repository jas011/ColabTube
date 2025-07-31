# 🎬 CollabTube – Cloud File Manager (Local-Only Demo)

**CollabTube** is a browser-based demo of a **Cloud File Manager**, built using **Next.js** and **IndexedDB**, simulating how creative teams (like YouTubers, editors, and writers) might organize and manage files collaboratively.

This is a **fully local** prototype – no cloud, no server, and no sync. The system runs entirely in the browser to demonstrate folder logic, file operations, and architecture design, inspired by the full vision of CollabTube.

> ⚠️ Files and folders are stored in your browser's cache (IndexedDB + localStorage). Signing out or clearing storage wipes everything.

---

## 🧰 What Can You Do in This Demo?

- 📁 Create folders and nested subfolders  
- 📄 Move, copy, rename, and delete files  
- ⚙️ Open a mock settings page  
- 🔐 Try basic (hardcoded) authentication  
- 🗃️ All files and metadata are saved locally (offline-first behavior)

---

## 🚀 What Is CollabTube?

The **full version of CollabTube** (in progress) is a cloud-based collaboration platform for content creators and teams. It combines file management, media streaming, publishing, and AI tools into one unified workspace.

### ✅ Full Platform Will Include:

- ☁️ Cloud storage with version control (via AWS S3)
- 🔄 Real-time sync between teammates (via WebSockets)
- 🎞️ HLS video preview with frame-accurate annotations
- 📤 One-click multi-platform publishing (YouTube, Vimeo, Pinterest, etc.)
- 🧠 AI-powered tools for captions, hashtags, and trend-based social content
- 🗂️ Team file systems + structured project workspaces

---

## 🧱 Architecture Snapshot

This demo reflects the first part of the CollabTube system:

### 1️⃣ Filespace (✅ ~90% Complete)
- Local-first folder system
- File metadata, hierarchy, versioning logic
- IndexedDB for offline simulation

### 2️⃣ Projects (🧪 ~30% Complete)
- Projects act as structured workspaces with files, collaborators, and publishing tools
- Will support secure video uploads, cloud sync, and direct publishing integration

---

## ⚙️ Tech Stack

| Layer           | Technology                        |
|----------------|------------------------------------|
| Frontend        | Next.js, React, Tailwind CSS       |
| Local Storage   | IndexedDB (for files), localStorage (for metadata) |
| Cloud Targets (future) | MongoDB, AWS S3, CloudFront      |
| Realtime & Events (future) | WebSockets, Kafka, Redis        |
| Publishing (future) | YouTube API, Vimeo, Pinterest, etc.  |

---

## 🌐 Live Demo

👉 [Click here to try it live](https://your-vercel-link.vercel.app)  
_(Replace with actual deployment link)_

---





## 📽️ Demo Video of Full version

[![Watch the demo](https://i.ytimg.com/vi/akqGAP744xQ/hqdefault.jpg?sqp=-oaymwFACMQBEG5IWvKriqkDMwgBFQAAiEIYAdgBAeIBCggYEAIYBjgBQAHwAQH4Af4EgALgA4oCDAgAEAEYaCBoKGgwDw==&rs=AOn4CLAvlkSv1FlduCLUqbg7nnrPaKQMDA)](https://www.youtube.com/watch?v=akqGAP744xQ)

---

## 📬 Feedback

Want to share feedback or ideas?

-  open a GitHub Issue [here](https://github.com/jas011/ColabTube/issues)

---

## 🤝 Contributing

This is an experimental demo, but contributions are welcome! Feel free to fork, tweak, or propose new features via pull requests.

---

## 📄 License

MIT © 2025 [Jaskirat Singh](https://github.com/jas011)

---

## 🙋‍♂️ Let’s Connect

Have questions, ideas, or want to collaborate on the full version of CollabTube?

📫 Reach me on [GitHub](https://github.com/jas011)  
🔗 Or [LinkedIn](https://linkedin.com/in/jaskirat-your-profile)

