'use client';

import { useEffect, useRef, useState } from 'react';

export function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastRotationRef = useRef<Map<HTMLElement, number>>(new Map());
  const fakeScrollRef = useRef<number>(0);
  const MAX_ROTATION_SPEED = 2; // degrees per scroll event
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [shouldUseFakeScroll, setShouldUseFakeScroll] = useState(false);

  useEffect(() => {
    // Check if screen is large enough for additional shapes
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    // Check if page is scrollable and set up fake scroll animation if not
    const checkScrollability = () => {
      const isScrollable = document.documentElement.scrollHeight > window.innerHeight;
      setShouldUseFakeScroll(!isScrollable);
    };

    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrollY = shouldUseFakeScroll ? fakeScrollRef.current : window.scrollY;
      const shapes = containerRef.current.querySelectorAll('[data-shape]');

      shapes.forEach((shape) => {
        const element = shape as HTMLElement;
        const depth = parseFloat(element.getAttribute('data-depth') || '1');
        const rotationFactor = parseFloat(element.getAttribute('data-rotation') || '1');

        // Calculate desired rotation
        const desiredRotation = (scrollY * rotationFactor * 0.05) % 360;
        
        // Get last rotation value, default to current desired rotation
        const lastRotation = lastRotationRef.current.get(element) ?? desiredRotation;
        
        // Calculate rotation delta
        let rotationDelta = desiredRotation - lastRotation;
        
        // Handle wrap-around (e.g., 359 to 1)
        if (rotationDelta > 180) {
          rotationDelta -= 360;
        } else if (rotationDelta < -180) {
          rotationDelta += 360;
        }
        
        // Cap the rotation speed
        const cappedDelta = Math.max(Math.min(rotationDelta, MAX_ROTATION_SPEED), -MAX_ROTATION_SPEED);
        const rotation = (lastRotation + cappedDelta) % 360;
        
        // Store the rotation for next frame
        lastRotationRef.current.set(element, rotation);
        
        // Parallax vertical movement - closer shapes move more
        const yMovement = scrollY * depth * 0.15;

        element.style.transform = `translateY(${yMovement}px) rotate(${rotation}deg)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [shouldUseFakeScroll]);

  useEffect(() => {
    if (!shouldUseFakeScroll) return;

    let animationFrameId: number;
    let direction = 1; // 1 for increasing, -1 for decreasing
    const maxFakeScroll = 150; // Maximum fake scroll distance
    const speed = 0.5; // Speed of fake scrolling

    const animateFakeScroll = () => {
      fakeScrollRef.current += direction * speed;

      // Reverse direction when hitting limits
      if (fakeScrollRef.current >= maxFakeScroll) {
        fakeScrollRef.current = maxFakeScroll;
        direction = -1;
      } else if (fakeScrollRef.current <= 0) {
        fakeScrollRef.current = 0;
        direction = 1;
      }

      // Trigger the scroll handler's logic
      const event = new Event('scroll');
      window.dispatchEvent(event);

      animationFrameId = requestAnimationFrame(animateFakeScroll);
    };

    animationFrameId = requestAnimationFrame(animateFakeScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [shouldUseFakeScroll]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: -1 }}
    >
      {/* ===== BACKGROUND LAYER (moves slowest) ===== */}
      
      {/* Soft purple blob - background, top left */}
      <div
        data-shape
        data-depth="0.1"
        data-speed="0.5"
        data-rotation="0.6"
        className="absolute opacity-10"
        style={{
          width: '220px',
          height: '220px',
          borderRadius: '45% 55% 60% 40% / 55% 45% 55% 45%',
          background: '#6c3fc5',
          top: '-100px',
          left: '-100px',
          transition: 'transform 0.4s ease-out',
        }}
      />

      {/* Soft mint blob - background, bottom right */}
      <div
        data-shape
        data-depth="0.08"
        data-speed="0.6"
        data-rotation="0.5"
        className="absolute opacity-8"
        style={{
          width: '240px',
          height: '240px',
          borderRadius: '60% 40% 45% 55% / 40% 60% 50% 50%',
          background: '#6bcb77',
          bottom: '-150px',
          right: '-80px',
          transition: 'transform 0.4s ease-out',
        }}
      />

      {/* Coral blob - background, top center-right */}
      <div
        data-shape
        data-depth="0.12"
        data-speed="0.7"
        data-rotation="0.7"
        className="absolute opacity-9"
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '30% 70% 65% 35% / 35% 50% 50% 65%',
          background: '#ff6b6b',
          top: '5%',
          right: '20%',
          transition: 'transform 0.4s ease-out',
        }}
      />

      {/* Soft yellow swirl - background, center */}
      <div
        data-shape
        data-depth="0.09"
        data-speed="0.65"
        data-rotation="0.6"
        className="absolute opacity-8"
        style={{
          width: '180px',
          height: '180px',
          borderRadius: '60% 40% 45% 55% / 50% 60% 40% 50%',
          background: '#ffe066',
          top: '50%',
          left: '30%',
          transition: 'transform 0.4s ease-out',
        }}
      />

      {/* Light purple swirl - background, bottom left */}
      <div
        data-shape
        data-depth="0.11"
        data-speed="0.62"
        data-rotation="0.58"
        className="absolute opacity-9"
        style={{
          width: '210px',
          height: '210px',
          borderRadius: '65% 35% 50% 50% / 40% 60% 40% 60%',
          background: '#8b65d4',
          bottom: '-120px',
          left: '8%',
          transition: 'transform 0.4s ease-out',
        }}
      />

      {/* ===== MIDGROUND LAYER ===== */}

      {/* Yellow soft blob - midground, center-left */}
      <div
        data-shape
        data-depth="0.35"
        data-speed="0.65"
        data-rotation="0.7"
        className="absolute opacity-10"
        style={{
          width: '220px',
          height: '220px',
          borderRadius: '55% 45% 40% 60% / 50% 55% 45% 50%',
          background: '#ffd93d',
          top: '30%',
          left: '-60px',
          transition: 'transform 0.4s ease-out',
        }}
      />

      {/* Purple pulsing blob - midground, left side */}
      <div
        data-shape
        data-depth="0.38"
        data-speed="0.68"
        data-rotation="0.75"
        className="absolute opacity-9"
        style={{
          width: '210px',
          height: '210px',
          borderRadius: '35% 65% 55% 45% / 45% 50% 50% 55%',
          background: '#9370db',
          top: '50%',
          right: '10%',
          transition: 'transform 0.4s ease-out',
        }}
      />

      {/* ===== FOREGROUND LAYER (moves fastest) ===== */}

      {/* Large coral blob - foreground, top right */}
      <div
        data-shape
        data-depth="1.0"
        data-speed="0.8"
        data-rotation="1"
        className="absolute opacity-11"
        style={{
          width: '320px',
          height: '320px',
          borderRadius: '40% 60% 50% 50% / 60% 40% 60% 40%',
          background: '#ff9a9a',
          top: '15%',
          right: '-100px',
          transition: 'transform 0.4s ease-out',
        }}
      />

      {/* Mint organic blob - foreground, top center */}
      <div
        data-shape
        data-depth="1.1"
        data-speed="0.82"
        data-rotation="1.1"
        className="absolute opacity-10"
        style={{
          width: '300px',
          height: '300px',
          borderRadius: '50% 50% 40% 60% / 55% 50% 50% 45%',
          background: '#a0e4a0',
          top: '-190px',
          left: '12%',
          transition: 'transform 0.4s ease-out',
        }}
      />

      {/* ===== ADDITIONAL SHAPES FOR LARGE SCREENS ===== */}
      {isLargeScreen && (
        <>
          {/* Extra background blob - right side */}
          <div
            data-shape
            data-depth="0.07"
            data-speed="0.55"
            data-rotation="0.55"
            className="absolute opacity-9"
            style={{
              width: '280px',
              height: '280px',
              borderRadius: '50% 50% 45% 55% / 55% 45% 55% 45%',
              background: '#6c3fc5',
              top: '5%',
              right: '25%',
              transition: 'transform 0.4s ease-out',
            }}
          />

          {/* Extra background blob - center bottom */}
          <div
            data-shape
            data-depth="0.09"
            data-speed="0.6"
            data-rotation="0.62"
            className="absolute opacity-8"
            style={{
              width: '240px',
              height: '240px',
              borderRadius: '60% 40% 50% 50% / 40% 60% 45% 55%',
              background: '#ffd93d',
              bottom: '-120px',
              left: '40%',
              transition: 'transform 0.4s ease-out',
            }}
          />

          {/* Extra midground blob - center right */}
          <div
            data-shape
            data-depth="0.36"
            data-speed="0.66"
            data-rotation="0.72"
            className="absolute opacity-10"
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '45% 55% 55% 45% / 50% 50% 50% 50%',
              background: '#ff6b6b',
              top: '65%',
              right: '35%',
              transition: 'transform 0.4s ease-out',
            }}
          />

          {/* Extra foreground blob - right side */}
          <div
            data-shape
            data-depth="0.95"
            data-speed="0.79"
            data-rotation="1.05"
            className="absolute opacity-10"
            style={{
              width: '280px',
              height: '280px',
              borderRadius: '55% 45% 50% 50% / 45% 55% 50% 50%',
              background: '#8b65d4',
              top: '35%',
              left: '8%',
              transition: 'transform 0.4s ease-out',
            }}
          />

          {/* Extra foreground blob - bottom right */}
          <div
            data-shape
            data-depth="1.05"
            data-speed="0.83"
            data-rotation="1.08"
            className="absolute opacity-11"
            style={{
              width: '260px',
              height: '260px',
              borderRadius: '50% 50% 45% 55% / 55% 50% 55% 45%',
              background: '#ffe066',
              bottom: '-110px',
              right: '28%',
              transition: 'transform 0.4s ease-out',
            }}
          />

          {/* Extra background blob - left center */}
          <div
            data-shape
            data-depth="0.1"
            data-speed="0.58"
            data-rotation="0.59"
            className="absolute opacity-9"
            style={{
              width: '220px',
              height: '220px',
              borderRadius: '55% 45% 50% 50% / 50% 50% 45% 55%',
              background: '#ff6b6b',
              top: '65%',
              left: '15%',
              transition: 'transform 0.4s ease-out',
            }}
          />

          {/* Extra midground blob - right center */}
          <div
            data-shape
            data-depth="0.4"
            data-speed="0.71"
            data-rotation="0.77"
            className="absolute opacity-10"
            style={{
              width: '240px',
              height: '240px',
              borderRadius: '40% 60% 60% 40% / 50% 50% 50% 50%',
              background: '#a0e4a0',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              transition: 'transform 0.4s ease-out',
            }}
          />
        </>
      )}
    </div>
  );
}
