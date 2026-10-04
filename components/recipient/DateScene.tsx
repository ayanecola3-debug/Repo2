'use client';

interface DateSceneProps {
  date: string;
  onNext: () => void;
}

export function DateScene({ date, onNext }: DateSceneProps) {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };

  return (
    <>
      <div className="date-reveal">
        <div className="eyebrow">YOUR SPECIAL DAY</div>
        <h1 className="animated-text">{formatDate(date)}</h1>
      </div>
      <button className="primary" onClick={onNext}>Continue →</button>
    </>
  );
}
