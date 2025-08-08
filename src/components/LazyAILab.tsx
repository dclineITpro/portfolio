import React, { Suspense, useEffect, useRef, useState } from 'react';

const LazyAILabInner = React.lazy(() => import('./AILab'));

const LazyAILab: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (visible) return; // already loaded
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { root: null, rootMargin: '200px', threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible]);

  return (
    <div ref={ref} id="ai-lab">
      {visible ? (
        <Suspense fallback={<div className="py-24 text-center text-slate-400">Loading AI Lab…</div>}>
          <LazyAILabInner />
        </Suspense>
      ) : (
        <div className="py-24 text-center text-slate-400">AI Lab will load when visible…</div>
      )}
    </div>
  );
};

export default LazyAILab;
