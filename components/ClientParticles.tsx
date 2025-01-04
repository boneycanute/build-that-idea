// components/ClientParticles.tsx
"use client";
import Particles from "./ui/particles";

export default function ClientParticles() {
  return (
    <Particles
      className="absolute inset-0 z-0 opacity-50"
      quantity={100}
      ease={80}
      color="#C53AAE"
      size={4.5}
      refresh={false}
    />
  );
}
