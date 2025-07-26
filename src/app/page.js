"use client";
import Background from "./home/Hero/Background";
import Hero from "./home/Hero/Hero";
import LightRays from "./home/Hero/LightRays";
import Nav from "./layout/Nav/Nav";
import "./style.css";

export default function Home() {
  return (
    <>
      <Nav />
      <div className="min-h-screen bg-black">
        <Background />
        <Hero />
      </div>
    </>
  );
}
