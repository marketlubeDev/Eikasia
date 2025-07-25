import React from "react";
import LightRays from "./LightRays";

export default function Background() {
  return (
    <div className="absolute" style={{ height: "100vh", width: "100vw" }}>
      <LightRays
        raysOrigin="top-center"
        raysColor="white"
        raysSpeed={1.5}
        lightSpread={0.8}
        rayLength={1.2}
        followMouse={true}
        mouseInfluence={0.1}
        noiseAmount={0.1}
        distortion={0.05}
        className="custom-rays"
      />
    </div>
  );
}
