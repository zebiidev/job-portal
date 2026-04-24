"use client"
import CallToAction from "./home/components/CallToAction";
import Hero from "./home/components/Hero";
import LatestJobs from "./home/components/LatestJobs";

export default function Home() {
  return (
    <div>
      <Hero />
      <LatestJobs />
      <CallToAction />
    </div>
  );
}
