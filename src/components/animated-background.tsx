'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shapeElementsRef = useRef<HTMLElement[]>([]);
  const lastRotationRef = useRef<Map<HTMLElement, number>>(new Map());
  const repelOffsetRef = useRef<Map<HTMLElement, { x: number; y: number }>>(new Map());
  const fakeScrollRef = useRef<number>(0);
  const mousePositionRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });
  const frameRef = useRef<number | null>(null);
  const MAX_ROTATION_SPEED = 2; // degrees per scroll event
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [shouldUseFakeScroll, setShouldUseFakeScroll] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [enablePointerEffects, setEnablePointerEffects] = useState(false);
  const [enableTouchDragEffects, setEnableTouchDragEffects] = useState(false);

  const updateShapes = useCallback(() => {
    const shapes = shapeElementsRef.current;
    if (!shapes.length) return;

    const scrollY = prefersReducedMotion
      ? 0
      : shouldUseFakeScroll
        ? fakeScrollRef.current
        : window.scrollY;
    const mouse = mousePositionRef.current;

    shapes.forEach((shape) => {
      const element = shape;
      const depth = parseFloat(element.getAttribute('data-depth') || '1');
      const rotationFactor = parseFloat(element.getAttribute('data-rotation') || '1');

      // Calculate desired rotation
      const desiredRotation = prefersReducedMotion
        ? 0
        : (scrollY * rotationFactor * 0.05) % 360;

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
      const yMovement = prefersReducedMotion ? 0 : scrollY * depth * 0.15;

      let targetRepelX = 0;
      let targetRepelY = 0;

      if ((enablePointerEffects || enableTouchDragEffects) && mouse.active) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const awayX = centerX - mouse.x;
        const awayY = centerY - mouse.y;
        const distance = Math.hypot(awayX, awayY);
        const influenceRadius = 360;

        if (distance > 0 && distance < influenceRadius) {
          const safeDistance = Math.max(distance, 24);
          const influence = 1 - distance / influenceRadius;
          const easedInfluence = influence * influence * (3 - 2 * influence);
          const strength = (26 + depth * 24) * easedInfluence;
          targetRepelX = (awayX / safeDistance) * strength;
          targetRepelY = (awayY / safeDistance) * strength;
        }
      }

      const currentOffset = repelOffsetRef.current.get(element) ?? { x: 0, y: 0 };
      const smoothing = 0.18;
      const repelX = currentOffset.x + (targetRepelX - currentOffset.x) * smoothing;
      const repelY = currentOffset.y + (targetRepelY - currentOffset.y) * smoothing;

      repelOffsetRef.current.set(element, {
        x: Math.abs(repelX) < 0.05 ? 0 : repelX,
        y: Math.abs(repelY) < 0.05 ? 0 : repelY,
      });

      element.style.transform = `translate3d(${repelX}px, ${yMovement + repelY}px, 0) rotate(${rotation}deg)`;
    });
  }, [enablePointerEffects, enableTouchDragEffects, prefersReducedMotion, shouldUseFakeScroll]);

  const scheduleUpdate = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      updateShapes();
    });
  }, [updateShapes]);

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
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const coarsePointerQuery = window.matchMedia('(pointer: coarse)');

    const updateMotionSettings = () => {
      setPrefersReducedMotion(reducedMotionQuery.matches);
      setEnablePointerEffects(pointerQuery.matches && !reducedMotionQuery.matches);
      setEnableTouchDragEffects(coarsePointerQuery.matches && !reducedMotionQuery.matches);
    };

    updateMotionSettings();
    reducedMotionQuery.addEventListener('change', updateMotionSettings);
    pointerQuery.addEventListener('change', updateMotionSettings);
    coarsePointerQuery.addEventListener('change', updateMotionSettings);

    return () => {
      reducedMotionQuery.removeEventListener('change', updateMotionSettings);
      pointerQuery.removeEventListener('change', updateMotionSettings);
      coarsePointerQuery.removeEventListener('change', updateMotionSettings);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const shapes = Array.from(containerRef.current.querySelectorAll('[data-shape]')) as HTMLElement[];
    shapes.forEach((shape) => {
      shape.style.willChange = 'transform';
    });
    shapeElementsRef.current = shapes;
    scheduleUpdate();

    return () => {
      shapeElementsRef.current = [];
    };
  }, [isLargeScreen, scheduleUpdate]);

  useEffect(() => {
    const handleScroll = () => scheduleUpdate();

    window.addEventListener('scroll', handleScroll, { passive: true });
    scheduleUpdate();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [scheduleUpdate]);

  useEffect(() => {
    if (!enablePointerEffects) {
      mousePositionRef.current.active = false;
      scheduleUpdate();
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      mousePositionRef.current = {
        x: event.clientX,
        y: event.clientY,
        active: true,
      };
      scheduleUpdate();
    };

    const handlePointerLeave = () => {
      mousePositionRef.current.active = false;
      scheduleUpdate();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [enablePointerEffects, scheduleUpdate]);

  useEffect(() => {
    if (!enableTouchDragEffects) {
      mousePositionRef.current.active = false;
      scheduleUpdate();
      return;
    }

    let activePointerId: number | null = null;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'touch') return;

      activePointerId = event.pointerId;
      mousePositionRef.current = {
        x: event.clientX,
        y: event.clientY,
        active: true,
      };
      scheduleUpdate();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'touch' || event.pointerId !== activePointerId) return;

      mousePositionRef.current = {
        x: event.clientX,
        y: event.clientY,
        active: true,
      };
      scheduleUpdate();
    };

    const handlePointerEnd = (event: PointerEvent) => {
      if (event.pointerType !== 'touch' || event.pointerId !== activePointerId) return;

      activePointerId = null;
      mousePositionRef.current.active = false;
      scheduleUpdate();
    };

    const updateFromTouch = (touch: Touch) => {
      mousePositionRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        active: true,
      };
      scheduleUpdate();
    };

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      updateFromTouch(touch);
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      updateFromTouch(touch);
    };

    const handleTouchEnd = () => {
      activePointerId = null;
      mousePositionRef.current.active = false;
      scheduleUpdate();
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerEnd, { passive: true });
    window.addEventListener('pointercancel', handlePointerEnd, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerEnd);
      window.removeEventListener('pointercancel', handlePointerEnd);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [enableTouchDragEffects, scheduleUpdate]);

  useEffect(() => {
    if (!shouldUseFakeScroll || prefersReducedMotion) return;

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
      scheduleUpdate();

      animationFrameId = requestAnimationFrame(animateFakeScroll);
    };

    animationFrameId = requestAnimationFrame(animateFakeScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [prefersReducedMotion, scheduleUpdate, shouldUseFakeScroll]);

  return (
    <div
      ref={containerRef}
      className="animated-blobs fixed inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
      style={{ zIndex: 0 }}
    >
      {/* ===== BACKGROUND LAYER (smaller + farther back) ===== */}

      <div
        data-shape
        data-depth="0.04"
        data-speed="0.45"
        data-rotation="0.42"
        className="absolute opacity-8 hidden sm:block"
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '45% 55% 60% 40% / 55% 45% 55% 45%',
          background: '#6c3fc5',
          top: '-50px',
          left: '-40px',
          transition: 'transform 0.4s ease-out',
        }}
      />
      <div
        data-shape
        data-depth="0.05"
        data-speed="0.48"
        data-rotation="0.44"
        className="absolute opacity-7"
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '60% 40% 45% 55% / 40% 60% 50% 50%',
          background: '#6bcb77',
          top: isLargeScreen ? '12%' : '18%',
          left: isLargeScreen ? '18%' : undefined,
          right: isLargeScreen ? undefined : '12%',
          transition: 'transform 0.4s ease-out',
        }}
      />
      <div
        data-shape
        data-depth="0.05"
        data-speed="0.5"
        data-rotation="0.46"
        className="absolute opacity-7 hidden sm:block"
        style={{
          width: '110px',
          height: '110px',
          borderRadius: '30% 70% 65% 35% / 35% 50% 50% 65%',
          background: '#ff6b6b',
          top: '7%',
          right: '14%',
          transition: 'transform 0.4s ease-out',
        }}
      />
      <div
        data-shape
        data-depth="0.03"
        data-speed="0.43"
        data-rotation="0.4"
        className="absolute opacity-7"
        style={{
          width: '88px',
          height: '88px',
          borderRadius: '60% 40% 45% 55% / 50% 60% 40% 50%',
          background: '#ff6b6b',
          top: isLargeScreen ? '32%' : '30%',
          left: isLargeScreen ? '6%' : '8%',
          transition: 'transform 0.4s ease-out',
        }}
      />
      <div
        data-shape
        data-depth="0.04"
        data-speed="0.47"
        data-rotation="0.43"
        className="absolute opacity-8"
        style={{
          width: '130px',
          height: '130px',
          borderRadius: '65% 35% 50% 50% / 40% 60% 40% 60%',
          background: isLargeScreen ? '#8b65d4' : '#8b65d4',
          top: isLargeScreen ? '40%' : '22%',
          right: isLargeScreen ? '2%' : '2%',
          transition: 'transform 0.4s ease-out',
        }}
      />
      <div
        data-shape
        data-depth="0.06"
        data-speed="0.5"
        data-rotation="0.47"
        className="absolute opacity-8"
        style={{
          width: '112px',
          height: '112px',
          borderRadius: '55% 45% 40% 60% / 50% 55% 45% 50%',
          background: '#ffd93d',
          top: isLargeScreen ? '52%' : '58%',
          left: isLargeScreen ? '34%' : '16%',
          transition: 'transform 0.4s ease-out',
        }}
      />
      <div
        data-shape
        data-depth="0.04"
        data-speed="0.46"
        data-rotation="0.41"
        className="absolute opacity-8"
        style={{
          width: '94px',
          height: '94px',
          borderRadius: '35% 65% 55% 45% / 45% 50% 50% 55%',
          background: isLargeScreen ? '#9370db' : '#6bcb77',
          top: isLargeScreen ? '79%' : '74%',
          right: isLargeScreen ? '28%' : '14%',
          transition: 'transform 0.4s ease-out',
        }}
      />
      <div
        data-shape
        data-depth="0.05"
        data-speed="0.49"
        data-rotation="0.45"
        className="absolute opacity-7"
        style={{
          width: '116px',
          height: '116px',
          borderRadius: '50% 50% 40% 60% / 55% 50% 50% 45%',
          background: '#a0e4a0',
          top: isLargeScreen ? undefined : '56%',
          bottom: isLargeScreen ? '14%' : undefined,
          left: isLargeScreen ? '11%' : '-18px',
          transition: 'transform 0.4s ease-out',
        }}
      />
      <div
        data-shape
        data-depth="0.06"
        data-speed="0.5"
        data-rotation="0.48"
        className="absolute opacity-8 hidden sm:block"
        style={{
          width: '125px',
          height: '125px',
          borderRadius: '52% 48% 56% 44% / 40% 57% 43% 60%',
          background: '#ff9a9a',
          bottom: '8%',
          right: '12%',
          transition: 'transform 0.4s ease-out',
        }}
      />
      <div
        data-shape
        data-depth="0.05"
        data-speed="0.46"
        data-rotation="0.44"
        className="absolute opacity-8"
        style={{
          width: '104px',
          height: '104px',
          borderRadius: '48% 52% 46% 54% / 58% 42% 56% 44%',
          background: isLargeScreen ? '#6c3fc5' : '#ff6b6b',
          top: isLargeScreen ? undefined : '2%',
          bottom: isLargeScreen ? '-30px' : undefined,
          left: isLargeScreen ? '45%' : '52%',
          transition: 'transform 0.4s ease-out',
        }}
      />

      {/* ===== MIDGROUND LAYER ===== */}

      <div
        data-shape
        data-depth="0.28"
        data-speed="0.62"
        data-rotation="0.66"
        className="absolute opacity-10"
        style={{
          width: '190px',
          height: '190px',
          borderRadius: '55% 45% 40% 60% / 50% 55% 45% 50%',
          background: isLargeScreen ? '#ffd93d' : '#8b65d4',
          top: isLargeScreen ? '23%' : '18%',
          left: isLargeScreen ? '-55px' : '-74px',
          transition: 'transform 0.4s ease-out',
        }}
      />
      <div
        data-shape
        data-depth="0.32"
        data-speed="0.66"
        data-rotation="0.71"
        className="absolute opacity-9"
        style={{
          width: '196px',
          height: '196px',
          borderRadius: '35% 65% 55% 45% / 45% 50% 50% 55%',
          background: isLargeScreen ? '#9370db' : '#8b65d4',
          top: isLargeScreen ? '52%' : '68%',
          right: isLargeScreen ? '8%' : '-42px',
          transition: 'transform 0.4s ease-out',
        }}
      />
      <div
        data-shape
        data-depth="0.3"
        data-speed="0.64"
        data-rotation="0.69"
        className="absolute opacity-9"
        style={{
          width: '180px',
          height: '180px',
          borderRadius: '40% 60% 60% 40% / 50% 50% 50% 50%',
          background: '#a0e4a0',
          top: isLargeScreen ? '66%' : '48%',
          left: isLargeScreen ? '37%' : '42%',
          transition: 'transform 0.4s ease-out',
        }}
      />

      {/* ===== FOREGROUND LAYER (mobile + desktop base) ===== */}

      <div
        data-shape
        data-depth="1.0"
        data-speed="0.8"
        data-rotation="1"
        className="absolute opacity-11"
        style={{
          width: isLargeScreen ? '310px' : '268px',
          height: isLargeScreen ? '310px' : '268px',
          borderRadius: '40% 60% 50% 50% / 60% 40% 60% 40%',
          background: '#ff9a9a',
          top: isLargeScreen ? '14%' : undefined,
          right: isLargeScreen ? '-92px' : undefined,
          bottom: isLargeScreen ? undefined : '-126px',
          left: isLargeScreen ? undefined : '-102px',
          transition: 'transform 0.4s ease-out',
        }}
      />
      <div
        data-shape
        data-depth="1.1"
        data-speed="0.82"
        data-rotation="1.1"
        className="absolute opacity-10"
        style={{
          width: isLargeScreen ? '285px' : '238px',
          height: isLargeScreen ? '285px' : '238px',
          borderRadius: '50% 50% 40% 60% / 55% 50% 50% 45%',
          background: '#a0e4a0',
          top: isLargeScreen ? '-170px' : '-138px',
          left: isLargeScreen ? '11%' : '-28px',
          transition: 'transform 0.4s ease-out',
        }}
      />
      <div
        data-shape
        data-depth="1.02"
        data-speed="0.8"
        data-rotation="1.03"
        className="absolute opacity-10 hidden sm:block"
        style={{
          width: '236px',
          height: '236px',
          borderRadius: '58% 42% 46% 54% / 46% 58% 42% 54%',
          background: '#8b65d4',
          bottom: '-96px',
          left: '-52px',
          transition: 'transform 0.4s ease-out',
        }}
      />
      <div
        data-shape
        data-depth="0.98"
        data-speed="0.79"
        data-rotation="1.01"
        className="absolute opacity-10 hidden sm:block"
        style={{
          width: '228px',
          height: '228px',
          borderRadius: '43% 57% 52% 48% / 55% 45% 58% 42%',
          background: '#ffe066',
          bottom: '-88px',
          right: '6%',
          transition: 'transform 0.4s ease-out',
        }}
      />
      <div
        data-shape
        data-depth="1.06"
        data-speed="0.84"
        data-rotation="1.12"
        className="absolute opacity-10 sm:hidden"
        style={{
          width: '176px',
          height: '176px',
          borderRadius: '46% 54% 48% 52% / 58% 42% 53% 47%',
          background: '#ffd93d',
          top: '34%',
          left: undefined,
          right: '-64px',
          transition: 'transform 0.4s ease-out',
        }}
      />
      <div
        data-shape
        data-depth="1.06"
        data-speed="0.84"
        data-rotation="1.12"
        className="hidden lg:block absolute opacity-10"
        style={{
          width: '300px',
          height: '300px',
          borderRadius: '46% 54% 48% 52% / 58% 42% 53% 47%',
          background: '#ff6b6b',
          top: '-165px',
          left: '48%',
          transition: 'transform 0.4s ease-out',
        }}
      />

      {/* ===== ADDITIONAL SHAPES FOR LARGE SCREENS ===== */}
      {isLargeScreen && (
        <>
          {/* Extra small background blobs for desktop spread */}
          <div
            data-shape
            data-depth="0.04"
            data-speed="0.45"
            data-rotation="0.42"
            className="absolute opacity-7"
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '50% 50% 45% 55% / 55% 45% 55% 45%',
              background: '#ffd93d',
              top: '4%',
              right: '37%',
              transition: 'transform 0.4s ease-out',
            }}
          />
          <div
            data-shape
            data-depth="0.05"
            data-speed="0.47"
            data-rotation="0.46"
            className="absolute opacity-7"
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '55% 45% 50% 50% / 50% 50% 45% 55%',
              background: '#6bcb77',
              top: '38%',
              left: '38%',
              transition: 'transform 0.4s ease-out',
            }}
          />
          <div
            data-shape
            data-depth="0.04"
            data-speed="0.46"
            data-rotation="0.43"
            className="absolute opacity-7"
            style={{
              width: '98px',
              height: '98px',
              borderRadius: '52% 48% 60% 40% / 45% 55% 45% 55%',
              background: '#ffd93d',
              bottom: '18%',
              right: '34%',
              transition: 'transform 0.4s ease-out',
            }}
          />

          {/* 6 extra foreground blobs on desktop */}
          <div
            data-shape
            data-depth="0.95"
            data-speed="0.79"
            data-rotation="1.05"
            className="absolute opacity-10"
            style={{
              width: '250px',
              height: '250px',
              borderRadius: '55% 45% 50% 50% / 45% 55% 50% 50%',
              background: '#8b65d4',
              top: '33%',
              left: '4%',
              transition: 'transform 0.4s ease-out',
            }}
          />
          <div
            data-shape
            data-depth="1.05"
            data-speed="0.83"
            data-rotation="1.08"
            className="absolute opacity-11"
            style={{
              width: '236px',
              height: '236px',
              borderRadius: '50% 50% 45% 55% / 55% 50% 55% 45%',
              background: '#ffe066',
              bottom: '-96px',
              right: '27%',
              transition: 'transform 0.4s ease-out',
            }}
          />
          <div
            data-shape
            data-depth="1.07"
            data-speed="0.84"
            data-rotation="1.1"
            className="absolute opacity-10"
            style={{
              width: '230px',
              height: '230px',
              borderRadius: '47% 53% 43% 57% / 56% 44% 54% 46%',
              background: '#ff6b6b',
              top: '-170px',
              right: '-72px',
              transition: 'transform 0.4s ease-out',
            }}
          />
          <div
            data-shape
            data-depth="1.0"
            data-speed="0.8"
            data-rotation="1.04"
            className="absolute opacity-10"
            style={{
              width: '220px',
              height: '220px',
              borderRadius: '54% 46% 49% 51% / 58% 42% 55% 45%',
              background: '#ff6b6b',
              top: '58%',
              left: '20%',
              transition: 'transform 0.4s ease-out',
            }}
          />
          <div
            data-shape
            data-depth="1.04"
            data-speed="0.82"
            data-rotation="1.07"
            className="absolute opacity-10"
            style={{
              width: '228px',
              height: '228px',
              borderRadius: '58% 42% 50% 50% / 46% 54% 44% 56%',
              background: '#6bcb77',
              top: '60%',
              right: '4%',
              transition: 'transform 0.4s ease-out',
            }}
          />
          <div
            data-shape
            data-depth="0.97"
            data-speed="0.79"
            data-rotation="1.01"
            className="absolute opacity-10"
            style={{
              width: '214px',
              height: '214px',
              borderRadius: '53% 47% 45% 55% / 61% 39% 52% 48%',
              background: '#ff6b6b',
              top: '40%',
              left: '58%',
              transition: 'transform 0.4s ease-out',
            }}
          />
          <div
            data-shape
            data-depth="1.06"
            data-speed="0.83"
            data-rotation="1.09"
            className="absolute opacity-10"
            style={{
              width: '212px',
              height: '212px',
              borderRadius: '49% 51% 57% 43% / 43% 57% 47% 53%',
              background: '#9370db',
              top: '34%',
              left: '22%',
              transition: 'transform 0.4s ease-out',
            }}
          />
          <div
            data-shape
            data-depth="0.96"
            data-speed="0.78"
            data-rotation="1.0"
            className="absolute opacity-10"
            style={{
              width: '205px',
              height: '205px',
              borderRadius: '56% 44% 48% 52% / 50% 50% 42% 58%',
              background: '#ffd93d',
              top: '56%',
              left: '72%',
              transition: 'transform 0.4s ease-out',
            }}
          />
          <div
            data-shape
            data-depth="1.03"
            data-speed="0.81"
            data-rotation="1.05"
            className="absolute opacity-10"
            style={{
              width: '222px',
              height: '222px',
              borderRadius: '42% 58% 53% 47% / 57% 43% 54% 46%',
              background: '#ffd93d',
              bottom: '-4%',
              right: '52%',
              transition: 'transform 0.4s ease-out',
            }}
          />
          <div
            data-shape
            data-depth="0.98"
            data-speed="0.79"
            data-rotation="1.02"
            className="absolute opacity-10"
            style={{
              width: '208px',
              height: '208px',
              borderRadius: '55% 45% 60% 40% / 48% 52% 45% 55%',
              background: '#8b65d4',
              top: '60%',
              left: '50%',
              transition: 'transform 0.4s ease-out',
            }}
          />
          <div
            data-shape
            data-depth="1.08"
            data-speed="0.84"
            data-rotation="1.11"
            className="absolute opacity-10"
            style={{
              width: '216px',
              height: '216px',
              borderRadius: '46% 54% 50% 50% / 60% 40% 51% 49%',
              background: '#6bcb77',
              top: '26%',
              right: '18%',
              transition: 'transform 0.4s ease-out',
            }}
          />
        </>
      )}

    </div>
  );
}
