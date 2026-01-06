import React, { useState, useRef, useEffect } from "react";
import {
  AlertTriangle,
  Eye,
  Camera,
  Monitor,
  Clock,
  ChevronDown,
  ChevronRight,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Maximize2,
  Settings,
  Filter,
  ExternalLink,
  Users,
  Image,
  Code,
  MousePointerClick,
  TrendingUp,
  CheckCircle,
  XCircle,
  FileText,
  BarChart3,
  Brain,
  Target,
  Zap,
  Download,
  Share2,
  Bell,
  Menu,
  Search,
  User,
} from "lucide-react";
import shaka from "shaka-player";

// Video URL constants
// const SCREEN_VIDEO_URL = 'https://content.jwplatform.com/manifests/vM7nH0Kl.m3u8';
const SCREEN_VIDEO_URL = "https://hr-preprod-istreet-proctor.s3.us-east-1.amazonaws.com/proctor/ies/hackerrank/1943b0fe-444d-4cc8-9b6a-fcf4945ff9f1/processed/screen_share/hls_playlist/playlist_signed_1767670765.m3u8?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Checksum-Mode=ENABLED&X-Amz-Credential=ASIAYGLPC5QNHTWIVXGC%2F20260106%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260106T033925Z&X-Amz-Expires=21600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIHEX8o5l38F7jEUco0tCKdbUo%2BfJVRqXEf0FTVmsQKL%2BAiEA4toSfrM5WmbVrpjWHF8UE6LuhZw79PX33E1ZpxU44agqlQUIVRADGgw1NjM0MTA1NjIwNzQiDPidWMgRf79WoxSyiCryBM5JaoOjbfngga%2FRFSeJKy5XdaBWWMRhrk3X%2BKRugxmZw6UXgXn5aX1jJimq%2B2lfriDVTS4b2qq3hcGXdBEP%2BMPeatGtQ98H3xQjnxKeL5Wyv3aL3KwOd%2FlfgOgMliXkY0ivWsC%2BeQ6KPgZ99lpXmVf0kpP2DakG6THs%2Bc7X%2Bq3T1gKXDLKMBSsyXibWb%2Bf83n5qy8G2u4zlV6kExL4ff%2B%2BQtYdzw4pkf7%2Fs0JEV43ljF2099xzB0HKnIz0FyifYqhg93qpBRcNTHcejcI0uXRW2AsbxtuEpvQk%2BsnpwCbzuvjHl0xwtCd2SyCnITW6bcDiDup7fR2XxKQSlLPgbg4%2F8cpbsWH3Vsi1jE0cO53EKXpfg3dQsXZCXDuYLe6X6uMzynPGBodVpwSrNYFi6t49GbWgAJ6jBL7sOc3Cym%2Bg282lcbdq4uT5Y3%2B255htZxNWZZEdUj9M0tY1Loev9Jfikjp5IlfdaQHOOXlrBZGrGSdg8pY6FKYHx6AVWLh5acEaspCDDXVbmQRy5H2WusTOcNM5z%2F7QQFSyA0IT1PttIli4M6NPUQBNnUt7qoYlEOYRhaTj%2Bqx%2FD9HDWzg6KgXSCIR2B%2F%2Fdd4kqje8agLORlAf4%2BSSQ%2BvpCMcyTjns4DaZjc6aBh3g7VqDh8BuhtnGSKUNetN2xmsSESJVku4XOjj%2BeLg%2FkjfccY4GrsOeAtc1EE7ivM4FoQhTzFsZj7duOZjvxlMZXvhnKI%2Ffxj%2BSeks%2Brqm9A9S9gD3n%2FCcqc8RzbBEJn%2FNDn9YGueiOwEHqi5vrnrknFrgJ6XLA1bdbEG6DNl2ThzhfUSgoIkIqmOjx3RMM%2BH8soGOpkBx%2FUEZ5e9tokRWRavgYQsTnLmTcjG2%2FffmouIpHbYN%2BtzDtYlat4xSi%2Fe8IjhOOyDyuybobLuUurHl7afoqUIrbmA%2BK4E2fgViZ8GHjAen76zOxNuHUxN%2ByVSHhUL5wT5o47FspleAun2M0%2Bur1l2Vej9Yhj24U58BaULmuuGdTcvkFe%2FTfMtNmirhhel38crId6VX8anjjjp&X-Amz-SignedHeaders=host&x-id=GetObject&X-Amz-Signature=b7f01ed5ee5ceb491677a6e3c870638c856f7320f646860fa8391dc61680ca69" || "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
const WEBCAM_VIDEO_URL =
  "https://content.jwplatform.com/manifests/vM7nH0Kl.m3u8";

// Video is 12 minutes = 720 seconds
const VIDEO_DURATION = 720;
// Scale factor: 720 / 2850 = 0.2526
const scaleTime = (time) => Math.floor(time * (VIDEO_DURATION / 2850));

const OptimizedPlayerView = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedView, setSelectedView] = useState("split");
  const [showOnlyFlags, setShowOnlyFlags] = useState(true);
  const [activeIncident, setActiveIncident] = useState(null);
  const [expandedIncident, setExpandedIncident] = useState(null);
  const [showCorrelation, setShowCorrelation] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showScreenshotGallery, setShowScreenshotGallery] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [screenshotTab, setScreenshotTab] = useState("screen"); // "screen" or "webcam"
  const [incidentFilter, setIncidentFilter] = useState("all"); // all, critical, high, minor
  const [incidentSearch, setIncidentSearch] = useState("");
  const [incidentSort, setIncidentSort] = useState("time"); // time, severity, confidence
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [webcamPosition, setWebcamPosition] = useState({
    top: null,
    left: null,
    bottom: 16,
    right: 16,
  });
  const [isDragging, setIsDragging] = useState(false);
  const videoPlayerRef = useRef(null);
  const webcamRef = useRef(null);
  const screenVideoRef = useRef(null);
  const webcamVideoRef = useRef(null);
  const webcamFullVideoRef = useRef(null);
  const screenPlayerRef = useRef(null);
  const webcamPlayerRef = useRef(null);
  const webcamFullPlayerRef = useRef(null);

  const [totalDuration, setTotalDuration] = useState(VIDEO_DURATION);

  const riskSegments = [
    {
      start: scaleTime(0),
      end: scaleTime(180),
      level: "normal",
      incidents: [],
    },
    {
      start: scaleTime(180),
      end: scaleTime(240),
      level: "minor",
      incidents: [],
    },
    {
      start: scaleTime(240),
      end: scaleTime(650),
      level: "normal",
      incidents: [],
    },
    {
      start: scaleTime(650),
      end: scaleTime(1250),
      level: "critical",
      incidents: [1],
    },
    {
      start: scaleTime(1250),
      end: scaleTime(1320),
      level: "normal",
      incidents: [],
    },
    {
      start: scaleTime(1320),
      end: scaleTime(1380),
      level: "high",
      incidents: [2],
    },
    {
      start: scaleTime(1380),
      end: scaleTime(1650),
      level: "normal",
      incidents: [],
    },
    {
      start: scaleTime(1650),
      end: scaleTime(1710),
      level: "critical",
      incidents: [3],
    },
    {
      start: scaleTime(1710),
      end: scaleTime(2100),
      level: "normal",
      incidents: [],
    },
    {
      start: scaleTime(2100),
      end: scaleTime(2220),
      level: "high",
      incidents: [4],
    },
    {
      start: scaleTime(2220),
      end: scaleTime(2400),
      level: "minor",
      incidents: [],
    },
    {
      start: scaleTime(2400),
      end: scaleTime(2520),
      level: "high",
      incidents: [5],
    },
    {
      start: scaleTime(2520),
      end: VIDEO_DURATION,
      level: "normal",
      incidents: [],
    },
  ];

  const performanceData = {
    avgCandidateScore: 6.2,
    thisCandidate: 8.1,
    avgSuspicionRate: 12,
    thisSuspicionRate: 36,
    avgIncidents: 1.8,
    thisIncidents: 5,
    typicalTestTime: 45,
    thisTestTime: 47.5,
  };

  const codeQuality = {
    beforeIncident1: { complexity: 3.2, lineCount: 45, quality: "basic" },
    afterIncident1: { complexity: 7.8, lineCount: 156, quality: "advanced" },
    improvement: "+144%",
    suddenJump: true,
  };

  const behavioralPatterns = [
    {
      pattern: "Extended Absence During Problem",
      confidence: 95,
      description:
        "10-min tab absence correlates with difficult algorithm section",
      evidence:
        "Typical candidates average 2-3 min thinking time for this problem",
    },
    {
      pattern: "Screenshot-Paste Correlation",
      confidence: 92,
      description:
        "Code paste events follow screenshot flags within 30 seconds",
      evidence: "5 out of 5 paste events preceded by suspicious screenshots",
    },
    {
      pattern: "Sudden Skill Level Jump",
      confidence: 88,
      description: "Code complexity increased 144% after incident #1",
      evidence: "From basic loops to advanced algorithms with optimizations",
    },
    {
      pattern: "Multiple Face During Debugging",
      confidence: 85,
      description: "Secondary person appears when candidate encounters errors",
      evidence: "All 4 detections occurred during failed test cases",
    },
  ];

  const incidents = [
    {
      id: 1,
      title: "Extended Tab Absence",
      reviewed: false,
      timeRange: "2:44 - 5:16",
      startTime: scaleTime(650),
      endTime: scaleTime(1250),
      duration: "2m 32s",
      severity: "critical",
      type: "context-switch",
      confidence: 95,
      description: "User left browser tab for extended period",
      details: [
        "Out of tab for 10 minutes continuously",
        "3 suspicious screenshots detected during this period",
        "Code changes observed immediately after returning",
        "Webcam inactive for 7 minutes during absence",
      ],
      subEvents: [
        { time: scaleTime(650), type: "Out of tab", icon: ExternalLink },
        { time: scaleTime(725), type: "Webcam stopped", icon: Camera },
        {
          time: scaleTime(780),
          type: "Suspicious screenshot #1",
          icon: Image,
          critical: true,
        },
        {
          time: scaleTime(920),
          type: "Suspicious screenshot #2",
          icon: Image,
          critical: true,
        },
        {
          time: scaleTime(1105),
          type: "Suspicious screenshot #3",
          icon: Image,
          critical: true,
        },
        { time: scaleTime(1190), type: "Webcam started", icon: Camera },
        { time: scaleTime(1250), type: "App in focus", icon: ExternalLink },
        {
          time: scaleTime(1255),
          type: "Suspicious code changes",
          icon: Code,
          critical: true,
        },
      ],
      aiInsight:
        "This 10-minute absence with simultaneous suspicious screenshots and immediate code changes strongly suggests external assistance or reference consultation.",
      correlation:
        "Code complexity jumped from 3.2 to 7.8 immediately after return. Solution now includes advanced algorithms not attempted before.",
      evidenceStrength: "STRONG",
    },
    {
      id: 2,
      title: "Multiple Face Detection",
      reviewed: false,
      timeRange: "5:33 - 5:50",
      startTime: scaleTime(1320),
      endTime: scaleTime(1380),
      duration: "17s",
      severity: "high",
      type: "face-detection",
      confidence: 85,
      description: "Secondary person detected in webcam feed",
      details: [
        "Multiple faces detected for 60 seconds",
        "Secondary face appeared 4 times",
        "Candidate looked away from screen frequently",
        "Code complexity increased after this period",
      ],
      subEvents: [
        {
          time: scaleTime(1320),
          type: "Multiple face detection",
          icon: Users,
          critical: true,
        },
        { time: scaleTime(1335), type: "Valid face detection", icon: Users },
        {
          time: scaleTime(1345),
          type: "Multiple face detection",
          icon: Users,
          critical: true,
        },
        { time: scaleTime(1355), type: "Valid face detection", icon: Users },
        {
          time: scaleTime(1365),
          type: "Multiple face detection",
          icon: Users,
          critical: true,
        },
        { time: scaleTime(1380), type: "Valid face detection", icon: Users },
      ],
      aiInsight:
        "Repeated appearance of a second person suggests possible collaboration or coaching during the test.",
      correlation:
        "All detections occurred during error handling. Test cases were passing after each detection.",
      evidenceStrength: "MODERATE",
    },
    {
      id: 3,
      title: "Suspicious Screenshot Pattern",
      reviewed: false,
      timeRange: "6:57 - 7:13",
      startTime: scaleTime(1650),
      endTime: scaleTime(1710),
      duration: "16s",
      severity: "critical",
      type: "screenshot",
      confidence: 92,
      description: "AI detected reference material on screen",
      details: [
        "5 consecutive screenshots flagged by AI",
        "External documentation visible in screenshots",
        "Screenshots show Stack Overflow and GitHub pages",
        "User copied code snippets after viewing",
      ],
      subEvents: [
        {
          time: scaleTime(1650),
          type: "Suspicious screenshot - Stack Overflow",
          icon: Image,
          critical: true,
        },
        {
          time: scaleTime(1660),
          type: "Suspicious screenshot - GitHub",
          icon: Image,
          critical: true,
        },
        {
          time: scaleTime(1670),
          type: "Suspicious screenshot - Documentation",
          icon: Image,
          critical: true,
        },
        {
          time: scaleTime(1680),
          type: "External paste detected",
          icon: Code,
          critical: true,
        },
        {
          time: scaleTime(1690),
          type: "Suspicious screenshot - Code snippet",
          icon: Image,
          critical: true,
        },
        { time: scaleTime(1710), type: "Code submitted", icon: Code },
      ],
      aiInsight:
        "Clear evidence of external reference material followed by code paste events indicates unauthorized resource usage.",
      correlation:
        "Pasted code matches Stack Overflow solution with 89% similarity. Same variable names and comments.",
      evidenceStrength: "VERY STRONG",
    },
    {
      id: 4,
      title: "Code Reset After Tab Switch",
      reviewed: false,
      timeRange: "8:52 - 9:24",
      startTime: scaleTime(2100),
      endTime: scaleTime(2220),
      duration: "32s",
      severity: "high",
      type: "context-switch",
      confidence: 78,
      description: "Suspicious code manipulation pattern",
      details: [
        "Multiple tab switches detected",
        "Code reset to previous version",
        "External paste event detected",
        "Solution complexity suddenly increased",
      ],
      subEvents: [
        { time: scaleTime(2100), type: "Out of tab", icon: ExternalLink },
        { time: scaleTime(2120), type: "App in focus", icon: ExternalLink },
        { time: scaleTime(2135), type: "Out of tab", icon: ExternalLink },
        { time: scaleTime(2155), type: "App in focus", icon: ExternalLink },
        {
          time: scaleTime(2165),
          type: "Suspicious code resetting",
          icon: Code,
          critical: true,
        },
        {
          time: scaleTime(2180),
          type: "External paste",
          icon: Code,
          critical: true,
        },
        {
          time: scaleTime(2220),
          type: "Suspicious editor input",
          icon: Code,
          critical: true,
        },
      ],
      aiInsight:
        "Pattern of leaving tab followed by code reset and paste suggests copying solution from external source.",
      correlation:
        "Pasted code contains optimizations not previously demonstrated by candidate.",
      evidenceStrength: "MODERATE",
    },
    {
      id: 5,
      title: "Webcam Manipulation Detected",
      reviewed: false,
      timeRange: "10:08 - 10:40",
      startTime: scaleTime(2400),
      endTime: scaleTime(2520),
      duration: "32s",
      severity: "high",
      type: "face-detection",
      confidence: 90,
      description: "Image spoofing attempt detected",
      details: [
        "AI detected image spoofing in webcam feed",
        "Static image used instead of live video",
        "Webcam switched multiple times",
        "No natural facial movements detected",
      ],
      subEvents: [
        { time: scaleTime(2400), type: "Webcam switch", icon: Camera },
        {
          time: scaleTime(2420),
          type: "Image spoofing detection",
          icon: Camera,
          critical: true,
        },
        {
          time: scaleTime(2460),
          type: "No face detection",
          icon: Users,
          critical: true,
        },
        { time: scaleTime(2490), type: "Webcam switch", icon: Camera },
        { time: scaleTime(2520), type: "Valid face detection", icon: Users },
      ],
      aiInsight:
        "Webcam manipulation indicates deliberate attempt to bypass proctoring surveillance.",
      correlation:
        "Manipulation occurred during final problem submission phase.",
      evidenceStrength: "STRONG",
    },
  ];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getRiskColor = (level) => {
    switch (level) {
      case "critical":
        return "bg-red-600";
      case "high":
        return "bg-gray-400";
      case "minor":
        return "bg-gray-300";
      case "normal":
        return "bg-gray-200";
      default:
        return "bg-gray-200";
    }
  };

  const getIncidentIcon = (type) => {
    const iconMap = {
      "context-switch": ExternalLink,
      "face-detection": Users,
      screenshot: Image,
      default: AlertTriangle,
    };
    return iconMap[type] || iconMap.default;
  };

  const jumpToIncident = (incident) => {
    setCurrentTime(incident.startTime);
    setActiveIncident(incident.id);
  };

  const skipToNextFlag = () => {
    const nextIncident = incidents.find((inc) => inc.startTime > currentTime);
    if (nextIncident) {
      jumpToIncident(nextIncident);
    }
  };

  const skipToPrevFlag = () => {
    const prevIncident = [...incidents]
      .reverse()
      .find((inc) => inc.endTime < currentTime);
    if (prevIncident) {
      jumpToIncident(prevIncident);
    }
  };

  const getCurrentIncident = () => {
    return incidents.find(
      (inc) => currentTime >= inc.startTime && currentTime <= inc.endTime
    );
  };

  // Extract all suspicious screenshots from incidents
  const getAllScreenshots = (mediaType = "all") => {
    const screenshots = [];
    incidents.forEach((incident) => {
      incident.subEvents.forEach((event) => {
        if (event.icon === Image && event.critical) {
          // Determine if it's a screen or webcam screenshot
          // For now, all current screenshots are screen-related
          // Webcam screenshots would have different indicators
          const isWebcam = event.type?.toLowerCase().includes("webcam") || 
                          event.type?.toLowerCase().includes("face") ||
                          incident.type === "face-detection";
          const isScreen = !isWebcam;
          
          if (mediaType === "all" || 
              (mediaType === "screen" && isScreen) || 
              (mediaType === "webcam" && isWebcam)) {
            screenshots.push({
              id: `${incident.id}-${event.time}`,
              time: event.time,
              type: event.type,
              incidentId: incident.id,
              incidentTitle: incident.title,
              severity: incident.severity,
              confidence: incident.confidence,
              mediaType: isWebcam ? "webcam" : "screen",
            });
          }
        }
      });
    });
    return screenshots.sort((a, b) => a.time - b.time);
  };

  // Filter and sort incidents
  const getFilteredAndSortedIncidents = () => {
    let filtered = incidents.filter((incident) => {
      // Filter by severity
      if (incidentFilter !== "all" && incident.severity !== incidentFilter) {
        return false;
      }
      // Filter by search
      if (
        incidentSearch &&
        !incident.title.toLowerCase().includes(incidentSearch.toLowerCase()) &&
        !incident.description
          .toLowerCase()
          .includes(incidentSearch.toLowerCase())
      ) {
        return false;
      }
      return true;
    });

    // Sort incidents
    filtered = [...filtered].sort((a, b) => {
      switch (incidentSort) {
        case "severity":
          const severityOrder = { critical: 3, high: 2, minor: 1, normal: 0 };
          return severityOrder[b.severity] - severityOrder[a.severity];
        case "confidence":
          return b.confidence - a.confidence;
        case "time":
        default:
          return a.startTime - b.startTime;
      }
    });

    return filtered;
  };


  // Fullscreen functionality
  const toggleFullscreen = () => {
    if (!videoPlayerRef.current) return;

    const videoPlayerContainer = videoPlayerRef.current.closest(
      ".bg-white.rounded-lg"
    );
    if (!videoPlayerContainer) return;

    if (!isFullscreen) {
      if (videoPlayerContainer.requestFullscreen) {
        videoPlayerContainer.requestFullscreen();
      } else if (videoPlayerContainer.webkitRequestFullscreen) {
        videoPlayerContainer.webkitRequestFullscreen();
      } else if (videoPlayerContainer.mozRequestFullScreen) {
        videoPlayerContainer.mozRequestFullScreen();
      } else if (videoPlayerContainer.msRequestFullscreen) {
        videoPlayerContainer.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        !!(
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
        )
      );
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  const handleWebcamMouseDown = (e) => {
    if (e.button !== 0) return; // Only handle left mouse button
    if (selectedView !== "split") return; // Only allow dragging in split view

    e.preventDefault();
    e.stopPropagation();

    if (webcamRef.current && videoPlayerRef.current) {
      // Ensure element is visible before getting rect
      const webcamRect = webcamRef.current.getBoundingClientRect();
      const containerRect = videoPlayerRef.current.getBoundingClientRect();

      // Check if element is actually visible (not hidden)
      if (webcamRect.width === 0 || webcamRect.height === 0) {
        return;
      }

      const offsetX = e.clientX - webcamRect.left;
      const offsetY = e.clientY - webcamRect.top;

      setIsDragging(true);

      const handleMouseMove = (moveEvent) => {
        if (
          !videoPlayerRef.current ||
          !webcamRef.current ||
          selectedView !== "split"
        ) {
          setIsDragging(false);
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
          return;
        }

        const containerRect = videoPlayerRef.current.getBoundingClientRect();
        const webcamRect = webcamRef.current.getBoundingClientRect();

        // Check if element is visible
        if (webcamRect.width === 0 || webcamRect.height === 0) {
          return;
        }

        // Calculate new position relative to container
        let newLeft = moveEvent.clientX - containerRect.left - offsetX;
        let newTop = moveEvent.clientY - containerRect.top - offsetY;

        // Constrain within container bounds
        const maxLeft = containerRect.width - webcamRect.width;
        const maxTop = containerRect.height - webcamRect.height;

        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));

        setWebcamPosition({
          top: newTop,
          left: newLeft,
          bottom: null,
          right: null,
        });
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
  };

  // Initialize Shaka Players
  useEffect(() => {
    // Install built-in polyfills to patch browser incompatibilities
    shaka.polyfill.installAll();

    // Check if browser is supported
    if (!shaka.Player.isBrowserSupported()) {
      console.error("Browser not supported");
      return;
    }

    let screenPlayer = null;
    let webcamPlayer = null;
    let webcamFullPlayer = null;

    // Initialize screen player
    if (screenVideoRef.current) {
      screenPlayer = new shaka.Player(screenVideoRef.current);
      screenPlayer.configure({
        streaming: {
          bufferingGoal: 30,
          rebufferingGoal: 2,
        },
      });

      screenPlayer
        .load(SCREEN_VIDEO_URL)
        .then(() => {
          // Disable audio after loading
          const audioTracks = screenPlayer.getAudioTracks();
          if (audioTracks.length > 0) {
            audioTracks.forEach((track) => {
              track.enabled = false;
            });
          }
          // Update total duration from video (use actual video duration or fallback to 720)
          if (screenVideoRef.current) {
            const duration = screenVideoRef.current.duration;
            if (duration && !isNaN(duration) && duration > 0) {
              setTotalDuration(Math.floor(duration));
            } else {
              setTotalDuration(VIDEO_DURATION);
            }
          }
        })
        .catch((error) => {
          console.error("Error loading screen video:", error);
        });

      screenPlayerRef.current = screenPlayer;
    }

    // Initialize webcam player (floating overlay)
    if (webcamVideoRef.current) {
      webcamPlayer = new shaka.Player(webcamVideoRef.current);
      webcamPlayer.configure({
        streaming: {
          bufferingGoal: 30,
          rebufferingGoal: 2,
        },
      });

      webcamPlayer
        .load(WEBCAM_VIDEO_URL)
        .then(() => {
          // Disable audio after loading
          const audioTracks = webcamPlayer.getAudioTracks();
          if (audioTracks.length > 0) {
            audioTracks.forEach((track) => {
              track.enabled = false;
            });
          }
        })
        .catch((error) => {
          console.error("Error loading webcam video:", error);
        });

      webcamPlayerRef.current = webcamPlayer;
    }

    // Initialize full webcam player
    if (webcamFullVideoRef.current) {
      webcamFullPlayer = new shaka.Player(webcamFullVideoRef.current);
      webcamFullPlayer.configure({
        streaming: {
          bufferingGoal: 30,
          rebufferingGoal: 2,
        },
      });

      webcamFullPlayer
        .load(WEBCAM_VIDEO_URL)
        .then(() => {
          // Disable audio after loading
          const audioTracks = webcamFullPlayer.getAudioTracks();
          if (audioTracks.length > 0) {
            audioTracks.forEach((track) => {
              track.enabled = false;
            });
          }
        })
        .catch((error) => {
          console.error("Error loading full webcam video:", error);
        });

      webcamFullPlayerRef.current = webcamFullPlayer;
    }

    // Sync timelines - update currentTime when screen video time changes
    const syncTime = () => {
      if (screenVideoRef.current && screenVideoRef.current.readyState >= 2) {
        const time = screenVideoRef.current.currentTime;
        if (!isNaN(time) && time >= 0) {
          setCurrentTime(time);

          // Sync webcam players to same time
          if (
            webcamVideoRef.current &&
            webcamVideoRef.current.readyState >= 2
          ) {
            const webcamTime = webcamVideoRef.current.currentTime;
            if (Math.abs(webcamTime - time) > 0.1) {
              webcamVideoRef.current.currentTime = time;
            }
          }
          if (
            webcamFullVideoRef.current &&
            webcamFullVideoRef.current.readyState >= 2
          ) {
            const webcamFullTime = webcamFullVideoRef.current.currentTime;
            if (Math.abs(webcamFullTime - time) > 0.1) {
              webcamFullVideoRef.current.currentTime = time;
            }
          }
        }
      }
    };

    const timeUpdateInterval = setInterval(syncTime, 100);

    // Cleanup
    return () => {
      clearInterval(timeUpdateInterval);
      if (screenPlayer) {
        screenPlayer.destroy();
      }
      if (webcamPlayer) {
        webcamPlayer.destroy();
      }
      if (webcamFullPlayer) {
        webcamFullPlayer.destroy();
      }
    };
  }, []);

  // Sync play/pause state
  useEffect(() => {
    const playVideos = async () => {
      const playPromises = [];

      if (
        screenVideoRef.current &&
        (selectedView === "split" || selectedView === "screen")
      ) {
        if (isPlaying) {
          playPromises.push(
            screenVideoRef.current
              .play()
              .catch((err) => console.log("Screen play error:", err))
          );
        } else {
          screenVideoRef.current.pause();
        }
      }

      if (selectedView === "split" && webcamVideoRef.current) {
        if (isPlaying) {
          playPromises.push(
            webcamVideoRef.current
              .play()
              .catch((err) => console.log("Webcam play error:", err))
          );
        } else {
          webcamVideoRef.current.pause();
        }
      }
      if (selectedView === "webcam" && webcamFullVideoRef.current) {
        if (isPlaying) {
          playPromises.push(
            webcamFullVideoRef.current
              .play()
              .catch((err) => console.log("Webcam full play error:", err))
          );
        } else {
          webcamFullVideoRef.current.pause();
        }
      }

      if (playPromises.length > 0) {
        try {
          await Promise.all(playPromises);
        } catch (error) {
          console.error("Play error:", error);
        }
      }
    };

    playVideos();
  }, [isPlaying, selectedView]);

  // Sync playback speed
  useEffect(() => {
    if (
      screenVideoRef.current &&
      (selectedView === "split" || selectedView === "screen")
    ) {
      screenVideoRef.current.playbackRate = playbackSpeed;
    }
    if (selectedView === "split" && webcamVideoRef.current) {
      webcamVideoRef.current.playbackRate = playbackSpeed;
    }
    if (selectedView === "webcam" && webcamFullVideoRef.current) {
      webcamFullVideoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, selectedView]);

  // Sync seek when currentTime changes externally (from timeline)
  useEffect(() => {
    if (screenVideoRef.current) {
      const screenTime = screenVideoRef.current.currentTime || 0;
      // Only seek if the difference is significant (more than 0.5 seconds)
      // This prevents infinite loops from the sync interval
      if (Math.abs(screenTime - currentTime) > 0.5 && currentTime >= 0) {
        screenVideoRef.current.currentTime = currentTime;
        if (webcamVideoRef.current && webcamVideoRef.current.readyState >= 2) {
          webcamVideoRef.current.currentTime = currentTime;
        }
        if (
          webcamFullVideoRef.current &&
          webcamFullVideoRef.current.readyState >= 2
        ) {
          webcamFullVideoRef.current.currentTime = currentTime;
        }
      }
    }
  }, [currentTime]);

  // Reset dragging state when view changes
  useEffect(() => {
    if (selectedView !== "split") {
      setIsDragging(false);
    }
  }, [selectedView]);

  const currentIncident = getCurrentIncident();
  const criticalPeriodStart = scaleTime(650);
  const criticalPeriodEnd = scaleTime(1250);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Enterprise Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-900 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-lg">HR</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    HackerRank
                  </div>
                  <div className="text-xs text-gray-500">
                    Integrity Review System v3.2
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <div className="h-8 w-px bg-gray-300"></div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Hanad ur Rehman
                  </span>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb & Session Info */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Home</span>
            <ChevronRight className="w-4 h-4" />
            <span>Session Reviews</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">ID: 834498469</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              Last Updated: 2 min ago
            </span>
            <div className="h-4 w-px bg-gray-300"></div>
            <span className="text-xs text-gray-500">Reviewer: John Smith</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-6 pt-4">
        <div className="grid grid-cols-12 gap-6">
          {/* Center Panel - Video Player */}
          <div className="col-span-9 space-y-4">
            {/* Video Player */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div
                ref={videoPlayerRef}
                className="aspect-video bg-gray-900 relative"
              >
                {/* Main Screen Recording - Always mounted, conditionally visible */}
                <div
                  className={`absolute inset-0 bg-gray-900 ${
                    selectedView === "split" || selectedView === "screen"
                      ? "block"
                      : "hidden"
                  }`}
                >
                  <video
                    ref={screenVideoRef}
                    className="w-full h-full object-contain"
                    playsInline
                    muted
                  />
                  <div className="absolute top-4 left-4 bg-black/80 px-3 py-1.5 rounded text-xs font-medium text-white border border-gray-700 z-10">
                    Screen Recording
                  </div>
                  {currentIncident && currentIncident.type === "screenshot" && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 px-3 py-1.5 rounded text-xs font-bold animate-pulse border border-red-500 flex items-center gap-1 z-10">
                      <AlertTriangle className="w-3 h-3" />
                      SUSPICIOUS CONTENT
                    </div>
                  )}
                </div>

                {/* Floating Webcam - Only when split view */}
                <div
                  ref={webcamRef}
                  className={`absolute w-64 h-48 bg-gray-800 rounded-lg border-2 border-gray-700 shadow-2xl overflow-hidden ${
                    isDragging ? "cursor-grabbing" : "cursor-move"
                  } select-none ${
                    selectedView === "split" ? "block" : "hidden"
                  }`}
                  style={{
                    top:
                      webcamPosition.top !== null
                        ? `${webcamPosition.top}px`
                        : undefined,
                    left:
                      webcamPosition.left !== null
                        ? `${webcamPosition.left}px`
                        : undefined,
                    bottom:
                      webcamPosition.bottom !== null
                        ? `${webcamPosition.bottom}px`
                        : undefined,
                    right:
                      webcamPosition.right !== null
                        ? `${webcamPosition.right}px`
                        : undefined,
                    minWidth: "160px",
                    minHeight: "120px",
                    maxWidth: "400px",
                    maxHeight: "300px",
                    zIndex: isDragging ? 50 : 10,
                    pointerEvents: selectedView === "split" ? "auto" : "none",
                  }}
                  onMouseDown={
                    selectedView === "split" ? handleWebcamMouseDown : undefined
                  }
                >
                  <video
                    ref={webcamVideoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                  />
                  <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 rounded text-xs font-medium text-white z-10 pointer-events-none">
                    Webcam
                  </div>
                  {currentIncident &&
                    currentIncident.type === "face-detection" && (
                      <div className="absolute top-10 left-2 bg-gray-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 text-white z-10 pointer-events-none">
                        <Users className="w-3 h-3" />
                        MULTIPLE FACES
                      </div>
                    )}
                </div>

                {/* Full Webcam View - Always mounted, conditionally visible */}
                <div
                  className={`absolute inset-0 bg-gray-800 ${
                    selectedView === "webcam" ? "block" : "hidden"
                  }`}
                >
                  <video
                    ref={webcamFullVideoRef}
                    className="w-full h-full object-contain"
                    playsInline
                    muted
                  />
                  <div className="absolute top-4 left-4 bg-black/80 px-3 py-1.5 rounded text-xs font-medium text-white border border-gray-700 z-10">
                    Webcam Feed
                  </div>
                  {currentIncident &&
                    currentIncident.type === "face-detection" && (
                      <div className="absolute top-16 left-4 bg-gray-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 text-white z-10">
                        <Users className="w-3 h-3" />
                        MULTIPLE FACES
                      </div>
                    )}
                </div>
              </div>

              {/* Single Unified Timeline */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
                <div
                  className="relative h-8 bg-white rounded border border-gray-300 overflow-hidden cursor-pointer"
                  onClick={(e) => {
                    // Only handle click if not clicking on incident marker, sub-event marker, or time indicator
                    if (
                      e.target.closest(".incident-marker") ||
                      e.target.closest(".sub-event-marker") ||
                      e.target.closest(".time-indicator")
                    ) {
                      return;
                    }
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const percentage = Math.max(0, Math.min(1, x / rect.width));
                    setCurrentTime(Math.floor(percentage * totalDuration));
                  }}
                >
                  {/* Risk segments as background */}
                  <div className="absolute inset-0 flex pointer-events-none">
                    {riskSegments.map((segment, idx) => (
                      <div
                        key={idx}
                        className={`${getRiskColor(
                          segment.level
                        )} opacity-70 hover:opacity-90 transition-opacity relative`}
                        style={{
                          width: `${
                            ((segment.end - segment.start) / totalDuration) *
                            100
                          }%`,
                        }}
                      >
                        {segment.start >= criticalPeriodStart &&
                          segment.end <= criticalPeriodEnd && (
                            <div className="absolute inset-0 border-t-2 border-b-2 border-red-600 bg-red-600/20"></div>
                          )}
                      </div>
                    ))}
                  </div>

                  {/* Critical period label */}
                  <div
                    className="absolute top-0 h-full bg-red-600/10 border-l-2 border-r-2 border-red-600 pointer-events-none"
                    style={{
                      left: `${(criticalPeriodStart / totalDuration) * 100}%`,
                      width: `${
                        ((criticalPeriodEnd - criticalPeriodStart) /
                          totalDuration) *
                        100
                      }%`,
                    }}
                  >
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-red-600 px-2 py-0.5 rounded text-xs font-bold text-white whitespace-nowrap">
                      CRITICAL: 95%
                    </div>
                  </div>

                    {/* Incident markers */}
                    {incidents.map((incident) => (
                      <div
                        key={incident.id}
                        className="incident-marker absolute top-0 h-full flex items-center cursor-pointer group z-10"
                        style={{
                          left: `${(incident.startTime / totalDuration) * 100}%`,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          jumpToIncident(incident);
                        }}
                      >
                        <div className="relative">
                          <div
                            className={`w-1 h-8 ${
                              incident.severity === "critical"
                                ? "bg-red-600"
                                : "bg-gray-600"
                            } group-hover:bg-gray-900 transition-colors shadow`}
                          ></div>
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-xl">
                            <div className="font-semibold text-gray-900">
                              {incident.title}
                            </div>
                            <div className="text-gray-600 text-xs">
                              {incident.timeRange}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Sub-event markers */}
                    {incidents.map((incident) =>
                      incident.subEvents.map((event, eventIdx) => {
                        const EventIcon = event.icon;
                        return (
                          <div
                            key={`${incident.id}-${eventIdx}`}
                            className="sub-event-marker absolute top-0 h-full flex items-center cursor-pointer group z-5"
                            style={{
                              left: `${(event.time / totalDuration) * 100}%`,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentTime(event.time);
                              setActiveIncident(incident.id);
                            }}
                          >
                            <div className="w-px h-full bg-gray-400 group-hover:bg-gray-600 transition-colors"></div>
                            <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg pointer-events-none">
                              <div className="flex items-center gap-1.5">
                                <EventIcon className="w-3 h-3 text-gray-600" />
                                <span className="font-medium text-gray-900">
                                  {event.type}
                                </span>
                              </div>
                              <div className="text-gray-500 text-xs mt-0.5">
                                {formatTime(event.time)}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}

                  {/* Current time indicator - draggable */}
                  <div
                    className="time-indicator absolute top-0 h-full w-0.5 bg-gray-400 z-20 cursor-ew-resize"
                    style={{ left: `${(currentTime / totalDuration) * 100}%` }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      const timeline = e.currentTarget.parentElement;
                      const rect = timeline.getBoundingClientRect();

                      const handleMouseMove = (moveEvent) => {
                        const x = moveEvent.clientX - rect.left;
                        const percentage = Math.max(
                          0,
                          Math.min(1, x / rect.width)
                        );
                        setCurrentTime(Math.floor(percentage * totalDuration));
                      };

                      const handleMouseUp = () => {
                        document.removeEventListener(
                          "mousemove",
                          handleMouseMove
                        );
                        document.removeEventListener("mouseup", handleMouseUp);
                      };

                      document.addEventListener("mousemove", handleMouseMove);
                      document.addEventListener("mouseup", handleMouseUp);
                    }}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 px-2 py-0.5 rounded text-xs font-medium text-gray-700 whitespace-nowrap shadow-sm">
                      {formatTime(currentTime)}
                    </div>
                    {/* Draggable handle */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-8 bg-white border-2 border-gray-400 rounded-md shadow-sm hover:border-gray-600 hover:shadow-md transition-all"></div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={skipToPrevFlag}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors border border-gray-300"
                      title="Previous incident"
                    >
                      <SkipBack className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsPlaying(!isPlaying);
                      }}
                      className="p-2.5 bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 text-white" />
                      ) : (
                        <Play className="w-5 h-5 text-white" />
                      )}
                    </button>
                    <button
                      onClick={skipToNextFlag}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors border border-gray-300"
                      title="Next incident"
                    >
                      <SkipForward className="w-4 h-4 text-gray-700" />
                    </button>
                    <span className="text-sm text-gray-700 font-mono ml-2">
                      {formatTime(currentTime)} / {formatTime(totalDuration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedView("split");
                        }}
                        className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                          selectedView === "split"
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        Split
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedView("screen");
                        }}
                        className={`px-3 py-1.5 text-xs font-medium transition-colors border-l border-gray-300 ${
                          selectedView === "screen"
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        Screen
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedView("webcam");
                        }}
                        className={`px-3 py-1.5 text-xs font-medium transition-colors border-l border-gray-300 ${
                          selectedView === "webcam"
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        Webcam
                      </button>
                    </div>

                    <select
                      value={playbackSpeed}
                      onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                      className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-700"
                    >
                      <option value={0.5}>0.5x</option>
                      <option value={1}>1x</option>
                      <option value={1.5}>1.5x</option>
                      <option value={2}>2x</option>
                      <option value={4}>4x</option>
                    </select>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFullscreen();
                      }}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors border border-gray-300"
                      title="Toggle fullscreen"
                    >
                      <Maximize2 className="w-4 h-4 text-gray-700" />
                    </button>

                    <button
                      onClick={() => setShowCorrelation(!showCorrelation)}
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-xs font-medium flex items-center gap-2"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Analysis
                    </button>
                    <button
                      onClick={() => setShowComparison(!showComparison)}
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-xs font-medium flex items-center gap-2"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Compare
                    </button>
                    <button
                      onClick={() => {
                        setShowScreenshotGallery(!showScreenshotGallery);
                        setScreenshotTab("screen"); // Reset to screen tab when opening
                      }}
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-xs font-medium flex items-center gap-2"
                    >
                      <Image className="w-4 h-4" />
                      Media Gallery
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Context */}
            {currentIncident && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    Current Context - {formatTime(currentTime)}
                  </h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="text-xs text-gray-600 mb-1">Severity</div>
                      <div className="text-lg font-bold text-gray-900">
                        {currentIncident.severity.toUpperCase()}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="text-xs text-gray-600 mb-1">
                        Confidence
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {currentIncident.confidence}%
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="text-xs text-gray-600 mb-1">Evidence</div>
                      <div className="text-lg font-bold text-gray-900">
                        {currentIncident.evidenceStrength}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <div className="text-xs font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        AI Analysis
                      </div>
                      <div className="text-sm text-gray-800">
                        {currentIncident.aiInsight}
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <div className="text-xs font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Correlation Found
                      </div>
                      <div className="text-sm text-gray-800">
                        {currentIncident.correlation}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Incidents */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm sticky top-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <div className="px-3 py-2.5 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-gray-600" />
                    All Incidents ({getFilteredAndSortedIncidents().length})
                  </h3>
                </div>

                {/* Search Bar */}
                <div className="relative mb-2.5">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search incidents..."
                    value={incidentSearch}
                    onChange={(e) => setIncidentSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  />
                </div>

                {/* Filters and Sort */}
                <div className="flex gap-2">
                  <select
                    value={incidentFilter}
                    onChange={(e) => setIncidentFilter(e.target.value)}
                    className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all cursor-pointer"
                  >
                    <option value="all">All</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="minor">Minor</option>
                  </select>
                  <select
                    value={incidentSort}
                    onChange={(e) => setIncidentSort(e.target.value)}
                    className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all cursor-pointer"
                  >
                    <option value="time">Time</option>
                    <option value="severity">Severity</option>
                    <option value="confidence">Confidence</option>
                  </select>
                </div>
              </div>
              <div className="p-3 space-y-2.5">
                {getFilteredAndSortedIncidents().map((incident) => (
                  <div key={incident.id} className="space-y-2">
                    <button
                      onClick={() => {
                        jumpToIncident(incident);
                        setExpandedIncident(
                          expandedIncident === incident.id ? null : incident.id
                        );
                      }}
                      className={`w-full text-left p-2.5 rounded-lg transition-all border ${
                        currentIncident?.id === incident.id
                          ? "border-gray-300 bg-gray-50 shadow-sm"
                          : "bg-white hover:bg-gray-50 hover:border-gray-300 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {incident.severity === "critical" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-md">
                                <AlertTriangle className="w-3 h-3" />
                                Critical
                              </span>
                            )}
                            {incident.id === 1 && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-300 text-gray-700 text-xs font-medium rounded-md">
                                <Target className="w-3 h-3" />
                                Priority
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-1 leading-tight">
                            {incident.title}
                          </h4>
                          <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                            {incident.description}
                          </p>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="flex items-center gap-1.5 text-gray-500">
                              <Clock className="w-3.5 h-3.5" />
                              <span className="font-medium">{incident.timeRange}</span>
                            </span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span className="text-gray-600 font-medium">
                              {incident.evidenceStrength}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>

                    {expandedIncident === incident.id && (
                      <div className="ml-4 pl-4 border-l-2 border-gray-200 space-y-1.5">
                        {incident.subEvents.map((event, idx) => {
                          const Icon = event.icon;
                          return (
                            <button
                              key={idx}
                              onClick={() => setCurrentTime(event.time)}
                              className={`w-full text-left p-2.5 rounded-md text-xs hover:bg-gray-50 transition-all ${
                                event.critical
                                  ? "bg-red-50/50 border border-red-100 hover:bg-red-50"
                                  : "bg-white border border-gray-100 hover:border-gray-200"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div className={`flex-shrink-0 p-1 rounded ${
                                  event.critical
                                    ? "bg-red-100"
                                    : "bg-gray-100"
                                }`}>
                                  <Icon
                                    className={`w-3.5 h-3.5 ${
                                      event.critical
                                        ? "text-red-600"
                                        : "text-gray-500"
                                    }`}
                                  />
                                </div>
                                <span className="font-mono text-xs text-gray-500 font-medium min-w-[3rem]">
                                  {formatTime(event.time)}
                                </span>
                                <span
                                  className={`text-xs ${
                                    event.critical
                                      ? "text-gray-900 font-semibold"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {event.type}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI-Detected Behavioral Patterns Modal */}
      {showCorrelation && (
        <div
          className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
          onClick={() => setShowCorrelation(false)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  AI-Detected Behavioral Patterns
                </h3>
              </div>
              <button
                onClick={() => setShowCorrelation(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {behavioralPatterns.map((pattern, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-semibold text-sm text-gray-900">
                        {pattern.pattern}
                      </span>
                      <span className="px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded">
                        {pattern.confidence}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      {pattern.description}
                    </p>
                    <div className="flex items-start gap-2 text-sm text-gray-600 bg-white rounded p-3 border border-gray-200">
                      <CheckCircle className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                      <span>{pattern.evidence}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Comparison Modal */}
      {showComparison && (
        <div
          className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
          onClick={() => setShowComparison(false)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Performance vs Average Candidate
                </h3>
              </div>
              <button
                onClick={() => setShowComparison(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-sm text-gray-600 mb-3 font-medium">
                    Suspicion Rate
                  </div>
                  <div className="flex items-baseline gap-3 mb-2">
                    <div>
                      <div className="text-xs text-gray-500">Avg</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {performanceData.avgSuspicionRate}%
                      </div>
                    </div>
                    <div className="text-3xl text-gray-400">→</div>
                    <div>
                      <div className="text-xs text-gray-500">This</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {performanceData.thisSuspicionRate}%
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 font-semibold">
                    +
                    {performanceData.thisSuspicionRate -
                      performanceData.avgSuspicionRate}
                    % above avg
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-sm text-gray-600 mb-3 font-medium">
                    Critical Incidents
                  </div>
                  <div className="flex items-baseline gap-3 mb-2">
                    <div>
                      <div className="text-xs text-gray-500">Avg</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {performanceData.avgIncidents}
                      </div>
                    </div>
                    <div className="text-3xl text-gray-400">→</div>
                    <div>
                      <div className="text-xs text-gray-500">This</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {performanceData.thisIncidents}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 font-semibold">
                    +
                    {(
                      (performanceData.thisIncidents /
                        performanceData.avgIncidents -
                        1) *
                      100
                    ).toFixed(0)}
                    % above avg
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-sm text-gray-600 mb-3 font-medium">
                    Code Complexity Jump
                  </div>
                  <div className="flex items-baseline gap-3 mb-2">
                    <div>
                      <div className="text-xs text-gray-500">Before</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {codeQuality.beforeIncident1.complexity}
                      </div>
                    </div>
                    <div className="text-3xl text-gray-400">→</div>
                    <div>
                      <div className="text-xs text-gray-500">After</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {codeQuality.afterIncident1.complexity}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 font-semibold">
                    {codeQuality.improvement} increase
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-sm text-gray-600 mb-3 font-medium">
                    Code Lines Written
                  </div>
                  <div className="flex items-baseline gap-3 mb-2">
                    <div>
                      <div className="text-xs text-gray-500">Before</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {codeQuality.beforeIncident1.lineCount}
                      </div>
                    </div>
                    <div className="text-3xl text-gray-400">→</div>
                    <div>
                      <div className="text-xs text-gray-500">After</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {codeQuality.afterIncident1.lineCount}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 font-semibold">
                    +247% in 5 min
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screenshot Gallery Drawer/Modal */}
      {showScreenshotGallery && (
        <div
          className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
          onClick={() => setShowScreenshotGallery(false)}
        >
          <div
            className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Image className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Media Gallery
                  </h3>
                </div>
                <button
                  onClick={() => setShowScreenshotGallery(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              
              {/* Tabs */}
              <div className="flex gap-2 border-b border-gray-200">
                <button
                  onClick={() => setScreenshotTab("screen")}
                  className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                    screenshotTab === "screen"
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Screen ({getAllScreenshots("screen").length})
                </button>
                <button
                  onClick={() => setScreenshotTab("webcam")}
                  className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                    screenshotTab === "webcam"
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Webcam ({getAllScreenshots("webcam").length})
                </button>
              </div>
            </div>

            {/* Screenshot Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-4 gap-4">
                {getAllScreenshots(screenshotTab).map((screenshot) => (
                  <button
                    key={screenshot.id}
                    onClick={() => {
                      setSelectedScreenshot(screenshot);
                      setShowScreenshotGallery(false);
                    }}
                    className="relative group aspect-video bg-gray-900 rounded-lg border-2 border-gray-300 hover:border-red-500 transition-colors overflow-hidden"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image className="w-12 h-12 text-gray-600" />
                    </div>
                    <div className="absolute top-2 left-2 bg-red-600 px-2 py-0.5 rounded text-xs font-bold text-white">
                      AI DETECTED
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 text-white text-xs">
                      <div className="font-semibold truncate">
                        {screenshot.type}
                      </div>
                      <div className="text-gray-300">
                        {formatTime(screenshot.time)}
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-gray-900/80 px-2 py-0.5 rounded text-xs font-semibold text-white">
                      {screenshot.confidence}%
                    </div>
                    <div className="absolute inset-0 bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                ))}
              </div>
              {getAllScreenshots(screenshotTab).length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Image className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm">
                    No suspicious {screenshotTab === "screen" ? "screenshots" : "webcam images"} detected
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Individual Screenshot Detail Modal */}
      {selectedScreenshot && (
        <div
          className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
          onClick={() => setSelectedScreenshot(null)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedScreenshot.type}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {
                    incidents.find(
                      (inc) => inc.id === selectedScreenshot.incidentId
                    )?.title
                  }
                </p>
              </div>
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Screenshot Preview */}
              <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4 aspect-video flex items-center justify-center">
                <Image className="w-24 h-24 text-gray-600" />
                <div className="absolute top-4 left-4 bg-red-600 px-3 py-1.5 rounded text-xs font-bold text-white">
                  AI DETECTED
                </div>
                <div className="absolute top-4 right-4 bg-gray-900/80 px-3 py-1.5 rounded text-xs font-semibold text-white">
                  Confidence: {selectedScreenshot.confidence}%
                </div>
              </div>

              {/* Screenshot Details */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="text-xs text-gray-600 mb-1">Timestamp</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {formatTime(selectedScreenshot.time)}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="text-xs text-gray-600 mb-1">Severity</div>
                  <div className="text-sm font-semibold text-gray-900 uppercase">
                    {selectedScreenshot.severity}
                  </div>
                </div>
              </div>

              {/* Incident Info */}
              {(() => {
                const incident = incidents.find(
                  (inc) => inc.id === selectedScreenshot.incidentId
                );
                if (!incident) return null;
                return (
                  <div className="space-y-3">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <div className="text-xs font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        AI Analysis
                      </div>
                      <div className="text-sm text-gray-800">
                        {incident.aiInsight}
                      </div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <div className="text-xs font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Correlation Found
                      </div>
                      <div className="text-sm text-gray-800">
                        {incident.correlation}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setCurrentTime(selectedScreenshot.time);
                    const incident = incidents.find(
                      (inc) => inc.id === selectedScreenshot.incidentId
                    );
                    if (incident) {
                      setActiveIncident(incident.id);
                    }
                    setSelectedScreenshot(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  Jump to Timestamp
                </button>
                <button
                  onClick={() => setSelectedScreenshot(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Calendar icon component
const Calendar = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

export default OptimizedPlayerView;
