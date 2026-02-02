'use client';

import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Tablet, Shield, Lock, Cpu, ArrowRight, Laptop } from 'lucide-react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isEmulator: boolean;
  deviceType: string;
  reason: string[];
}

/**
 * Comprehensive device detection for security purposes
 * Detects mobile devices, tablets, and emulators
 */
function detectDevice(): DeviceInfo {
  if (typeof window === 'undefined') {
    return { isMobile: false, isTablet: false, isEmulator: false, deviceType: 'unknown', reason: [] };
  }

  const ua = navigator.userAgent.toLowerCase();
  const reasons: string[] = [];

  // ============ Mobile Detection ============
  const mobileKeywords = [
    'android', 'webos', 'iphone', 'ipod', 'blackberry', 'iemobile', 
    'opera mini', 'opera mobi', 'mobile safari', 'windows phone',
    'fennec', 'mobile', 'symbian', 'palm', 'treo', 'hiptop',
    'avantgo', 'plucker', 'blazer', 'xiino', 'kindle', 'wap',
    'midp', 'j2me', 'cldc', 'up.browser', 'up.link', 'mmp',
    'obigo', 'netfront', 'teleca', 'semc', 'playbook'
  ];
  
  const isMobileUA = mobileKeywords.some(keyword => ua.includes(keyword));
  if (isMobileUA) reasons.push('Mobile device detected via User-Agent');

  // ============ Tablet Detection ============
  const tabletKeywords = ['ipad', 'tablet', 'playbook', 'silk', 'kindle'];
  const isTabletUA = tabletKeywords.some(keyword => ua.includes(keyword));
  
  // iPad with desktop mode detection
  const isIPadDesktopMode = ua.includes('macintosh') && navigator.maxTouchPoints > 1;
  if (isTabletUA) reasons.push('Tablet device detected via User-Agent');
  if (isIPadDesktopMode) reasons.push('iPad in desktop mode detected');

  // ============ Screen Size Detection ============
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const viewportWidth = window.innerWidth;
  const smallScreen = Math.min(screenWidth, screenHeight) < 768;
  const narrowViewport = viewportWidth < 1024;
  
  if (smallScreen) reasons.push(`Small screen detected (${screenWidth}x${screenHeight})`);

  // ============ Touch Device Detection ============
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const hasMouse = window.matchMedia('(pointer: fine)').matches;
  const touchOnlyDevice = hasTouch && !hasMouse;
  
  if (touchOnlyDevice && smallScreen) {
    reasons.push('Touch-only device with small screen');
  }

  // ============ Device Pixel Ratio (High DPI mobile screens) ============
  const devicePixelRatio = window.devicePixelRatio || 1;
  const highDPISmallScreen = devicePixelRatio > 2 && smallScreen;
  if (highDPISmallScreen) reasons.push('High DPI mobile display detected');

  // ============ Emulator Detection ============
  const emulatorSignatures = [
    // Android Emulators
    'sdk', 'emulator', 'android sdk', 'google_sdk', 'droid4x', 'andy',
    'nox', 'bluestacks', 'genymotion', 'memu', 'ldplayer', 'phoenix',
    // iOS Simulators
    'simulator', 'x86_64', 'i386',
    // Generic
    'virtual', 'vm', 'vmware', 'vbox', 'qemu', 'electron'
  ];
  
  const isEmulatorUA = emulatorSignatures.some(sig => ua.includes(sig));
  if (isEmulatorUA) reasons.push('Emulator/simulator signature detected');

  // Check for emulator-specific properties
  const hasEmulatorProperties = (() => {
    try {
      // Check for unusual navigator properties
      const plugins = navigator.plugins?.length || 0;
      const languages = navigator.languages?.length || 0;
      
      // Emulators often have 0 plugins and limited language support
      if (plugins === 0 && languages <= 1 && hasTouch) {
        return true;
      }
      
      // Check for WebGL renderer (emulators often have specific renderers)
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)?.toLowerCase() || '';
          const emulatorRenderers = ['swiftshader', 'llvmpipe', 'softpipe', 'virtualbox', 'vmware'];
          if (emulatorRenderers.some(r => renderer.includes(r))) {
            reasons.push(`Emulator graphics renderer: ${renderer}`);
            return true;
          }
        }
      }
    } catch {
      // Ignore errors
    }
    return false;
  })();

  // ============ Final Determination ============
  const isMobile = isMobileUA || (smallScreen && touchOnlyDevice && !isTabletUA && !isIPadDesktopMode);
  const isTablet = isTabletUA || isIPadDesktopMode;
  const isEmulator = isEmulatorUA || hasEmulatorProperties;

  let deviceType = 'desktop';
  if (isEmulator) deviceType = 'emulator';
  else if (isMobile) deviceType = 'mobile';
  else if (isTablet) deviceType = 'tablet';

  return {
    isMobile,
    isTablet,
    isEmulator,
    deviceType,
    reason: reasons
  };
}

export default function DeviceBlocker() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setMounted(true);
    const info = detectDevice();
    setDeviceInfo(info);
    
    // Staggered animation trigger
    setTimeout(() => setShowContent(true), 100);

    // Re-check on resize (for responsive testing tools)
    const handleResize = () => {
      setDeviceInfo(detectDevice());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Don't render on server or while loading
  if (!mounted || !deviceInfo) return null;

  // Allow desktop users
  const shouldBlock = deviceInfo.isMobile || deviceInfo.isTablet || deviceInfo.isEmulator;
  if (!shouldBlock) return null;

  // Get appropriate content based on device type
  const getDeviceContent = () => {
    if (deviceInfo.isEmulator) {
      return {
        icon: Cpu,
        iconBg: 'bg-heirlock-pink',
        title: 'Virtual Environment Detected',
        subtitle: 'Emulators & VMs are not supported',
        emoji: '🖥️',
        color: 'heirlock-pink'
      };
    }
    if (deviceInfo.isTablet) {
      return {
        icon: Tablet,
        iconBg: 'bg-heirlock-blue',
        title: 'Tablet Detected',
        subtitle: 'Tablets are not supported',
        emoji: '📱',
        color: 'heirlock-blue'
      };
    }
    return {
      icon: Smartphone,
      iconBg: 'bg-heirlock-green',
      title: 'Mobile Device Detected',
      subtitle: 'Mobile phones are not supported',
      emoji: '📱',
      color: 'heirlock-green'
    };
  };

  const content = getDeviceContent();
  const DeviceIcon = content.icon;

  return (
    <div className="fixed inset-0 z-[9999] bg-black overflow-auto">
      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 250, 205, 0.3); }
          50% { box-shadow: 0 0 40px rgba(255, 250, 205, 0.6); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes scan-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.5s ease-out forwards; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
        .animate-gradient { 
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite; 
        }
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        .stagger-5 { animation-delay: 0.5s; }
      `}</style>

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 40px,
            rgba(255,255,255,0.1) 40px,
            rgba(255,255,255,0.1) 41px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 40px,
            rgba(255,255,255,0.1) 40px,
            rgba(255,255,255,0.1) 41px
          )`
        }} />
      </div>

      {/* Scan Line Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-heirlock-yellow/20 to-transparent"
          style={{ animation: 'scan-line 4s linear infinite' }}
        />
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:p-6">
        
        {/* Logo Section */}
        <div className={`mb-6 sm:mb-8 ${showContent ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="flex items-center gap-2 sm:gap-3 animate-pulse-glow rounded-lg p-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-heirlock-yellow border-3 sm:border-4 border-white flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] sm:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] transition-transform hover:scale-110 hover:rotate-12">
              <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
            </div>
            <span className="text-white font-black text-xl sm:text-2xl tracking-tight">T.A.L.A.</span>
          </div>
        </div>

        {/* Main Card */}
        <div className={`w-full max-w-[95%] sm:max-w-md ${showContent ? 'animate-scale-in' : 'opacity-0'}`}>
          {/* Card with brutal design */}
          <div className="bg-white border-3 sm:border-4 border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] sm:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] transform transition-all duration-300 hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px]">
            
            {/* Header Strip */}
            <div className={`bg-black px-4 sm:px-6 py-3 sm:py-4 border-b-3 sm:border-b-4 border-white overflow-hidden relative ${showContent ? 'animate-slide-up stagger-1' : 'opacity-0'}`}>
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black animate-gradient opacity-50" />
              <div className="relative flex items-center justify-center gap-2 sm:gap-3">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-heirlock-yellow animate-bounce-subtle" />
                <span className="text-white font-black text-xs sm:text-sm tracking-widest uppercase">
                  Access Restricted
                </span>
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-heirlock-yellow animate-bounce-subtle" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>

            {/* Content Area */}
            <div className="p-5 sm:p-8 bg-white">
              
              {/* Device Icon */}
              <div className={`flex justify-center mb-5 sm:mb-6 ${showContent ? 'animate-slide-up stagger-2' : 'opacity-0'}`}>
                <div className="relative group">
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 ${content.iconBg} border-3 sm:border-4 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-3 transition-all duration-300 group-hover:rotate-0 group-hover:scale-105 animate-float`}>
                    <DeviceIcon className="w-10 h-10 sm:w-12 sm:h-12 text-black transition-transform group-hover:scale-110" />
                  </div>
                  {/* Decorative X with animation */}
                  <div className="absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-red-500 border-2 sm:border-3 border-black rounded-full flex items-center justify-center shadow-brutal transition-all duration-300 hover:scale-125 hover:bg-red-600 cursor-default animate-bounce-subtle">
                    <span className="text-white font-black text-sm sm:text-lg leading-none">✕</span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className={`text-center mb-5 sm:mb-6 ${showContent ? 'animate-slide-up stagger-3' : 'opacity-0'}`}>
                <h1 className="text-xl sm:text-2xl font-black text-black mb-1 sm:mb-2 tracking-tight">
                  {content.title}
                </h1>
                <p className="text-gray-600 font-bold text-sm sm:text-base">
                  {content.subtitle}
                </p>
              </div>

              {/* Message Box */}
              <div className={`bg-heirlock-yellow border-3 sm:border-4 border-black p-3 sm:p-4 mb-5 sm:mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] ${showContent ? 'animate-slide-up stagger-3' : 'opacity-0'}`}>
                <p className="text-black font-bold text-xs sm:text-sm leading-relaxed text-center">
                  For <span className="underline decoration-2 sm:decoration-4 decoration-black underline-offset-2">security reasons</span>, T.A.L.A. can only be accessed from{' '}
                  <span className="inline-block bg-black text-heirlock-yellow px-1.5 sm:px-2 py-0.5 transition-transform hover:scale-105">desktop computers</span>{' '}
                  and{' '}
                  <span className="inline-block bg-black text-heirlock-yellow px-1.5 sm:px-2 py-0.5 transition-transform hover:scale-105">laptops</span>.
                </p>
              </div>

              {/* Blocked Devices */}
              <div className={`mb-5 sm:mb-6 ${showContent ? 'animate-slide-up stagger-4' : 'opacity-0'}`}>
                <p className="text-[10px] sm:text-xs font-black text-gray-500 uppercase tracking-wider mb-2 sm:mb-3 text-center">
                  Not Supported On
                </p>
                <div className="flex justify-center gap-3 sm:gap-4">
                  {[
                    { icon: Smartphone, label: 'Phones' },
                    { icon: Tablet, label: 'Tablets' },
                    { icon: Cpu, label: 'Emulators' }
                  ].map((item, index) => (
                    <div 
                      key={item.label}
                      className="flex flex-col items-center gap-1 opacity-50 transition-all duration-300 hover:opacity-70 hover:scale-110"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 border-2 border-gray-300 flex items-center justify-center transition-colors hover:bg-gray-200">
                        <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      </div>
                      <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Solution */}
              <div className={`bg-heirlock-green border-3 sm:border-4 border-black p-3 sm:p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] group cursor-default ${showContent ? 'animate-slide-up stagger-5' : 'opacity-0'}`}>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 group-hover:rotate-3">
                    <Laptop className="w-5 h-5 sm:w-6 sm:h-6 text-heirlock-green transition-all group-hover:scale-110" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-black text-xs sm:text-sm">Switch to Desktop</p>
                    <p className="text-[10px] sm:text-xs text-gray-700 font-medium truncate sm:whitespace-normal">
                      Use a computer with Chrome, Firefox, Safari, or Edge
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-black flex-shrink-0 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>

            {/* Footer Strip */}
            <div className={`bg-black px-4 sm:px-6 py-2.5 sm:py-3 border-t-3 sm:border-t-4 border-white ${showContent ? 'animate-fade-in stagger-5' : 'opacity-0'}`}>
              <p className="text-center text-[10px] sm:text-xs font-bold text-gray-400">
                <span className="text-heirlock-yellow">Security First</span>
                <span className="mx-1 sm:mx-2">•</span>
                <span className="hidden xs:inline">Protecting Exam Integrity</span>
                <span className="hidden xs:inline mx-1 sm:mx-2">•</span>
                <span className="text-heirlock-yellow">Trust is Code</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className={`mt-6 sm:mt-8 text-center ${showContent ? 'animate-fade-in stagger-5' : 'opacity-0'}`}>
          <p className="text-gray-500 text-[10px] sm:text-xs font-medium max-w-xs sm:max-w-sm px-4">
            This restriction ensures the highest level of security for sensitive examination content.
          </p>
        </div>

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && deviceInfo.reason.length > 0 && (
          <div className={`mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-900 border-2 border-gray-700 text-[10px] sm:text-xs max-w-xs sm:max-w-md w-full ${showContent ? 'animate-fade-in' : 'opacity-0'}`}>
            <p className="font-bold text-gray-400 mb-2">🔧 Debug Info:</p>
            <ul className="text-gray-500 space-y-1">
              {deviceInfo.reason.map((r, i) => (
                <li key={i}>• {r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
