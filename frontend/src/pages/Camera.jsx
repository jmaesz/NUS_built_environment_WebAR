import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Camera.css'

export default function Camera() {
  const videoRef = useRef(null)
  const navigate = useNavigate()
  const [status, setStatus] = useState('requesting') // requesting | active | denied

  useEffect(() => {
    let stream = null

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setStatus('active')
        }
      } catch {
        setStatus('denied')
      }
    }

    startCamera()

    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop())
    }
  }, [])

  return (
    <div className="camera">
      {/* Live feed */}
      <video
        ref={videoRef}
        className="camera-feed"
        autoPlay
        playsInline
        muted
      />

      {/* Overlay UI */}
      <div className="camera-overlay">
        {/* Top bar */}
        <div className="camera-topbar">
          <button className="camera-back" onClick={() => navigate('/')}>
            ← BACK
          </button>
          <span className="camera-brand">NUS CAMPUS AR</span>
          <div className="camera-status-dot" data-active={status === 'active'} />
        </div>

        {/* Viewfinder corners */}
        {status === 'active' && (
          <div className="viewfinder">
            <span className="vf-corner tl" />
            <span className="vf-corner tr" />
            <span className="vf-corner bl" />
            <span className="vf-corner br" />
            <p className="vf-label">POINT AT A BUILDING</p>
          </div>
        )}

        {/* Requesting permission */}
        {status === 'requesting' && (
          <div className="camera-message">
            <span className="sparkle-lg">✦</span>
            <p>REQUESTING CAMERA ACCESS</p>
          </div>
        )}

        {/* Permission denied */}
        {status === 'denied' && (
          <div className="camera-message">
            <span className="sparkle-lg">✦</span>
            <p>CAMERA ACCESS DENIED</p>
            <p className="camera-hint">Enable camera permission in your browser settings and reload.</p>
            <button className="camera-retry" onClick={() => window.location.reload()}>
              RETRY
            </button>
          </div>
        )}

        {/* Bottom bar */}
        <div className="camera-bottombar">
          <span className="camera-footer-label">NUS BUILT ENVIRONMENT</span>
          <span className="camera-footer-label">SUSTAINABILITY</span>
        </div>
      </div>
    </div>
  )
}
