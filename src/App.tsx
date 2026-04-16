/**
 * App.tsx — VNSIR Root Component
 * Provides routing scaffold. Feature pages plug in here.
 */

import React from 'react'
import { Header } from '@/components/ui'

export default function App() {
  return (
    <>
      <Header activePath="/" />
      <main id="main-content" tabIndex={-1}>
        {/* Routes will be mounted here by React Router */}
        <div className="container-vnsir section-vnsir">
          <p className="vnsir-eyebrow">VNSIR Platform</p>
          <h1 className="vnsir-hero-headline text-balance" style={{ marginTop: '0.5rem' }}>
            Decoding Vietnam's Shadow Market.
          </h1>
          <p className="vnsir-hero-sub" style={{ marginTop: '1rem', maxWidth: '40rem' }}>
            Executive wisdom and surgical insights. <strong>No raw data.</strong>
          </p>
        </div>
      </main>
    </>
  )
}
