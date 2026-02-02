'use client';

import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Tablet, AlertTriangle, Shield, Lock } from 'lucide-react';

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

  // Get appropriate icon and message based on device type
  const getDeviceContent = () => {
    if (deviceInfo.isEmulator) {
      return {
        icon: <Monitor className="w-16 h-16 text-red-500" />,
        title: 'Emulator Detected',
        subtitle: 'Virtual environments are not supported',
        description: 'For security reasons, T.A.L.A. cannot be accessed from emulators, simulators, or virtual machines. This helps protect sensitive exam content from unauthorized access.',
        devices: ['Android Emulators (BlueStacks, Nox, etc.)', 'iOS Simulators', 'Virtual Machines', 'Browser DevTools Device Mode']
      };
    }
    if (deviceInfo.isTablet) {
      return {
        icon: <Tablet className="w-16 h-16 text-amber-500" />,
        title: 'Tablet Detected',
        subtitle: 'Tablets are not supported',
        description: 'T.A.L.A. requires a desktop or laptop computer for secure access. Tablets do not meet our security requirements for handling sensitive exam materials.',
        devices: ['iPad', 'Android Tablets', 'Surface Tablets', 'Amazon Fire Tablets']
      };
    }
    return {
      icon: <Smartphone className="w-16 h-16 text-amber-500" />,
      title: 'Mobile Device Detected',
      subtitle: 'Mobile phones are not supported',
      description: 'T.A.L.A. is designed exclusively for desktop and laptop computers. Mobile devices cannot provide the security measures required for exam content protection.',
      devices: ['iPhones', 'Android Phones', 'Windows Phones', 'Other Mobile Devices']
    };
  };

  const content = getDeviceContent();

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center p-4 overflow-auto">
      <div className="max-w-lg w-full">
        {/* Main Card */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 border-b-4 border-black">
            <div className="flex items-center justify-center gap-4">
              <Shield className="w-10 h-10 text-white" />
              <h1 className="text-2xl font-black text-white tracking-tight">
                ACCESS BLOCKED
              </h1>
              <Lock className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Device Icon & Title */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gray-100 rounded-full border-4 border-black">
                  {content.icon}
                </div>
              </div>
              <h2 className="text-2xl font-black text-black mb-2">
                {content.title}
              </h2>
              <p className="text-gray-600 font-bold">
                {content.subtitle}
              </p>
            </div>

            {/* Warning Box */}
            <div className="bg-amber-50 border-4 border-amber-400 p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-gray-800 leading-relaxed">
                  {content.description}
                </p>
              </div>
            </div>

            {/* Blocked Devices List */}
            <div className="mb-6">
              <h3 className="font-black text-black mb-3 text-sm uppercase tracking-wide">
                Blocked Devices Include:
              </h3>
              <ul className="space-y-2">
                {content.devices.map((device, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                    {device}
                  </li>
                ))}
              </ul>
            </div>

            {/* Solution Box */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-4 border-green-500 p-4 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Monitor className="w-6 h-6 text-green-600" />
                <h3 className="font-black text-green-800">How to Access T.A.L.A.</h3>
              </div>
              <p className="text-sm text-green-700 font-medium">
                Please use a <strong>desktop computer</strong> or <strong>laptop</strong> with a modern web browser (Chrome, Firefox, Safari, or Edge) to access this platform.
              </p>
            </div>

            {/* Footer Info */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 font-bold text-sm">
                <Shield className="w-4 h-4" />
                Security First • Trust is Code
              </div>
            </div>

            {/* Debug Info (only in development) */}
            {process.env.NODE_ENV === 'development' && deviceInfo.reason.length > 0 && (
              <div className="mt-6 p-3 bg-gray-100 border-2 border-gray-300 text-xs">
                <p className="font-bold text-gray-600 mb-2">Debug Info:</p>
                <ul className="text-gray-500 space-y-1">
                  {deviceInfo.reason.map((r, i) => (
                    <li key={i}>• {r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Message */}
        <p className="text-center text-gray-400 text-xs mt-4 font-medium">
          This restriction helps us maintain the highest security standards for exam content protection.
        </p>
      </div>
    </div>
  );
}
