/* eslint-disable no-console */
"use client";
import React, { useEffect } from "react";

export default function Pwa() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", async function () {
        await navigator.serviceWorker.register("/sw.js").then(() => {
          console.log('Service Worker registered');
        })
          .catch((error) => {
            console.error('Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  return <></>;
}