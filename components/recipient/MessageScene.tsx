'use client';

interface MessageSceneProps {
  message: string;
  messageIndex: number;
  onNext: () => void;
}

const MESSAGE_TITLES = [
  'One thing to remember…',
  'A tiny happy thought…',
  'A little appreciation…',
  'A wish for you…',
];

export function MessageScene({ message, messageIndex, onNext }: MessageSceneProps) {
  return (
    <>
      <div className="eyebrow">A LITTLE NOTE FOR YOU · 0{messageIndex + 1}/04</div>
      <div className="recipientart">💗</div>
      <h1>{MESSAGE_TITLES[messageIndex]}</h1>
      <blockquote className="message">{message}</blockquote>
      <button className="primary" onClick={onNext}>Next little note →</button>
    </>
  );
}
