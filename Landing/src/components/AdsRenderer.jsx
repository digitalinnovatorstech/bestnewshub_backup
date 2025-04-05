import { useEffect, useRef, useState } from "react";

const AdsRenderer = ({ ads, position, onError }) => {
  const adRef = useRef(null);
  const ad = ads?.find((ad) => ad?.adsPosition === position);
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    if (!adRef.current || !ad) return;

    const observer = new ResizeObserver(() => {
      if (adRef?.current?.offsetWidth > 0) {
        try {
          if (window.adsbygoogle) {
            window.adsbygoogle.push({});
          }
        } catch (e) {
          setAdError(true);
          // if (onError) onError(`Failed to load Google Ads at ${position}.`);
        }
      }
    });

    observer.observe(adRef.current);

    return () => observer.disconnect();
  }, [ad, position, onError]);

  if (adError) {
    return null;
  }
  if (!ad) {
    return null;
  }

  return (
    <ins
      className="adsbygoogle"
      style={{
        display: "block",
        width: "100%",
        height: "auto",
        minHeight: "150px",
      }}
      data-ad-client="ca-pub-9632557061063857"
      data-ad-slot={getAdSlot(ad)}
      data-ad-format="auto"
      data-full-width-responsive="true"
      ref={adRef}
    ></ins>
  );
};

const getAdSlot = (ad) => {
  const match = ad?.adsScript.match(/data-ad-slot="(\d+)"/);
  return match ? match[1] : "";
};

export default AdsRenderer;
