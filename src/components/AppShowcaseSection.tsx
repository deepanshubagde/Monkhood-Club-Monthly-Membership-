import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Globe,
  Star,
  Download,
  Share2,
  Search,
  Check,
  Video,
  BookOpen,
  MessageCircle,
  Flame,
  Clock,
  Play,
  User,
  Heart,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  MoreVertical,
  ThumbsUp,
  Share,
  Send,
  Lock,
  ExternalLink,
  Layers,
  Radio,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  CheckCircle2,
  FolderOpen,
  Trash2,
  Eye,
} from 'lucide-react';
import {
  saveScreenshotToDB,
  loadAllScreenshotsFromDB,
  deleteScreenshotFromDB,
  fileToDataUrl,
  syncScreenshotToServer,
} from '../utils/screenshotStorage';

export function AppShowcaseSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [showSlotManager, setShowSlotManager] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Exact screenshot paths or user-uploaded images
  const [uploadedImages, setUploadedImages] = useState<Record<number, string>>({});

  // Track if /screenshots/1.jpeg etc exist on disk (pre-initialized since 1.jpeg - 5.jpeg are confirmed)
  const [diskImageStatus, setDiskImageStatus] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
  });

  // 5 exact screenshot cards from the user's uploaded images
  const slides = [
    {
      id: 'feed',
      title: 'Sangha Community Feed & Live Zoom Sessions',
      subtitle: 'Sunday Live Session (28 likes • 50 comments • 407 views) + Monthly Course Releases',
      tabName: 'Feed',
      fallbackFile: '/screenshots/1.jpeg',
    },
    {
      id: 'courses-1',
      title: 'Mindful Transformation & Meditation Vault',
      subtitle: 'Featuring Rahul Dongre & Deepanshu Bagde Masterclasses',
      tabName: 'Courses (Vol. 1)',
      fallbackFile: '/screenshots/2.jpeg',
    },
    {
      id: 'courses-2',
      title: 'Sunday Live Vault & Jataka Wisdom',
      subtitle: 'Recorded 10 AM Sessions & Dr. Jasbir Chawala Wisdom Series',
      tabName: 'Courses (Vol. 2)',
      fallbackFile: '/screenshots/3.jpeg',
    },
    {
      id: 'courses-3',
      title: 'Psychosomatic Healing & Mindful Mastery',
      subtitle: 'Deepanshu Bagde & Dr. Sujit Bodhi Ancient Healing Series',
      tabName: 'Courses (Vol. 3)',
      fallbackFile: '/screenshots/4.jpeg',
    },
    {
      id: 'messages',
      title: 'Real-Time Communities & Live Rooms',
      subtitle: 'Yearly & Monthly Members Sangha with Live Broadcast Alerts',
      tabName: 'Messages',
      fallbackFile: '/screenshots/5.jpeg',
    },
  ];

  const totalSlides = slides.length;

  // Load from IndexedDB and check disk images on mount
  useEffect(() => {
    // 1. Check disk images using standard caching
    slides.forEach((slide, idx) => {
      const img = new Image();
      img.onload = () => {
        setDiskImageStatus((prev) => ({ ...prev, [idx]: true }));
      };
      img.onerror = () => {
        setDiskImageStatus((prev) => ({ ...prev, [idx]: false }));
      };
      img.src = slide.fallbackFile;
    });

    // 2. Load from IndexedDB
    loadAllScreenshotsFromDB().then((cached) => {
      if (cached && Object.keys(cached).length > 0) {
        setUploadedImages((prev) => ({ ...prev, ...cached }));
      }
    });
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 4500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 45) handleNext();
    else if (distance < -45) handlePrev();
  };

  // Upload single file for a specific slot
  const uploadFileToSlot = async (slotIdx: number, file: File) => {
    setIsProcessing(true);
    // Instant preview using ObjectURL
    const immediateUrl = URL.createObjectURL(file);
    setUploadedImages((prev) => ({ ...prev, [slotIdx]: immediateUrl }));
    setToastMessage(`✓ Screenshot for "${slides[slotIdx].tabName}" loaded!`);

    try {
      const dataUrl = await fileToDataUrl(file);
      await saveScreenshotToDB(slotIdx, dataUrl);
      await syncScreenshotToServer(slotIdx, dataUrl);
      setDiskImageStatus((prev) => ({ ...prev, [slotIdx]: true }));
    } catch (err) {
      console.error('Failed to persist screenshot:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle files from multi-upload or drag-and-drop
  const handleFilesSelected = async (files: FileList | File[]) => {
    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    if (fileList.length === 1) {
      await uploadFileToSlot(activeSlide, fileList[0]);
      return;
    }

    setIsProcessing(true);
    setToastMessage(`Processing ${fileList.length} screenshots...`);

    for (let i = 0; i < Math.min(fileList.length, 5); i++) {
      const file = fileList[i];
      let targetIdx = i;

      // Detect index if file has 1, 2, 3, 4, 5 in name
      const match = file.name.match(/(?:^|[^0-9])([1-5])(?:\.|$|[^0-9])/);
      if (match && match[1]) {
        const parsed = parseInt(match[1], 10) - 1;
        if (parsed >= 0 && parsed < 5) targetIdx = parsed;
      }

      const immediateUrl = URL.createObjectURL(file);
      setUploadedImages((prev) => ({ ...prev, [targetIdx]: immediateUrl }));

      try {
        const dataUrl = await fileToDataUrl(file);
        await saveScreenshotToDB(targetIdx, dataUrl);
        await syncScreenshotToServer(targetIdx, dataUrl);
        setDiskImageStatus((prev) => ({ ...prev, [targetIdx]: true }));
      } catch (e) {
        console.error('Error saving image:', e);
      }
    }

    setIsProcessing(false);
    setToastMessage(`✓ Successfully added ${fileList.length} screenshots!`);
  };

  const handleRemoveSlot = async (slotIdx: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    await deleteScreenshotFromDB(slotIdx);
    setUploadedImages((prev) => {
      const copy = { ...prev };
      delete copy[slotIdx];
      return copy;
    });
    setDiskImageStatus((prev) => ({ ...prev, [slotIdx]: false }));
    setToastMessage(`Reset ${slides[slotIdx].tabName} to interactive replica`);
  };

  const handleResetAll = async () => {
    for (let i = 0; i < 5; i++) {
      await deleteScreenshotFromDB(i);
    }
    setUploadedImages({});
    setDiskImageStatus({});
    setToastMessage('Reset all screens to interactive preview');
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 8000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  // Determine active image: uploaded custom image or verified disk screenshot
  const currentCustomImage = uploadedImages[activeSlide];
  const activeImageSrc = currentCustomImage || slides[activeSlide].fallbackFile;


  return (
    <section
      id="app-showcase-section"
      className="pt-12 sm:pt-18 pb-2 sm:pb-3 px-3 sm:px-6 lg:px-8 max-w-6xl mx-auto z-10 relative overflow-hidden"
      aria-label="Monkhood Club Mobile App Showcase"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        <h2 className="font-cinzel text-2xl sm:text-4xl font-bold tracking-wide text-slate-100 mb-3 gold-text-gradient">
          Get the Monkhood Club App
        </h2>

        {/* Platform Availability: Android, iOS & Web */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-amber-400/20 to-amber-500/15 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide shadow-[0_0_20px_rgba(245,215,127,0.15)] mb-3 backdrop-blur-md">
          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          <span>Android, iOS &amp; Web</span>
          <Globe className="w-3.5 h-3.5 text-amber-400" />
        </div>

        <p className="text-xs sm:text-base text-slate-300 font-light max-w-xl mx-auto">
          Access your digital sangha, live Sunday community sessions, meditation vault, and mastercourses across Android, iOS, and Web platforms.
        </p>
      </div>

      {/* 1. App Store & Play Store Screen Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-14">
        {/* Google Play Store Card */}
        <div
          id="playstore-preview-card"
          className="rounded-3xl p-5 sm:p-6 bg-[#111115] border border-slate-800 hover:border-amber-400/50 shadow-2xl transition-all font-sans"
        >
          {/* Top System Bar */}
          <div className="flex items-center justify-between text-slate-400 mb-4 text-xs">
            <div className="flex items-center space-x-3 text-slate-200">
              <ArrowLeft className="w-5 h-5 cursor-pointer" />
            </div>
            <MoreVertical className="w-5 h-5 text-slate-400" />
          </div>

          {/* App Header Row */}
          <div className="flex items-start space-x-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white p-2 border border-slate-300 flex items-center justify-center flex-shrink-0 shadow-md">
              <img src="/logo-sm.webp" alt="Monkhood Club Logo" width={48} height={48} loading="lazy" decoding="async" className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-100 truncate">Monkhood Club</h3>
              <p className="text-xs text-emerald-400 font-semibold">Education</p>
              <p className="text-[11px] text-slate-400">In-app purchases</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            <button className="py-2.5 text-center rounded-full bg-[#1e1e24] border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition">
              Uninstall
            </button>
            <button className="py-2.5 text-center rounded-full bg-[#a8c7fa] hover:bg-[#8ab4f8] text-[#041e49] text-xs font-bold transition shadow-sm">
              Open
            </button>
          </div>

          {/* What's new */}
          <div className="border-t border-slate-800/80 pt-3 pb-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-1">
              <span>What&apos;s new</span>
              <span className="text-slate-400">→</span>
            </div>
            <p className="text-[10px] text-slate-400">Last updated 8 Jul 2026</p>
            <p className="text-xs text-slate-300 mt-1">Start your journey with Monkhood Club</p>
          </div>

          {/* About this app */}
          <div className="pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-1">
              <span>About this app</span>
              <span className="text-slate-400">→</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              A Digital Sangha for Mindfulness, inner peace, healing, growth &amp; transformation.
            </p>
            <div className="mt-2.5 inline-block px-3 py-1 rounded-full bg-slate-800/80 text-[10px] font-medium text-slate-300 border border-slate-700">
              Education
            </div>
          </div>
        </div>

        {/* Apple App Store Card */}
        <div
          id="appstore-preview-card"
          className="rounded-3xl p-5 sm:p-6 bg-[#000000] border border-slate-800 hover:border-amber-400/50 shadow-2xl transition-all font-sans"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between text-slate-400 mb-4 text-xs">
            <ArrowLeft className="w-5 h-5 text-blue-500 cursor-pointer" />
            <Share2 className="w-5 h-5 text-blue-500 cursor-pointer" />
          </div>

          {/* App Header Row */}
          <div className="flex items-start space-x-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white p-2 border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-md">
              <img src="/logo-sm.webp" alt="Monkhood Club Logo" width={48} height={48} loading="lazy" decoding="async" className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white truncate">Monkhood Club</h3>
              <p className="text-xs text-slate-400">Education</p>
              <div className="mt-2">
                <button className="px-5 py-1 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold transition">
                  Open
                </button>
              </div>
            </div>
          </div>

          {/* App Store Metrics Row */}
          <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-2xl bg-[#1c1c1e] border border-slate-800 text-center mb-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Age Rating</span>
              <span className="font-bold text-white text-sm">16+</span>
              <span className="text-[9px] text-slate-400 block">Years</span>
            </div>
            <div className="border-x border-slate-700">
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Category</span>
              <span className="font-bold text-white text-sm">Education</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Developer</span>
              <span className="font-bold text-white text-xs truncate block mt-0.5">Mohammad Hasan</span>
            </div>
          </div>

          {/* Highlights */}
          <div className="pt-2 border-t border-slate-800 text-xs text-slate-300">
            <p className="font-medium text-slate-200">Monkhood Club Exclusive App</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Instant OTP mobile login, high-definition sangha livestreams, and masterclass libraries.
            </p>
          </div>
        </div>

        {/* Web Platform Banner */}
        <div
          id="web-platform-preview-banner"
          className="md:col-span-2 rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-[#111115] via-[#171328] to-[#111115] border border-amber-400/30 flex items-center justify-between flex-wrap gap-4 text-xs shadow-2xl backdrop-blur-md"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/15 border border-amber-400/35 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,215,127,0.2)] flex-shrink-0">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-0.5">
                <p className="font-bold text-slate-100 text-base">Web Browser Platform</p>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
                  Instant Web Access
                </span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Direct access on laptops, desktops, tablets &amp; mobile browsers with full video courses and community sync.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-amber-300 bg-amber-500/15 border border-amber-400/35 px-4 py-2 rounded-full shadow-sm">
              Android • iOS • Web
            </span>
          </div>
        </div>
      </div>

      {/* 2. Mobile App Screenshots Slider (Direct Smartphone Interface Presentation) */}
      <div className="relative max-w-4xl mx-auto">
        {/* Navigation Category Pill Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-4">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setActiveSlide(idx)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeSlide === idx
                  ? 'bg-amber-400 text-slate-950 shadow-md font-semibold scale-105'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-amber-400/40 hover:text-amber-300'
              }`}
            >
              {s.tabName}
            </button>
          ))}
        </div>

        {/* Carousel Slider with Latest iPhone Body */}
        <div className="relative flex items-center justify-center my-4 sm:my-6 px-2 sm:px-14">
          {/* Previous Change Button (Left) */}
          <button
            id="carousel-prev-btn"
            onClick={handlePrev}
            aria-label="Previous App Screen"
            className="absolute -left-2 sm:-left-4 md:-left-8 lg:-left-12 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#120f24]/90 border border-amber-400/60 hover:border-amber-300 text-amber-300 hover:text-amber-200 flex items-center justify-center backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.85),0_0_25px_rgba(245,215,127,0.25)] hover:scale-110 active:scale-95 transition-all cursor-pointer group"
            title="Previous Screen (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:-translate-x-0.5" />
          </button>

          {/* Next Change Button (Right) */}
          <button
            id="carousel-next-btn"
            onClick={handleNext}
            aria-label="Next App Screen"
            className="absolute -right-2 sm:-right-4 md:-right-8 lg:-right-12 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#120f24]/90 border border-amber-400/60 hover:border-amber-300 text-amber-300 hover:text-amber-200 flex items-center justify-center backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.85),0_0_25px_rgba(245,215,127,0.25)] hover:scale-110 active:scale-95 transition-all cursor-pointer group"
            title="Next Screen (Right Arrow)"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* iPhone Body Container (Latest iPhone 16 Pro / 15 Pro Titanium Chassis) */}
          <div className="relative mx-auto w-full max-w-[340px] xs:max-w-[360px] sm:max-w-[380px] md:max-w-[390px] select-none">
            {/* Hardware Buttons on the Titanium Rim */}
            {/* Left Side: Action Button + Volume Up + Volume Down */}
            <div className="absolute -left-[3.5px] top-[95px] w-[3.5px] h-[22px] bg-gradient-to-r from-[#2a2833] to-[#454350] rounded-l-[2px] shadow-sm z-10" />
            <div className="absolute -left-[3.5px] top-[135px] w-[3.5px] h-[46px] bg-gradient-to-r from-[#2a2833] to-[#454350] rounded-l-[2px] shadow-sm z-10" />
            <div className="absolute -left-[3.5px] top-[195px] w-[3.5px] h-[46px] bg-gradient-to-r from-[#2a2833] to-[#454350] rounded-l-[2px] shadow-sm z-10" />

            {/* Right Side: Power/Side Button + Camera Control */}
            <div className="absolute -right-[3.5px] top-[140px] w-[3.5px] h-[64px] bg-gradient-to-l from-[#2a2833] to-[#454350] rounded-r-[2px] shadow-sm z-10" />
            <div className="absolute -right-[3px] top-[230px] w-[3px] h-[46px] bg-gradient-to-l from-[#201e28] to-[#363442] rounded-r-[2px] shadow-sm z-10 ring-[0.5px] ring-white/10" />

            {/* iPhone Outer Titanium Chassis */}
            <div
              ref={sliderRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingOver(true);
              }}
              onDragLeave={() => setIsDraggingOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  handleFilesSelected(e.dataTransfer.files);
                }
              }}
              className={`relative rounded-[50px] sm:rounded-[56px] p-[3.5px] sm:p-[4px] bg-gradient-to-b from-[#565463] via-[#2c2b36] to-[#484654] shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(245,215,127,0.18)] transition-all ${
                isDraggingOver ? 'ring-4 ring-amber-400 scale-[1.01]' : 'ring-1 ring-white/20'
              }`}
            >
              {/* Subtle Brushed Titanium Highlights */}
              <div className="absolute inset-0 rounded-[50px] sm:rounded-[56px] pointer-events-none ring-1 ring-inset ring-white/15" />

              {/* Ultra-Thin Uniform Display Bezel (Deep Black OLED Framing) */}
              <div className="relative rounded-[47px] sm:rounded-[52px] p-[6px] sm:p-[7px] bg-[#000000]">
                {/* Speaker Micro-slit at the very top bezel */}
                <div className="absolute top-[2px] left-1/2 -translate-x-1/2 w-12 sm:w-14 h-[3px] bg-[#1a1924] rounded-full z-30 pointer-events-none" />

                {/* The Screen Display Surface */}
                <div className="relative rounded-[41px] sm:rounded-[46px] overflow-hidden bg-black flex flex-col justify-start">
                  {/* Dynamic Island (Pill with camera & sensor) */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 w-[100px] sm:w-[110px] h-[26px] sm:h-[28px] bg-black rounded-full flex items-center justify-between px-3 shadow-[0_2px_8px_rgba(0,0,0,0.8)] pointer-events-none ring-1 ring-white/[0.08]">
                    {/* Front Camera with optical antireflective lens coating */}
                    <div className="w-2.5 h-2.5 rounded-full bg-[#090f1d] ring-1 ring-[#1b253c]/70 relative flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-[#18284e]/60" />
                    </div>
                    {/* Ambient / Proximity sensor */}
                    <div className="w-2 h-2 rounded-full bg-[#050508] ring-1 ring-[#111118]" />
                  </div>

                  {/* Screen Glass Specular Glare / Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.035] to-transparent pointer-events-none z-20" />

                  {/* Drag & Drop Visual Overlay */}
                  {isDraggingOver && (
                    <div className="absolute inset-0 z-40 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-amber-400 rounded-[41px] sm:rounded-[46px] backdrop-blur-sm">
                      <Upload className="w-10 h-10 text-amber-400 animate-bounce mb-2" />
                      <p className="text-sm font-bold text-amber-200">Drop screenshot here</p>
                      <p className="text-xs text-slate-400 mt-1">Will attach to {slides[activeSlide].tabName}</p>
                    </div>
                  )}

                  {/* The Actual Screen Content (Exact Image OR Interactive Replica) */}
                  {activeImageSrc ? (
                    <div className="w-full bg-black relative flex items-center justify-center">
                      <img
                        src={activeImageSrc}
                        alt={slides[activeSlide].title}
                        className="w-full h-auto block select-none"
                      />
                    </div>
                  ) : (
            <div className="bg-white text-slate-900 overflow-hidden relative flex flex-col font-sans">
              {/* Quick Add floating pill when on interactive replica */}
              <div className="absolute top-2.5 right-2.5 z-20">
                <label
                  htmlFor="upload-single-slide-input"
                  className="px-2 py-1 rounded-full bg-slate-900/90 hover:bg-slate-900 border border-amber-400/40 text-amber-300 text-[10px] font-semibold backdrop-blur shadow flex items-center space-x-1 cursor-pointer"
                >
                  <Upload className="w-2.5 h-2.5 text-amber-400" />
                  <span>Upload Photo</span>
                </label>
              </div>
              {/* =========================================================================
                  SCREENSHOT 1: FEED SCREEN
                  Exact from user photo 1.jpeg:
                  - Top: App Store bar, Feed, +, Notification bell with red dot, Exit icon
                  - Filters: Post type ▼, Offerings ▼
                  - "Write down your Top learnings, ...See more"
                  - Zoom session: Sunday Live Community Session with 12 participant tiles
                  - Metrics: 28 likes • 50 comments • 407 views
                  - Heart, Comment, Share icons
                  - Post 2: Monkhood CLUB, 23d, MONTHLY NEW COURSE ALERT!
                  - Bottom tabs: Feed, Workshops, Courses, Messages
              ========================================================================== */}
              {activeSlide === 0 && (
                <div className="flex flex-col text-slate-900 bg-white">
                  {/* Top Header */}
                  <div className="px-4 pt-3 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-2xl font-bold font-sans tracking-tight text-black">Feed</h2>
                    <div className="flex items-center space-x-3.5 text-slate-800">
                      <span className="text-2xl font-light cursor-pointer leading-none">+</span>
                      <div className="relative cursor-pointer">
                        <span className="text-lg">🔔</span>
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
                      </div>
                      <div className="w-7 h-7 rounded-full bg-red-100/80 flex items-center justify-center text-red-500 text-xs font-bold cursor-pointer">
                        ↪
                      </div>
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center space-x-2 px-4 py-2 border-b border-slate-100 text-xs text-slate-700">
                    <span className="font-bold text-black mr-1">Filters</span>
                    <button className="px-3 py-1 rounded-full border border-slate-300 text-slate-700 flex items-center space-x-1 hover:bg-slate-50">
                      <span>Post type</span>
                      <span className="text-[10px]">▼</span>
                    </button>
                    <button className="px-3 py-1 rounded-full border border-slate-300 text-slate-700 flex items-center space-x-1 hover:bg-slate-50">
                      <span>Offerings</span>
                      <span className="text-[10px]">▼</span>
                    </button>
                  </div>

                  <div className="px-4 py-2 text-xs text-slate-600 border-b border-slate-100 font-normal">
                    Write down your Top learnings, <span className="text-slate-900 font-semibold cursor-pointer">...See more</span>
                  </div>

                  {/* Sunday Live Community Session Zoom Grid */}
                  <div className="mx-3 my-2 rounded-xl overflow-hidden border border-slate-300 bg-black shadow-md">
                    <div className="bg-[#12141a] p-2 flex flex-col justify-between">
                      {/* Zoom Title Bar */}
                      <div className="flex items-center justify-between text-[10px] text-slate-300 pb-1.5 px-1">
                        <div className="flex items-center space-x-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-500" />
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="font-semibold ml-1.5 text-white">Sunday Live Community Session</span>
                        </div>
                        <span className="text-slate-400 font-mono text-[9px]">⏱ 01:27:06</span>
                      </div>

                      {/* 4x3 Zoom Participants Matrix */}
                      <div className="grid grid-cols-4 gap-1.5 my-1">
                        {[
                          { name: 'Monkhood CLUB', active: true, thumbs: true },
                          { name: 'Seema Ingle', active: false },
                          { name: 'Ashwini Tole', active: false },
                          { name: 'Shobha Solanki', active: false },
                          { name: 'Sagar Naranja', active: false },
                          { name: 'BALAVANT K.', active: false },
                          { name: 'Shyam Kadam', active: false },
                          { name: 'Adv. Manda S.', active: false },
                          { name: 'Rani Nikam', active: false },
                          { name: 'Milind B.', active: false },
                          { name: 'Pravina W.', active: false },
                          { name: 'Priya Sawant', active: false },
                        ].map((user, idx) => (
                          <div
                            key={idx}
                            className={`aspect-[4/3] rounded-md bg-slate-800 border ${
                              user.active ? 'border-amber-400 bg-slate-700' : 'border-slate-700'
                            } flex flex-col justify-between p-1 overflow-hidden relative`}
                          >
                            <div className="w-full flex justify-end">
                              <span className="text-[7px] text-slate-400">🔇</span>
                            </div>
                            <div className="flex items-center justify-center flex-1">
                              <User className={`w-4 h-4 ${user.active ? 'text-amber-300' : 'text-slate-400'}`} />
                            </div>
                            <div className="text-[7px] text-slate-200 truncate bg-slate-900/90 px-1 py-0.5 rounded text-center">
                              {user.name}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Live Feedback overlay */}
                      <div className="bg-slate-900/95 border border-slate-700/60 text-[9px] text-emerald-300 px-2 py-1 rounded-md flex items-center justify-between mt-1">
                        <span>💬 Great experience thank you Sirji! Amazing feeling...</span>
                        <span className="text-slate-400 text-[8px]">Feeling like internal cleaning</span>
                      </div>
                    </div>

                    {/* Engagement Counts */}
                    <div className="px-3 py-2 bg-white flex items-center justify-between text-xs text-slate-600 border-t border-slate-100">
                      <span className="font-medium">28 likes • 50 comments • 407 views</span>
                    </div>

                    {/* Action Bar */}
                    <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center justify-between text-slate-600">
                      <div className="flex items-center space-x-4">
                        <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                        <MessageSquare className="w-5 h-5 text-slate-700" />
                      </div>
                      <Share2 className="w-5 h-5 text-slate-700" />
                    </div>
                  </div>

                  {/* Feed Post 2: Monthly New Course Alert */}
                  <div className="mx-3 mb-3 p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 font-bold text-xs">
                          MC
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">Monkhood CLUB</span>
                          <span className="text-[10px] text-slate-400">23d • Monkhood Club - Yearly Members...</span>
                        </div>
                      </div>
                      <span className="text-slate-400">•••</span>
                    </div>
                    <p className="font-bold text-slate-900 mb-1 flex items-center space-x-1">
                      <span>✨ MONTHLY NEW COURSE ALERT! ✨</span>
                    </p>
                    <p className="text-xs text-slate-600">
                      Your new course for this month has been unlocked in the courses library...
                    </p>
                  </div>

                  {/* Authentic 4-Tab Bottom App Navigation */}
                  <div className="border-t border-slate-200 px-4 py-2.5 flex items-center justify-around text-slate-500 text-[11px] bg-white">
                    <div className="flex flex-col items-center text-red-500 font-bold">
                      <Flame className="w-5 h-5 mb-0.5" />
                      <span>Feed</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Video className="w-5 h-5 mb-0.5 text-slate-400" />
                      <span>Workshops</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <BookOpen className="w-5 h-5 mb-0.5 text-slate-400" />
                      <span>Courses</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <MessageSquare className="w-5 h-5 mb-0.5 text-slate-400" />
                      <span>Messages</span>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  SCREENSHOT 2: COURSES SCREEN (PART 1)
                  Exact from user photo 2.jpeg:
                  - Top: Courses, Search, Notification bell, Exit icon
                  - Course 1: Mindful Tool for Transformation - by Rahul Dongre
                    (Monkhood Club - Monthly Membership +2, 1 section • 5 lectures)
                  - Course 2: Special Inner Peace Meditation Session - by Deepanshu Bagde
                    (Monkhood Club - Monthly Membership +2, 1 section • 1 lecture)
                  - WhatsApp floating icon
                  - Bottom tabs with Courses active
              ========================================================================== */}
              {activeSlide === 1 && (
                <div className="flex flex-col text-slate-900 bg-white">
                  {/* Top Header */}
                  <div className="px-4 pt-3 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-2xl font-bold font-sans tracking-tight text-black">Courses</h2>
                    <div className="flex items-center space-x-3.5 text-slate-800">
                      <Search className="w-5 h-5 cursor-pointer" />
                      <div className="relative cursor-pointer">
                        <span className="text-lg">🔔</span>
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
                      </div>
                      <div className="w-7 h-7 rounded-full bg-red-100/80 flex items-center justify-center text-red-500 text-xs font-bold cursor-pointer">
                        ↪
                      </div>
                    </div>
                  </div>

                  {/* Course Card 1: Mindful Tool for Transformation (Rahul Dongre) */}
                  <div className="mx-3 my-2.5 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                    <div className="h-36 bg-gradient-to-br from-[#0c232c] via-[#0f343e] to-[#1a5563] p-3 text-white flex items-center justify-between relative overflow-hidden">
                      <div className="relative z-10 max-w-[65%]">
                        <div className="w-6 h-6 rounded-full bg-amber-400/30 flex items-center justify-center text-amber-300 text-xs mb-1 font-bold">
                          ☸
                        </div>
                        <h3 className="font-serif text-base font-bold leading-tight text-white mb-0.5">
                          Mindful Tool <br />
                          <span className="italic text-amber-200">for Transformation</span>
                        </h3>
                        <p className="text-xs text-slate-300 mb-2">- by Rahul Dongre</p>
                        <div className="flex items-center space-x-1 text-[8px] text-amber-200 uppercase font-semibold">
                          <span>Mindfulness</span>
                          <span>•</span>
                          <span>Awareness</span>
                          <span>•</span>
                          <span>Clarity</span>
                        </div>
                      </div>

                      {/* Instructor Photo Placeholder */}
                      <div className="w-24 h-28 rounded-2xl bg-amber-400/20 border-2 border-amber-300/40 p-1 flex flex-col items-center justify-center text-center shadow-lg relative z-10">
                        <div className="w-14 h-14 rounded-full bg-slate-900 border border-amber-300/60 flex items-center justify-center text-amber-300 font-bold mb-1">
                          <User className="w-7 h-7" />
                        </div>
                        <span className="text-[9px] text-amber-200 font-bold">Rahul D.</span>
                      </div>
                    </div>

                    <div className="p-3">
                      <p className="text-[10px] text-slate-500 font-medium">Monkhood Club – Monthly Membership +2</p>
                      <h4 className="text-sm font-bold text-slate-900">
                        Mindful Tools For Transformation
                      </h4>
                      <p className="text-xs text-slate-600 font-medium">Rahul Dongre</p>
                      <p className="text-[11px] text-slate-400">1 section • 5 lectures</p>
                    </div>
                  </div>

                  {/* Course Card 2: Special Inner Peace Meditation Session (Deepanshu Bagde) */}
                  <div className="mx-3 mb-2.5 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                    <div className="h-36 bg-gradient-to-br from-[#12281e] via-[#1a3d2e] to-[#255842] p-3 text-white flex items-center justify-between relative overflow-hidden">
                      <div className="relative z-10 max-w-[65%]">
                        <div className="w-6 h-6 rounded-full bg-amber-400/30 flex items-center justify-center text-amber-300 text-xs mb-1 font-bold">
                          🪷
                        </div>
                        <span className="text-[9px] text-amber-300 font-serif italic block">Special</span>
                        <h3 className="font-serif text-base font-bold leading-tight text-white mb-0.5">
                          Inner Peace <br />
                          <span className="text-amber-200">Meditation</span>
                        </h3>
                        <p className="text-xs text-slate-300 mb-2">- by Deepanshu Bagde</p>
                        <div className="flex items-center space-x-1 text-[8px] text-emerald-200 uppercase font-semibold">
                          <span>Healing</span>
                          <span>•</span>
                          <span>Balance</span>
                          <span>•</span>
                          <span>Calm</span>
                        </div>
                      </div>

                      {/* Instructor Photo Placeholder */}
                      <div className="w-24 h-28 rounded-2xl bg-emerald-400/20 border-2 border-emerald-300/40 p-1 flex flex-col items-center justify-center text-center shadow-lg relative z-10">
                        <div className="w-14 h-14 rounded-full bg-slate-900 border border-emerald-300/60 flex items-center justify-center text-emerald-300 font-bold mb-1">
                          <User className="w-7 h-7" />
                        </div>
                        <span className="text-[9px] text-emerald-200 font-bold">Deepanshu B.</span>
                      </div>
                    </div>

                    <div className="p-3">
                      <p className="text-[10px] text-slate-500 font-medium">Monkhood Club – Monthly Membership +2</p>
                      <h4 className="text-sm font-bold text-slate-900">
                        Special Inner Peace Meditation Session
                      </h4>
                      <p className="text-xs text-slate-600 font-medium">Deepanshu Bagde</p>
                      <p className="text-[11px] text-slate-400">1 section • 1 lecture</p>
                    </div>
                  </div>

                  {/* Authentic 4-Tab Bottom App Navigation */}
                  <div className="border-t border-slate-200 px-4 py-2.5 flex items-center justify-around text-slate-500 text-[11px] bg-white">
                    <div className="flex flex-col items-center">
                      <Flame className="w-5 h-5 mb-0.5 text-slate-400" />
                      <span>Feed</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Video className="w-5 h-5 mb-0.5 text-slate-400" />
                      <span>Workshops</span>
                    </div>
                    <div className="flex flex-col items-center text-red-500 font-bold">
                      <BookOpen className="w-5 h-5 mb-0.5" />
                      <span>Courses</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <MessageSquare className="w-5 h-5 mb-0.5 text-slate-400" />
                      <span>Messages</span>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  SCREENSHOT 3: COURSES SCREEN (PART 2)
                  Exact from user photo 3.jpeg:
                  - Top: Courses, Search, Notification bell, Exit icon
                  - Course 1: COMMUNITY SESSION VAULT (Sunday Live Community Session - 10 AM)
                    (Monkhood CLUB, 2 sections • 3 lectures)
                  - Course 2: Stress Management Through Jataka Wisdom - by Dr. Jasbir Chawala
                    (Ancient Tales. Timeless Teachings, 6 sections • 6 lectures)
                  - Bottom tabs with Courses active
              ========================================================================== */}
              {activeSlide === 2 && (
                <div className="flex flex-col text-slate-900 bg-white">
                  {/* Top Header */}
                  <div className="px-4 pt-3 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-2xl font-bold font-sans tracking-tight text-black">Courses</h2>
                    <div className="flex items-center space-x-3.5 text-slate-800">
                      <Search className="w-5 h-5 cursor-pointer" />
                      <div className="relative cursor-pointer">
                        <span className="text-lg">🔔</span>
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
                      </div>
                      <div className="w-7 h-7 rounded-full bg-red-100/80 flex items-center justify-center text-red-500 text-xs font-bold cursor-pointer">
                        ↪
                      </div>
                    </div>
                  </div>

                  {/* Course Card 1: Community Session Vault */}
                  <div className="mx-3 my-2.5 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                    <div className="h-36 bg-gradient-to-br from-[#1c1208] via-[#3a200e] to-[#5a3215] p-3 text-white flex flex-col items-center justify-center text-center relative overflow-hidden">
                      <div className="w-8 h-8 rounded-full bg-amber-400/30 flex items-center justify-center text-amber-300 text-sm mb-1 font-bold">
                        ⚜️
                      </div>
                      <h3 className="font-serif text-base font-bold tracking-widest text-amber-100 uppercase mb-0.5">
                        COMMUNITY SESSION VAULT
                      </h3>
                      <p className="text-xs text-amber-200/90 font-serif">Ancient Tales. Timeless Teachings.</p>
                    </div>

                    <div className="p-3">
                      <p className="text-[10px] text-slate-500 font-medium">Monkhood Club – Monthly Membership +2</p>
                      <h4 className="text-sm font-bold text-slate-900">
                        Sunday Live Community Session - 10 AM
                      </h4>
                      <p className="text-xs text-slate-600 font-medium">Monkhood CLUB</p>
                      <p className="text-[11px] text-slate-400">2 sections • 3 lectures</p>
                    </div>
                  </div>

                  {/* Course Card 2: Stress Management Through Jataka Wisdom (Dr. Jasbir Chawala) */}
                  <div className="mx-3 mb-2.5 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                    <div className="h-36 bg-gradient-to-br from-[#241a0e] via-[#3d2c16] to-[#5b4222] p-3 text-white flex items-center justify-between relative overflow-hidden">
                      <div className="relative z-10 max-w-[65%]">
                        <h3 className="font-serif text-base font-bold leading-tight text-white mb-0.5">
                          Stress <br />
                          <span className="text-amber-200">Management</span>
                        </h3>
                        <span className="text-[9px] uppercase tracking-wider text-amber-300 block font-semibold mb-1">
                          Through Jataka Wisdom
                        </span>
                        <p className="text-xs text-slate-300">- by Dr. Jasbir Chawala</p>
                      </div>

                      {/* Instructor Photo Placeholder */}
                      <div className="w-24 h-28 rounded-2xl bg-amber-600/20 border-2 border-amber-400/40 p-1 flex flex-col items-center justify-center text-center shadow-lg relative z-10">
                        <div className="w-14 h-14 rounded-full bg-slate-900 border border-amber-400/60 flex items-center justify-center text-amber-300 font-bold mb-1">
                          <User className="w-7 h-7" />
                        </div>
                        <span className="text-[9px] text-amber-200 font-bold">Dr. Jasbir C.</span>
                      </div>
                    </div>

                    <div className="p-3">
                      <p className="text-[10px] text-slate-500 font-medium">Monkhood Club – Monthly Membership +2</p>
                      <h4 className="text-sm font-bold text-slate-900">
                        Stress Management Through Jataka Wisdom
                      </h4>
                      <p className="text-xs text-slate-600 font-medium">Dr. Jasbir Chawala</p>
                      <p className="text-[11px] text-slate-400">6 sections • 6 lectures</p>
                    </div>
                  </div>

                  {/* Authentic 4-Tab Bottom App Navigation */}
                  <div className="border-t border-slate-200 px-4 py-2.5 flex items-center justify-around text-slate-500 text-[11px] bg-white">
                    <div className="flex flex-col items-center">
                      <Flame className="w-5 h-5 mb-0.5 text-slate-400" />
                      <span>Feed</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Video className="w-5 h-5 mb-0.5 text-slate-400" />
                      <span>Workshops</span>
                    </div>
                    <div className="flex flex-col items-center text-red-500 font-bold">
                      <BookOpen className="w-5 h-5 mb-0.5" />
                      <span>Courses</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <MessageSquare className="w-5 h-5 mb-0.5 text-slate-400" />
                      <span>Messages</span>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  SCREENSHOT 4: COURSES SCREEN (PART 3)
                  Exact from user photo 4.jpeg:
                  - Top: Courses, Search, Notification bell, Exit icon
                  - Course 1: Automatic negative thoughts and psychosomatic diseases - by Deepanshu Bagde
                    (Monkhood Club - Monthly Membership +2, 1 section • 1 lecture)
                  - Course 2: Mindful Healing Mastery - by Dr. Sujit Bodhi
                    (Monkhood Club - Monthly Membership +2, 1 section • 5 lectures)
                  - Bottom tabs with Courses active
              ========================================================================== */}
              {activeSlide === 3 && (
                <div className="flex flex-col text-slate-900 bg-white">
                  {/* Top Header */}
                  <div className="px-4 pt-3 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-2xl font-bold font-sans tracking-tight text-black">Courses</h2>
                    <div className="flex items-center space-x-3.5 text-slate-800">
                      <Search className="w-5 h-5 cursor-pointer" />
                      <div className="relative cursor-pointer">
                        <span className="text-lg">🔔</span>
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
                      </div>
                      <div className="w-7 h-7 rounded-full bg-red-100/80 flex items-center justify-center text-red-500 text-xs font-bold cursor-pointer">
                        ↪
                      </div>
                    </div>
                  </div>

                  {/* Course Card 1: Automatic Negative Thoughts & Psychosomatic Diseases */}
                  <div className="mx-3 my-2.5 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                    <div className="h-36 bg-gradient-to-br from-[#0c242c] via-[#123c47] to-[#1f5f70] p-3 text-white flex items-center justify-between relative overflow-hidden">
                      <div className="relative z-10 max-w-[65%]">
                        <h3 className="font-serif text-xs font-bold leading-tight text-white mb-0.5">
                          Automatic <br />
                          <span className="italic text-cyan-200">Negative Thoughts</span> and <br />
                          <span className="text-amber-200">Psychosomatic Diseases</span>
                        </h3>
                        <p className="text-xs text-slate-300 mb-2">- by Deepanshu Bagde</p>
                        <div className="flex items-center space-x-1 text-[8px] text-cyan-200 uppercase font-semibold">
                          <span>Mind</span>
                          <span>•</span>
                          <span>Body</span>
                          <span>•</span>
                          <span>Heal</span>
                        </div>
                      </div>

                      {/* Instructor Photo Placeholder */}
                      <div className="w-24 h-28 rounded-2xl bg-cyan-400/20 border-2 border-cyan-300/40 p-1 flex flex-col items-center justify-center text-center shadow-lg relative z-10">
                        <div className="w-14 h-14 rounded-full bg-slate-900 border border-cyan-300/60 flex items-center justify-center text-cyan-300 font-bold mb-1">
                          <User className="w-7 h-7" />
                        </div>
                        <span className="text-[9px] text-cyan-200 font-bold">Deepanshu B.</span>
                      </div>
                    </div>

                    <div className="p-3">
                      <p className="text-[10px] text-slate-500 font-medium">Monkhood Club – Monthly Membership +2</p>
                      <h4 className="text-sm font-bold text-slate-900">
                        Automatic negative thoughts and psychosomatic diseases.
                      </h4>
                      <p className="text-xs text-slate-600 font-medium">Deepanshu Bagde</p>
                      <p className="text-[11px] text-slate-400">1 section • 1 lecture</p>
                    </div>
                  </div>

                  {/* Course Card 2: Mindful Healing Mastery (Dr. Sujit Bodhi) */}
                  <div className="mx-3 mb-2.5 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                    <div className="h-36 bg-gradient-to-br from-[#122b1f] via-[#1a412f] to-[#276045] p-3 text-white flex items-center justify-between relative overflow-hidden">
                      <div className="relative z-10 max-w-[65%]">
                        <span className="text-[9px] uppercase tracking-wider text-amber-300 block font-semibold mb-0.5">
                          Ancient Wisdom
                        </span>
                        <h3 className="font-serif text-base font-bold leading-tight text-white mb-0.5">
                          Mindful <br />
                          <span className="text-amber-200 italic">Healing Mastery</span>
                        </h3>
                        <p className="text-xs text-slate-300 mb-2">- by Dr. Sujit Bodhi</p>
                        <div className="flex items-center space-x-1 text-[8px] text-emerald-200 uppercase font-semibold">
                          <span>Healing</span>
                          <span>•</span>
                          <span>Growth</span>
                          <span>•</span>
                          <span>Transformation</span>
                        </div>
                      </div>

                      {/* Instructor Photo Placeholder */}
                      <div className="w-24 h-28 rounded-2xl bg-emerald-400/20 border-2 border-emerald-300/40 p-1 flex flex-col items-center justify-center text-center shadow-lg relative z-10">
                        <div className="w-14 h-14 rounded-full bg-slate-900 border border-emerald-300/60 flex items-center justify-center text-emerald-300 font-bold mb-1">
                          <User className="w-7 h-7" />
                        </div>
                        <span className="text-[9px] text-emerald-200 font-bold">Dr. Sujit B.</span>
                      </div>
                    </div>

                    <div className="p-3">
                      <p className="text-[10px] text-slate-500 font-medium">Monkhood Club – Monthly Membership +2</p>
                      <h4 className="text-sm font-bold text-slate-900">
                        Mindful Healing Mastery
                      </h4>
                      <p className="text-xs text-slate-600 font-medium">Dr. Sujit Bodhi</p>
                      <p className="text-[11px] text-slate-400">1 section • 5 lectures</p>
                    </div>
                  </div>

                  {/* Authentic 4-Tab Bottom App Navigation */}
                  <div className="border-t border-slate-200 px-4 py-2.5 flex items-center justify-around text-slate-500 text-[11px] bg-white">
                    <div className="flex flex-col items-center">
                      <Flame className="w-5 h-5 mb-0.5 text-slate-400" />
                      <span>Feed</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Video className="w-5 h-5 mb-0.5 text-slate-400" />
                      <span>Workshops</span>
                    </div>
                    <div className="flex flex-col items-center text-red-500 font-bold">
                      <BookOpen className="w-5 h-5 mb-0.5" />
                      <span>Courses</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <MessageSquare className="w-5 h-5 mb-0.5 text-slate-400" />
                      <span>Messages</span>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  SCREENSHOT 5: MESSAGES & SANGHA CIRCLES SCREEN
                  Exact from user photo 5.jpeg:
                  - Top: Messages, Notification bell, Exit icon
                  - Tabs: Communities (Active), Inbox
                  - Room 1: Monkhood Club - Yearly Members (Badge 1, WE ARE LIVE!, 06/09/2026)
                  - Room 2: Monkhood Club - Monthly Members (Badge 1, WE ARE LIVE!, 06/09/2026)
                  - Room 3: Silver Membership - Advanced Mind...
                  - Floating WhatsApp chat icon
                  - Bottom tabs with Messages active
              ========================================================================== */}
              {activeSlide === 4 && (
                <div className="flex flex-col text-slate-900 bg-white">
                  {/* Top Header */}
                  <div className="px-4 pt-3 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-2xl font-bold font-sans tracking-tight text-black">Messages</h2>
                    <div className="flex items-center space-x-3.5 text-slate-800">
                      <div className="relative cursor-pointer">
                        <span className="text-lg">🔔</span>
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
                      </div>
                      <div className="w-7 h-7 rounded-full bg-red-100/80 flex items-center justify-center text-red-500 text-xs font-bold cursor-pointer">
                        ↪
                      </div>
                    </div>
                  </div>

                  {/* Communities / Inbox Toggle Tabs */}
                  <div className="grid grid-cols-2 gap-2.5 mx-4 my-2.5 text-center text-xs">
                    <div className="py-2 rounded-full bg-red-50 text-red-600 font-bold border border-red-200 shadow-xs cursor-pointer">
                      Communities
                    </div>
                    <div className="py-2 rounded-full text-slate-500 font-medium hover:bg-slate-50 cursor-pointer">
                      Inbox
                    </div>
                  </div>

                  {/* Community Room 1: Monkhood Club - Yearly Members */}
                  <div className="mx-3 mb-2 p-3 rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center text-xs font-bold">
                          MC
                        </div>
                        <div>
                          <span className="font-bold text-xs sm:text-sm text-slate-900 block">Monkhood Club – Yearly Members...</span>
                          <span className="text-[10px] text-slate-400">Monkhood CLUB</span>
                        </div>
                      </div>
                      <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                        1
                      </span>
                    </div>
                    <div className="pl-10 space-y-0.5">
                      <p className="text-xs text-slate-600 truncate font-normal">
                        Team: 🌸 MONKHOOD CLUB – SUNDA... 06/09/2026
                      </p>
                      <p className="text-xs text-red-600 font-bold flex items-center space-x-1.5">
                        <span>Team: 🔴 WE ARE LIVE!</span>
                        <span className="text-[10px] text-slate-400 font-normal">06/09/2026</span>
                      </p>
                    </div>
                  </div>

                  {/* Community Room 2: Monkhood Club - Monthly Members */}
                  <div className="mx-3 mb-2 p-3 rounded-2xl border border-amber-300 bg-amber-50/40 shadow-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-bold shadow-xs">
                          MC
                        </div>
                        <div>
                          <span className="font-bold text-xs sm:text-sm text-amber-950 block">Monkhood Club – Monthly Membe...</span>
                          <span className="text-[10px] text-amber-700">Monkhood CLUB</span>
                        </div>
                      </div>
                      <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                        1
                      </span>
                    </div>
                    <div className="pl-10 space-y-0.5">
                      <p className="text-xs text-slate-700 truncate font-normal">
                        Team: 🌸 MONKHOOD CLUB – SUNDA... 06/09/2026
                      </p>
                      <p className="text-xs text-red-600 font-bold">
                        Team: 🔴 WE ARE LIVE!
                      </p>
                    </div>
                  </div>

                  {/* Community Room 3: Silver Membership */}
                  <div className="mx-3 mb-3 p-3 rounded-2xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 text-slate-700 flex items-center justify-center text-xs font-bold">
                          🧘
                        </div>
                        <div>
                          <span className="font-bold text-xs sm:text-sm text-slate-900 block">Silver Membership – Advanced Mind...</span>
                          <span className="text-[10px] text-slate-400">Monkhood CLUB</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 truncate pl-10">
                      Monkhood: Hey everyone, welcome to the circle!
                    </p>
                  </div>

                  {/* Authentic 4-Tab Bottom App Navigation */}
                  <div className="border-t border-slate-200 px-4 py-2.5 flex items-center justify-around text-slate-500 text-[11px] bg-white">
                    <div className="flex flex-col items-center">
                      <Flame className="w-5 h-5 mb-0.5 text-slate-400" />
                      <span>Feed</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Video className="w-5 h-5 mb-0.5 text-slate-400" />
                      <span>Workshops</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <BookOpen className="w-5 h-5 mb-0.5 text-slate-400" />
                      <span>Courses</span>
                    </div>
                    <div className="flex flex-col items-center text-red-500 font-bold">
                      <MessageSquare className="w-5 h-5 mb-0.5" />
                      <span>Messages</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

                  {/* iOS Home Indicator Bar */}
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 sm:w-32 h-[4px] bg-white/70 rounded-full z-30 pointer-events-none shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Screen Info & Navigation Card Below the iPhone */}
        <div className="mt-4 sm:mt-6 text-center max-w-lg mx-auto px-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-2 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Screen {activeSlide + 1} of {totalSlides} • {slides[activeSlide].tabName}</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-100 mb-1 leading-snug">
            {slides[activeSlide].title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {slides[activeSlide].subtitle}
          </p>
        </div>

        {/* Quick Change Bar & Pagination Dots */}
        <div className="flex items-center justify-center space-x-3 mt-4 mb-1">
          <button
            onClick={handlePrev}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer active:scale-95 shadow-sm"
            title="Previous Screen (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4 text-amber-400" />
            <span>Prev</span>
          </button>

          {/* Carousel Pagination Dots */}
          <div className="flex items-center space-x-2 px-1">
            {slides.map((_, idx) => (
              <button
                key={idx}
                id={`carousel-dot-${idx}`}
                onClick={() => setActiveSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeSlide === idx
                    ? 'w-7 bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_12px_rgba(245,215,127,0.8)]'
                    : 'w-2 bg-amber-400/20 hover:bg-amber-400/40'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer active:scale-95 shadow-sm"
            title="Next Screen (Right Arrow)"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </section>
  );
}
