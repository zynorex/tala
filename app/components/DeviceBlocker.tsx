'use client';

import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Tablet, Shield, Lock, Cpu, ArrowRight } from 'lucide-react';

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

  useEffect(() => {
    setMounted(true);
    const info = detectDevice();
    setDeviceInfo(info);

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
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 50px,
            rgba(255,255,255,0.03) 50px,
            rgba(255,255,255,0.03) 51px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 50px,
            rgba(255,255,255,0.03) 50px,
            rgba(255,255,255,0.03) 51px
          )`
        }} />
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex flex-col items-center justify-center p-6">
        
        {/* Logo Section */}
        <div className="mb-8 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-heirlock-yellow border-4 border-white flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]">
              <Lock className="w-6 h-6 text-black" />
            </div>
            <span className="text-white font-black text-2xl tracking-tight">T.A.L.A.</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="w-full max-w-md">
          {/* Card with brutal design */}
          <div className={`bg-${content.color} border-4 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] transform transition-all`}>
            
            {/* Header Strip */}
            <div className="bg-black px-6 py-4 border-b-4 border-white">
              <div className="flex items-center justify-center gap-3">
                <Shield className="w-5 h-5 text-heirlock-yellow" />
                <span className="text-white font-black text-sm tracking-widest uppercase">
                  Access Restricted
                </span>
                <Shield className="w-5 h-5 text-heirlock-yellow" />
              </div>
            </div>

            {/* Content Area */}
            <div className="p-8 bg-white">
              
              {/* Device Icon */}
              <div className="flex justify-center mb-6">
                <div className={`relative`}>
                  <div className={`w-24 h-24 ${content.iconBg} border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-3 hover:rotate-0 transition-transform`}>
                    <DeviceIcon className="w-12 h-12 text-black" />
                  </div>
                  {/* Decorative X */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 border-3 border-black rounded-full flex items-center justify-center shadow-brutal">
                    <span className="text-white font-black text-lg">✕</span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-black text-black mb-2 tracking-tight">
                  {content.title}
                </h1>
                <p className="text-gray-600 font-bold">
                  {content.subtitle}
                </p>
              </div>

              {/* Message Box */}
              <div className="bg-heirlock-yellow border-4 border-black p-4 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-black font-bold text-sm leading-relaxed text-center">
                  For <span className="underline decoration-4 decoration-black">security reasons</span>, T.A.L.A. can only be accessed from <span className="bg-black text-heirlock-yellow px-2 py-0.5">desktop computers</span> and <span className="bg-black text-heirlock-yellow px-2 py-0.5">laptops</span>.
                </p>
              </div>

              {/* Blocked Devices */}
              <div className="mb-6">
                <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3 text-center">
                  Not Supported On
                </p>
                <div className="flex justify-center gap-4">
                  <div className="flex flex-col items-center gap-1 opacity-50">
                    <div className="w-10 h-10 bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-gray-400" />
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold">Phones</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 opacity-50">
                    <div className="w-10 h-10 bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
                      <Tablet className="w-5 h-5 text-gray-400" />
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold">Tablets</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 opacity-50">
                    <div className="w-10 h-10 bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
                      <Cpu className="w-5 h-5 text-gray-400" />
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold">Emulators</span>
                  </div>
                </div>
              </div>

              {/* Solution */}
              <div className="bg-heirlock-green border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-black flex items-center justify-center flex-shrink-0">
                    <Monitor className="w-6 h-6 text-heirlock-green" />
                  </div>
                  <div>
                    <p className="font-black text-black text-sm">Switch to Desktop</p>
                    <p className="text-xs text-gray-700 font-medium">
                      Use a computer with Chrome, Firefox, Safari, or Edge
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-black flex-shrink-0" />
                </div>
              </div>
            </div>

            {/* Footer Strip */}
            <div className="bg-black px-6 py-3 border-t-4 border-white">
              <p className="text-center text-xs font-bold text-gray-400">
                <span className="text-heirlock-yellow">Security First</span> • Protecting Exam Integrity • <span className="text-heirlock-yellow">Trust is Code</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs font-medium max-w-sm">
            This restriction ensures the highest level of security for sensitive examination content.
          </p>
        </div>

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && deviceInfo.reason.length > 0 && (
          <div className="mt-6 p-4 bg-gray-900 border-2 border-gray-700 text-xs max-w-md w-full">
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
