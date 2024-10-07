'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const bannerImages = [
  {
    src: '/placeholder.svg?height=600&width=1600',
    alt: 'Summer Sale Banner',
    title: 'Summer Sale',
    subtitle: 'Up to 50% off on selected items',
  },
  {
    src: '/placeholder.svg?height=600&width=1600',
    alt: 'New Arrivals Banner',
    title: 'New Arrivals',
    subtitle: 'Check out our latest collection',
  },
  {
    src: '/placeholder.svg?height=600&width=1600',
    alt: 'Free Shipping Banner',
    title: 'Free Shipping',
    subtitle: 'On orders over PKR 2000',
  },
]

const useSwipe = (onSwipeLeft, onSwipeRight) => {
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(0)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX)

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe) {
      onSwipeLeft()
    } else if (isRightSwipe) {
      onSwipeRight()
    }
  }

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  }
}

export default function BannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const timeoutRef = useRef(null)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length)
  }

  const swipeHandlers = useSwipe(nextSlide, prevSlide)

  useEffect(() => {
    const resetTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }

    resetTimeout()
    timeoutRef.current = setTimeout(nextSlide, 5000)

    return () => {
      resetTimeout()
    }
  }, [currentSlide])

  return (
    <div className="relative overflow-hidden" {...swipeHandlers}>
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {bannerImages.map((banner, index) => (
          <div key={index} className="relative h-[300px] w-full flex-shrink-0 sm:h-[400px] md:h-[500px] lg:h-[600px]">
            <Image src={banner.src} alt={banner.alt} fill style={{ objectFit: 'cover' }} priority={index === 0} />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 p-4 text-center text-white">
              <h2 className="mb-2 text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">{banner.title}</h2>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl">{banner.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white/80 p-2 text-gray-800 shadow-md transition-all hover:bg-white"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white/80 p-2 text-gray-800 shadow-md transition-all hover:bg-white"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 w-3 rounded-full ${
              currentSlide === index ? 'bg-white' : 'bg-white/50'
            } transition-all duration-300`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}