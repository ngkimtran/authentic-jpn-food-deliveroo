"use client";

import { useState, useEffect } from "react";

const useInitialRender = () => {
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);

  useEffect(() => {
    if (!initialRenderComplete) setInitialRenderComplete(true);
  }, [initialRenderComplete]);

  return initialRenderComplete;
};

export default useInitialRender;
