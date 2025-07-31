"use client";

import { motion } from "framer-motion";
import React from "react";
import Layout from "../file-space/Layout";

export default function About() {
  return (
    <Layout isFiles={false}>
      <motion.div
        style={{ fontFamily: "__nextjs-Geist Mono" }}
        className="min-h-screen px-3 py-6 md:px-64 md:py-12 flex items-center justify-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1
            className="text-4xl font-bold mb-4"
            style={{ fontFamily: "AdvercaseRegular" }}
          >
            📁 About This Demo
          </h1>
          <p className="text-lg mb-6">
            This is a <strong>local-only</strong> demo of a{" "}
            <span className="font-semibold">Cloud File Manager</span> — part of
            the vision behind <strong>CollabTube</strong>. It simulates folder &
            file operations entirely in your browser — no backend, no cloud.
          </p>

          <section className="mb-8">
            <h2
              className="text-2xl font-semibold mb-3"
              style={{ fontFamily: "SF Pro Text" }}
            >
              🧰 What Can You Do Here?
            </h2>
            <ul className="space-y-2 list-disc list-inside text-base">
              <li>📁 Create folders and subfolders</li>
              <li>📄 Add, move, rename, and delete files</li>
              <li>🔐 Try basic (mocked) authentication</li>
              <li>
                🗃️ All stored in <code>IndexedDB</code> +{" "}
                <code>localStorage</code>
              </li>
            </ul>
            <p className="mt-4 text-yellow-700 dark:text-yellow-400">
              ⚠️ This is entirely local — no sync, no cloud, no server.
              Refreshing or clearing storage wipes everything.
            </p>
          </section>

          <section className="mb-8">
            <h2
              className="text-2xl font-semibold mb-3"
              style={{ fontFamily: "SF Pro Text" }}
            >
              🚀 About CollabTube (Full Version)
            </h2>
            <p className="mb-4">
              <strong>CollabTube</strong> is a platform that empowers YouTubers
              and creative teams to collaborate on everything from ideation to
              publishing. The full system includes:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>☁️ Cloud-based storage (via AWS S3)</li>
              <li>🎞️ HLS video streaming & frame-accurate comments</li>
              <li>
                📤 One-click multi-platform publishing (YouTube, Vimeo,
                Pinterest, etc.)
              </li>
              <li>🧠 AI-generated social content (captions, hashtags)</li>
              <li>🔄 Real-time team collaboration via WebSockets</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2
              className="text-2xl font-semibold mb-3"
              style={{ fontFamily: "SF Pro Text" }}
            >
              🧱 System Architecture
            </h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <strong>1️⃣ Filespace (90% Completed):</strong> For general file
                storage, team assets, version control
              </li>
              <li>
                <strong>2️⃣ Projects (30% Completed):</strong> A Project is a
                structured workspace where you and your team organize files in
                the context of a specific video or content task. It serves as a
                direct bridge between your creative workflow and publishing
                platforms like YouTube. From here, you can securely upload
                files, collaborate in real time, and manage everything related
                to a video project in one place.
              </li>
            </ul>
          </section>

          <section>
            <h2
              className="text-2xl font-semibold mb-3"
              style={{ fontFamily: "SF Pro Text" }}
            >
              🛠️ CollabTube Tech Stack
            </h2>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>
                <strong>Next.js + React:</strong> Frontend architecture and
                routing
              </li>
              <li>
                <strong>Tailwind CSS:</strong> UI styling framework
              </li>
              <li>
                <strong>MongoDB:</strong> For folder structure and metadata
              </li>
              <li>
                <strong>AWS S3:</strong> Cloud storage for files and videos
              </li>
              <li>
                <strong>CloudFront:</strong> CDN for fast downloads and previews
              </li>
              <li>
                <strong>Kafka:</strong> Event batch processor — sends bulk file
                operations (rename, move, delete) as logs for DB sync and
                version tracking
              </li>
              <li>
                <strong>Redis:</strong> Fast-access cache for folder structure
                and user session state
              </li>
              <li>
                <strong>WebSockets:</strong> Real-time file updates between team
                members
              </li>
              <li>
                <strong>YouTube API:</strong> Direct video publishing with
                status monitoring
              </li>
            </ul>
          </section>

          <p className="mt-10 text-sm text-gray-500 dark:text-gray-400">
            💬 Want to collaborate or explore more? Reach out on GitHub or
            LinkedIn!
          </p>
        </div>
      </motion.div>
    </Layout>
  );
}
