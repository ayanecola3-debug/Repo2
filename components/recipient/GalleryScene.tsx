'use client';

interface GallerySceneProps {
  photos: { id: string; ext: string }[];
  onPhotoClick: (url: string) => void;
  onNext: () => void;
}

export function GalleryScene({ photos, onPhotoClick, onNext }: GallerySceneProps) {
  if (photos.length === 0) {
    return (
      <>
        <div className="eyebrow">OUR MEMORIES ♥</div>
        <h1>Little moments, <em>big love.</em></h1>
        <p>No photos added, but the memories live in our hearts.</p>
        <button className="primary" onClick={onNext}>See the magic ✦</button>
      </>
    );
  }

  return (
    <>
      <div className="eyebrow">OUR MEMORIES ♥</div>
      <h1>Little moments, <em>big love.</em></h1>
      <p>Tap a photo to see it up close.</p>
      <div className="memorygrid">
        {photos.map((p, i) => (
          <div className="memory" key={i} onClick={() => onPhotoClick(`/api/photo/${p.id}.${p.ext}`)}>
            <img src={`/api/photo/${p.id}.${p.ext}`} alt={`Memory ${i + 1}`} loading="lazy" style={{ maxWidth: '100%', borderRadius: '8px' }} />
            <span>♡ A favorite moment</span>
          </div>
        ))}
      </div>
      <button className="primary" onClick={onNext}>See the magic ✦</button>
    </>
  );
}
