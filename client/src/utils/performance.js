// Lazy loading images with fallback
export const lazyLoadImage = (imgElement) => {
    if ("loading" in HTMLImageElement.prototype) {
      imgElement.loading = "lazy";
    } else {
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset?.src) {
              img.src = img.dataset.src;
              observer.unobserve(img);
            }
          }
        });
      });
      observer.observe(imgElement);
    }
  };
  
  // Debounce: wait X ms after last call
  export const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };
  
  // Throttle: run once every X ms
  export const throttle = (func, limit) => {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  };
  
  // Preload images and fonts
  export const preloadResources = (resources) => {
    resources.forEach((resource) => {
      if (resource.type === "image") {
        const img = new Image();
        img.src = resource.url;
      } else if (resource.type === "font") {
        const link = document.createElement("link");
        link.rel = "preload";
        link.href = resource.url;
        link.as = "font";
        link.crossOrigin = "anonymous";
        document.head.appendChild(link);
      }
      // Extend for more types if needed
    });
  };
  