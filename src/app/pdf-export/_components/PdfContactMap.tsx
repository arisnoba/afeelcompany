'use client'

import { useEffect, useRef } from 'react'

// Same white-toned styles as ContactMap
const MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#f5f3ef' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#7b776f' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f3ef' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#ded9d2' }] },
  { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
  { featureType: 'landscape.man_made', elementType: 'geometry.fill', stylers: [{ color: '#eeebe5' }] },
  { featureType: 'landscape.natural', elementType: 'geometry.fill', stylers: [{ color: '#f8f6f2' }] },
  { featureType: 'poi', elementType: 'geometry.fill', stylers: [{ color: '#ece7e0' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#8c867d' }] },
  { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#f1eee7' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#e4dfd8' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#8a857d' }] },
  { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: '#fdfcfa' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#ddd7cf' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#f3f1ec' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9a958d' }] },
]

const SCRIPT_ID = 'google-maps-javascript-api'
let scriptPromise: Promise<void> | null = null

function loadScript(apiKey: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject()
  if (window.google?.maps) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(), { once: true })
      return
    }
    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject()
    document.head.appendChild(script)
  })

  return scriptPromise
}

interface PdfContactMapProps {
  address: string
  apiKey: string | undefined
}

export function PdfContactMap({ address, apiKey }: PdfContactMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!address || !apiKey || !mapRef.current) return

    let cancelled = false

    loadScript(apiKey)
      .then(() => {
        const maps = window.google?.maps
        const el = mapRef.current
        if (cancelled || !el || !maps) return

        const geocoder = new maps.Geocoder()
        geocoder.geocode({ address }, (results: any, status: string) => {
          if (cancelled) return
          const location = results?.[0]?.geometry?.location
          if (status !== 'OK' || !location) return

          const map = new maps.Map(el, {
            center: location,
            zoom: 16,
            backgroundColor: '#f5f3ef',
            disableDefaultUI: true,
            zoomControl: false,
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            styles: MAP_STYLES,
          })

          new maps.Marker({
            map,
            position: location,
            title: address,
            icon: {
              path: maps.SymbolPath.CIRCLE,
              scale: 9,
              fillColor: '#171717',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3,
            },
          })
        })
      })
      .catch(() => {})

    return () => { cancelled = true }
  }, [address, apiKey])

  return (
    <div ref={mapRef} className="absolute inset-0 h-full w-full bg-[#f5f3ef]" />
  )
}
