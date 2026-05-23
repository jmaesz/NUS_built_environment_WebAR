import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

const buildings = [
  { name: 'SDE4', desc: "Singapore's first new-build net-zero energy building; features 1,200+ rooftop solar panels, a hybrid cooling system, and over 50% naturally ventilated space. Generates more energy than it consumes." },
  { name: 'SDE4', desc: "Singapore's first new-build net-zero energy building; features 1,200+ rooftop solar panels, a hybrid cooling system, and over 50% naturally ventilated space. Generates more energy than it consumes." },
  { name: 'Yusof Ishak House', desc: 'Heritage retrofit targeting net-zero energy; retains the original 1970s structure to keep embodied carbon to under a third of a new build, with a hybrid cooling system and a naturally ventilated atrium "lung."' },
  { name: 'E7', desc: 'Built to the highest green building standards; vertical sun-shading fins around the façade and strategically placed courtyards and green pockets reduce heat gain.' },
  { name: 'The Frontier', desc: "The first development in Singapore to demonstrate exemplary performance in climate resilience under the Green Mark 2021 scheme; largely naturally ventilated and integrated with surrounding greenery, and one of NUS' three Green Mark Platinum Zero Energy Buildings." },
  { name: 'Ventus', desc: 'Green Mark Platinum certified with a passive wind scoop for natural ventilation and an award-winning green wall; achieved an EUI of just 49 kWh/m², versus the office average of 219.' },
  { name: 'E2A', desc: "One of NUS' three Zero Energy Buildings; maximises natural ventilation and daylight through passive design, sun-shading devices, extensive greenery, and low-VOC materials." },
]

const sequence = [0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6]

export default function Home() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  const trackRef = useRef(null)
  const posRef = useRef(0)
  const rafRef = useRef(null)
  const halfRef = useRef(0)
  const isDragging = useRef(false)
  const lastX = useRef(null)
  const didDrag = useRef(false)

  useEffect(() => {
    if (!trackRef.current) return
    const observer = new ResizeObserver(() => {
      halfRef.current = trackRef.current.scrollWidth / 2
    })
    observer.observe(trackRef.current)
    return () => observer.disconnect()
  }, [])

  const tick = useCallback(() => {
    if (!isDragging.current) {
      posRef.current -= 0.4
      const half = halfRef.current
      if (half > 0 && posRef.current <= -half) posRef.current = 0
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${posRef.current}px)`
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [tick])

  const getX = (e) => e.touches?.[0]?.clientX ?? e.clientX

  const handlePointerDown = (e) => {
    isDragging.current = true
    didDrag.current = false
    lastX.current = getX(e)
  }

  const handlePointerMove = (e) => {
    if (!isDragging.current) return
    const x = getX(e)
    const delta = x - lastX.current
    lastX.current = x

    if (Math.abs(delta) > 2) didDrag.current = true

    posRef.current += delta
    const half = halfRef.current
    if (half > 0) {
      if (posRef.current > 0) posRef.current -= half
      if (posRef.current < -half) posRef.current += half
    }
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${posRef.current}px)`
    }
  }

  const handlePointerUp = () => {
    isDragging.current = false
    lastX.current = null
  }

  const handleImageClick = (buildingName) => {
    if (didDrag.current) return
    setSelected(prev => prev === buildingName ? null : buildingName)
  }

  return (
    <div className="home">
      <header className="home-header">
        <img src="/logo.png" alt="NUS Built Environment" className="home-header-logo" />
        <span className="home-label">2025</span>
      </header>

      <main className="home-main">
        <div className="home-content">
          <div className="home-hero">
            <p className="home-tagline">SUSTAINABILITY<br />THROUGH YOUR<br />CAMERA</p>
            <div className="home-title-row">
              <h1 className="home-title">NUSCAPE-AR</h1>
              <div
                className="marquee-wrapper"
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
              >
                <div ref={trackRef} className="marquee-track">
                  {sequence.map((idx, i) => {
                    const b = buildings[idx]
                    const isSelected = selected === b.name
                    return (
                      <div
                        key={i}
                        className="marquee-item"
                        onClick={() => handleImageClick(b.name)}
                      >
                        <img
                          src={`/bg${idx + 1}.png`}
                          alt={b.name}
                          className={`marquee-img${isSelected ? ' marquee-img--dim' : ''}`}
                          draggable={false}
                        />
                        {isSelected && (
                          <div className="marquee-overlay">
                            <p className="marquee-bname">{b.name}</p>
                            <p className="marquee-bdesc">{b.desc}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="home-about">
            <p className="home-about-heading">WHAT IS THIS?</p>
            <p className="home-description">
              A no-download WebAR experience that surfaces real campus energy data through your phone camera. Point at any of the 20 supported building markers to instantly see energy breakdowns, building details, and a direct link to Google Maps — all running on-device in the browser.
            </p>
          </div>

          <div className="home-cta-row">
            <button className="home-cta" onClick={() => window.location.href = '/ar/index.html'}>
              BUILDING MARKERS
              <span className="cta-arrow">→</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="home-footer">
        <span>EXPLORE CAMPUS BUILDINGS</span>
        <span className="footer-line" />
        <span>WEBAR EXPERIENCE</span>
      </footer>
    </div>
  )
}
