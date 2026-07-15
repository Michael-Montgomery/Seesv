import { useEffect } from 'react';

function AdSlot({ slot, className = '', format = 'auto', responsive = true }) {
  const client = process.env.REACT_APP_ADSENSE_CLIENT_ID;
  const adsEnabled = process.env.REACT_APP_ENABLE_ADS === 'true';

  useEffect(() => {
    if (!adsEnabled || !client || !slot) {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      // Ignore initialization errors so the app UI remains usable.
      console.debug('AdSense init skipped:', error);
    }
  }, [adsEnabled, client, slot]);

  if (!adsEnabled) {
    return (
      <div className={`ad-placeholder ${className}`.trim()}>
        Ads are disabled. Set REACT_APP_ENABLE_ADS=true to enable AdSense.
      </div>
    );
  }

  if (!client || !slot) {
    return (
      <div className={`ad-placeholder ${className}`.trim()}>
        Missing AdSense configuration. Add client and slot IDs in your .env file.
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle ad-slot ${className}`.trim()}
      style={{ display: 'block' }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
    />
  );
}

export default AdSlot;
