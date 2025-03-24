// components/TopLoader.tsx

"use client"

import { useEffect } from "react";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Customize NProgress (optional)
NProgress.configure({
  showSpinner: false, // Disable spinner
  speed: 400, // Animation speed
  minimum: 0.2, // Minimum percentage before starting
});

const TopLoader: React.FC = () => {
  useEffect(() => {
    const handleStart = () => NProgress.start();
    const handleComplete = () => NProgress.done();
    const handleError = () => NProgress.done();

    Router.events.on("routeChangeStart", handleStart);
    Router.events.on("routeChangeComplete", handleComplete);
    Router.events.on("routeChangeError", handleError);

    // Cleanup listeners on unmount
    return () => {
      Router.events.off("routeChangeStart", handleStart);
      Router.events.off("routeChangeComplete", handleComplete);
      Router.events.off("routeChangeError", handleError);
    };
  }, []);

  return null; // No UI element needed
};

export default TopLoader;
