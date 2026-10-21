import React from 'react';
import {Audio, continueRender, delayRender, staticFile} from 'remotion';

/**
 * Results are cached per page: the composition mounts once per rendered frame,
 * so the probe must only ever hit the network once.
 */
const probeCache = new Map<string, boolean>();

/**
 * Plays a file from `public/` when it is there, and stays silent when it is
 * not. This lets the narration track be dropped in later without breaking a
 * render that does not have it yet.
 */
export const OptionalAudio: React.FC<{src: string; volume?: number}> = ({
  src,
  volume = 1,
}) => {
  const [available, setAvailable] = React.useState(false);
  const [handle] = React.useState(() => delayRender(`probe ${src}`));

  React.useEffect(() => {
    let settled = false;
    const settle = (ok: boolean) => {
      if (settled) {
        return;
      }
      settled = true;
      probeCache.set(src, ok);
      setAvailable(ok);
      continueRender(handle);
    };

    const cached = probeCache.get(src);
    if (cached !== undefined) {
      settle(cached);
      return;
    }

    fetch(staticFile(src))
      .then((res) => settle(res.ok))
      .catch(() => settle(false));
  }, [src, handle]);

  if (!available) {
    return null;
  }
  return <Audio src={staticFile(src)} volume={volume} />;
};
