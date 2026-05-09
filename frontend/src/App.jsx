import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Camera from './pages/Camera'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/camera" element={<Camera />} />
    </Routes>
  )
}
