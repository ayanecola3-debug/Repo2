'use client';
import { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { EASE_OUT, EASE_INOUT } from '@/lib/motion';
import { useTimeouts, useIsMobile } from '@/lib/hooks';
import { makeRng } from '@/lib/random';
import { Backdrop } from '@/components/recipient/Backdrop';
import { SceneCard } from '@/components/recipient/SceneCard';
import { ChapterOverlay } from '@/components/recipient/ChapterOverlay';
import { PasswordScreen } from '@/components/recipient/PasswordScreen';
import { CakeScene } from '@/components/recipient/CakeScene';
import { DateScene } from '@/components/recipient/DateScene';
import { NameScene } from '@/components/recipient/NameScene';
import { MessageScene } from '@/components/recipient/MessageScene';
import { BalloonScene } from '@/components/recipient/BalloonScene';
import { LetterScene } from '@/components/recipient/LetterScene';
import { GalleryScene } from '@/components/recipient/GalleryScene';
import { FinalScene } from '@/components/recipient/FinalScene';

type Data = {
  date: string;
  recipientName: string;
  messages: string[];
  letter: string;
  wishes: string[];
  photos: { id: string; ext: string }[];
};

export default function Birthday({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState('');
  const [data, setData] = useState<Data | null>(null);
  const [step, setStep] = useState(-1);
  const [err, setErr] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [candlesExtinguished, setCandlesExtinguished] = useState<number[]>([]);
  const [poppedBalloons, setPoppedBalloons] = useState<number[]>([]);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const [chapterTransition, setChapterTransition] = useState<string | null>(null);

  const { later, clearAll } = useTimeouts();
  const isMobile = useIsMobile();
  const allCandlesOutRef = useRef(false);

  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/experience/${id}`)
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setErr(true));
  }, [id]);

  const checkPassword = async () => {
    try {
      const r = await fetch(`/api/experience/${id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      if (r.ok) {
        setPasswordError(false);
        setChapterTransition('Chapter 01: Your Special Day');
        later(() => {
          setChapterTransition(null);
          setStep(0);
        }, 2000);
      } else {
        setPasswordError(true);
        const input = document.querySelector('.recipient .field input') as HTMLElement;
        if (input) input.classList.add('shake');
        later(() => input?.classList.remove('shake'), 500);
      }
    } catch {
      setPasswordError(true);
    }
  };

  const extinguishCandle = (index: number) => {
    setCandlesExtinguished(prev => {
      if (prev.includes(index)) return prev;
      const newExtinguished = [...prev, index];
      if (newExtinguished.length === 4) {
        allCandlesOutRef.current = true;
      }
      return newExtinguished;
    });
  };

  const popBalloon = (index: number) => {
    setPoppedBalloons(prev => {
      if (prev.includes(index)) return prev;
      return [...prev, index];
    });
  };

  const showChapter = (title: string, nextStep: number) => {
    setChapterTransition(title);
    later(() => {
      setChapterTransition(null);
      setStep(nextStep);
    }, 2000);
  };

  const resetJourney = () => {
    clearAll();
    setStep(0);
    setCandlesExtinguished([]);
    setPoppedBalloons([]);
    setLightboxPhoto(null);
    setChapterTransition(null);
    allCandlesOutRef.current = false;
  };

  if (err) {
    return (
      <main className="recipient">
        <Backdrop step={step} />
        <SceneCard>
          <div className="heroheart">♡</div>
          <h1>Oh, this link wandered off.</h1>
          <p>This birthday surprise may have expired or the link may be incorrect.</p>
        </SceneCard>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="recipient">
        <Backdrop step={step} />
        <SceneCard>
          <div className="loading">♥<p>Unwrapping a little surprise…</p></div>
        </SceneCard>
      </main>
    );
  }

  const sceneVariants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.35, ease: EASE_INOUT } },
  };

  return (
    <MotionConfig reducedMotion="user">
      <main className="recipient">
        <Backdrop step={step} />
        <ChapterOverlay chapterTransition={chapterTransition} step={step} />
        <div className="recipientbar">
          <span className="brand">
            <span className="brandmark">♥</span> bloom<span className="brandlight">day</span>
          </span>
          <span>{step >= 0 ? 'MADE JUST FOR YOU' : 'A LITTLE SURPRISE'} <b>♥</b></span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={sceneVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <SceneCard>
              {step === -1 && (
                <PasswordScreen
                  recipientName={data.recipientName}
                  passwordError={passwordError}
                  onPasswordChange={setPasswordInput}
                  onPasswordSubmit={checkPassword}
                />
              )}
              {step === 0 && (
                <CakeScene
                  candlesExtinguished={candlesExtinguished}
                  onExtinguishCandle={extinguishCandle}
                  onNext={() => {
                    setChapterTransition('Chapter 02: A Few Things I Want To Say');
                    later(() => {
                      setChapterTransition(null);
                      setStep(1);
                    }, 2000);
                  }}
                />
              )}
              {step === 1 && (
                <DateScene
                  date={data.date}
                  onNext={() => showChapter('Chapter 03: Just For You', 2)}
                />
              )}
              {step === 2 && (
                <NameScene
                  recipientName={data.recipientName}
                  onNext={() => showChapter('Chapter 04: A Few Things I Want To Say', 3)}
                />
              )}
              {step === 3 && (
                <MessageScene
                  message={data.messages[0]}
                  messageIndex={0}
                  onNext={() => setStep(4)}
                />
              )}
              {step === 4 && (
                <MessageScene
                  message={data.messages[1]}
                  messageIndex={1}
                  onNext={() => setStep(5)}
                />
              )}
              {step === 5 && (
                <MessageScene
                  message={data.messages[2]}
                  messageIndex={2}
                  onNext={() => setStep(6)}
                />
              )}
              {step === 6 && (
                <MessageScene
                  message={data.messages[3]}
                  messageIndex={3}
                  onNext={() => showChapter('Chapter 05: Make A Wish', 7)}
                />
              )}
              {step === 7 && (
                <BalloonScene
                  wishes={data.wishes}
                  poppedBalloons={poppedBalloons}
                  onPopBalloon={popBalloon}
                  onNext={() => showChapter('Chapter 06: From The Heart', 8)}
                />
              )}
              {step === 8 && (
                <LetterScene
                  letter={data.letter}
                  onNext={() => showChapter('Chapter 07: Our Memories', 9)}
                />
              )}
              {step === 9 && (
                <GalleryScene
                  photos={data.photos}
                  onPhotoClick={setLightboxPhoto}
                  onNext={() => showChapter('Chapter 08: One Last Surprise', 10)}
                />
              )}
              {step === 10 && (
                <FinalScene
                  recipientName={data.recipientName}
                  onReplay={resetJourney}
                />
              )}
            </SceneCard>
          </motion.div>
        </AnimatePresence>
        {lightboxPhoto && (
          <div className="lightbox" onClick={() => setLightboxPhoto(null)}>
            <img src={lightboxPhoto} alt="Memory" className="lightbox-image" />
            <button className="lightbox-close">×</button>
          </div>
        )}
      </main>
    </MotionConfig>
  );
}
