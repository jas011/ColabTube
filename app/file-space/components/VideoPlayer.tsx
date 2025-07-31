"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  Check,
} from "lucide-react";

export default function NetflixVideoPlayer({
  videoSrc,
}: {
  videoSrc?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [quality, setQuality] = useState("1080p");
  const [fps, setFps] = useState("30");

  // Sample video URL - you can replace with any video URL

  useEffect(() => {
    const video = videoRef.current;
    if (videoRef.current && videoSrc) videoRef.current.src = videoSrc;

    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("canplay", handleCanPlay);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  // Auto-hide controls
  useEffect(() => {
    let timeout: any;
    const resetTimeout = () => {
      clearTimeout(timeout);
      setShowControls(true);
      setShowSettings(false); // Close settings when mouse moves
      timeout = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 5000); // Changed to 5 seconds
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", resetTimeout);
      container.addEventListener("mouseenter", resetTimeout);
      container.addEventListener("mouseleave", () => {
        if (isPlaying) setShowControls(false);
      });
    }

    return () => {
      clearTimeout(timeout);
      if (container) {
        container.removeEventListener("mousemove", resetTimeout);
        container.removeEventListener("mouseenter", resetTimeout);
        container.removeEventListener("mouseleave", () => {});
      }
    };
  }, [isPlaying]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video!.paused) {
      video!.play();
      setIsPlaying(true);
    } else {
      video!.pause();
      setIsPlaying(false);
    }
  };

  const handleProgressClick = (e: any) => {
    const rect = progressRef.current?.getBoundingClientRect();
    const percent = (e.clientX - rect!.left) / rect!.width;
    const newTime = percent * duration;
    videoRef.current!.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeClick = (e: any) => {
    const rect = volumeRef.current!.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newVolume = Math.max(0, Math.min(1, percent));
    setVolume(newVolume);
    videoRef.current!.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (isMuted) {
      video!.volume = volume;
      setIsMuted(false);
    } else {
      video!.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;

    try {
      if (!document.fullscreenElement) {
        if (container?.requestFullscreen) {
          await container.requestFullscreen();
        }
        // else if (container?.webkitRequestFullscreen) {
        //   await container?.webkitRequestFullscreen();
        // } else if (container?.mozRequestFullScreen) {
        //   await container?.mozRequestFullScreen();
        // } else if (container?.msRequestFullscreen) {
        //   await container?.msRequestFullscreen();
        // }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
        // else if (document.webkitExitFullscreen) {
        //   await document.webkitExitFullscreen();
        // } else if (document.mozCancelFullScreen) {
        //   await document.mozCancelFullScreen();
        // } else if (document.msExitFullscreen) {
        //   await document.msExitFullscreen();
        // }
      }
    } catch (error) {
      console.log("Fullscreen operation failed:", error);
    }
  };

  // const skipTime = (seconds: number) => {
  //   const video = videoRef.current;
  //   video!.currentTime = Math.max(
  //     0,
  //     Math.min(duration, video!.currentTime + seconds)
  //   );
  // };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    videoRef.current!.playbackRate = rate;
    setShowSettings(false);
  };

  const handleQualityChange = (newQuality: any) => {
    setQuality(newQuality);
    // In a real implementation, you would switch video sources here
    setShowSettings(false);
  };

  const handleFpsChange = (newFps: any) => {
    setFps(newFps);
    // In a real implementation, you would switch video sources here
    setShowSettings(false);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const volumePercent = (isMuted ? 0 : volume) * 100;

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-black rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none" : "max-w-6xl mx-auto"
      }`}
      style={!isFullscreen ? { aspectRatio: "16/9" } : {}}
      onDoubleClick={toggleFullscreen}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className={`w-full h-full object-cover ${
          isFullscreen ? "cursor-none" : ""
        }`}
        onClick={togglePlay}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Play Button Overlay */}
      {!isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <button
            onClick={togglePlay}
            className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-200 backdrop-blur-sm"
          >
            <Play className="w-8 h-8 text-white ml-1" fill="white" />
          </button>
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent transition-all duration-500 ${
          showControls ? "opacity-100" : "opacity-0"
        } ${isFullscreen && !showControls ? "cursor-none" : ""}`}
      >
        {/* Top Bar */}
        <div
          className={`absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black to-transparent transition-all duration-500 ${
            showControls
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0"
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-white text-xl font-bold">Big Buck Bunny</h2>
            {isFullscreen && (
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-gray-300 transition-colors text-sm px-3 py-1 border border-gray-600 rounded hover:border-gray-400"
              >
                Exit Fullscreen
              </button>
            )}
          </div>
        </div>

        {/* Bottom Controls */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-500 ${
            showControls
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0"
          }`}
        >
          {/* Progress Bar */}
          <div
            ref={progressRef}
            className="w-full h-1 bg-gray-600 rounded-full cursor-pointer mb-3.5 group"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-red-600 rounded-full relative group-hover:h-1.5 transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" fill="white" />
                ) : (
                  <Play className="w-8 h-8" fill="white" />
                )}
              </button>

              {/* Volume Control */}
              <div className="flex items-center space-x-2 group">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-6 h-6" />
                  ) : (
                    <Volume2 className="w-6 h-6" />
                  )}
                </button>
                <div
                  ref={volumeRef}
                  className="w-20 h-1 bg-gray-600 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleVolumeClick}
                >
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: `${volumePercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Time Display */}
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-4 relative">
              {/* Settings Menu */}
              <div className="relative">
                <button
                  onClick={toggleSettings}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <Settings className="w-6 h-6" />
                </button>

                {/* Settings Dropdown */}
                {showSettings && (
                  <div
                    className={`absolute ${
                      isFullscreen ? "bottom-16" : "bottom-12"
                    } right-0 bg-black bg-opacity-95 backdrop-blur-md rounded-lg p-4 min-w-64 shadow-2xl border border-gray-700 z-50`}
                  >
                    {/* Quality Settings */}
                    <div className="mb-4">
                      <h3 className="text-white text-sm font-semibold mb-2">
                        Quality
                      </h3>
                      <div className="space-y-1">
                        {["Auto", "1080p", "720p", "480p", "360p"].map((q) => (
                          <button
                            key={q}
                            onClick={() => handleQualityChange(q)}
                            className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 rounded flex items-center justify-between"
                          >
                            <span className="text-sm">{q}</span>
                            {quality === q && <Check className="w-4 h-4" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* FPS Settings */}
                    <div className="mb-4">
                      <h3 className="text-white text-sm font-semibold mb-2">
                        Frame Rate
                      </h3>
                      <div className="space-y-1">
                        {["60", "30", "24"].map((f) => (
                          <button
                            key={f}
                            onClick={() => handleFpsChange(f)}
                            className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 rounded flex items-center justify-between"
                          >
                            <span className="text-sm">{f} FPS</span>
                            {fps === f && <Check className="w-4 h-4" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Speed Settings */}
                    <div>
                      <h3 className="text-white text-sm font-semibold mb-2">
                        Playback Speed
                      </h3>
                      <div className="space-y-1">
                        {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(
                          (speed) => (
                            <button
                              key={speed}
                              onClick={() => handlePlaybackRateChange(speed)}
                              className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 rounded flex items-center justify-between"
                            >
                              <span className="text-sm">
                                {speed === 1 ? "Normal" : `${speed}x`}
                              </span>
                              {playbackRate === speed && (
                                <Check className="w-4 h-4" />
                              )}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-gray-300 transition-colors"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                <Maximize className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
