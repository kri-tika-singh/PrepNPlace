import React from 'react'
import maleVideo from "../assets/videos/male-ai.mp4"
import femaleVideo from "../assets/videos/female-ai.mp4"
import { motion, AnimatePresence } from "motion/react"
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import axios from "axios"
import { ServerUrl } from '../App'
import { BsArrowRight } from 'react-icons/bs'

function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, questions, userName } = interviewData;
  const [isIntroPhase, setIsIntroPhase] = useState(true);

  const [isMicOn, setIsMicOn] = useState(true);
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(
    questions[0]?.timeLimit || 60
  );
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");


  const videoRef = useRef(null);

  const currentQuestion = questions[currentIndex];


  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      // Try known female voices first
      const femaleVoice =
        voices.find(v =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("female")
        );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      // Try known male voices
      const maleVoice =
        voices.find(v =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male")
        );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      // Fallback: first voice (assume female)
      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

  }, [])

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;


  /* ---------------- SPEAK FUNCTION ---------------- */
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      // Add natural pauses after commas and periods
      const humanText = text
        .replace(/,/g, ", ... ")
        .replace(/\./g, ". ... ");

      const utterance = new SpeechSynthesisUtterance(humanText);

      utterance.voice = selectedVoice;

      // Human-like pacing
      utterance.rate = 0.92;     // slightly slower than normal
      utterance.pitch = 1.05;    // small warmth
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMic()
        videoRef.current?.play();
      };


      utterance.onend = () => {
        videoRef.current?.pause();
        videoRef.current.currentTime = 0;
        setIsAIPlaying(false);



        if (isMicOn) {
          startMic();
        }
        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300);
      };


      setSubtitle(text);

      window.speechSynthesis.speak(utterance);
    });
  };


  useEffect(() => {
    if (!selectedVoice) {
      return;
    }
    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`
        );

        await speakText(
          "I'll ask you a few questions. Just answer naturally, and take your time. Let's begin."
        );

        setIsIntroPhase(false)
      } else if (currentQuestion) {
        await new Promise(r => setTimeout(r, 800));

        // If last question (hard level)
        if (currentIndex === questions.length - 1) {
          await speakText("Alright, this one might be a bit more challenging.");
        }

        await speakText(currentQuestion.question);

        if (isMicOn) {
          startMic();
        }
      }

    }

    runIntro()


  }, [selectedVoice, isIntroPhase, currentIndex])


  // SINGLE timer effect: resets timeLeft to the current question's limit AND starts
  // the countdown atomically. Previously this was split across two separate effects
  // (one resetting timeLeft, one running the interval) which could race against each
  // other depending on effect ordering, causing the countdown to occasionally start
  // from a stale leftover value instead of the correct 60/90/120s limit.
  useEffect(() => {
    if (isIntroPhase || !currentQuestion) return;

    setTimeLeft(currentQuestion.timeLimit || 60);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex]);


  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript;

      setAnswer((prev) => prev + " " + transcript);
    };

    recognitionRef.current = recognition;

  }, []);


  const startMic = () => {
    if (recognitionRef.current && !isAIPlaying) {
      try {
        recognitionRef.current.start();
      } catch { }
    }
  };

  const stopMic = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };
  const toggleMic = () => {
    if (isMicOn) {
      stopMic();
    } else {
      startMic();
    }
    setIsMicOn(!isMicOn);
  };


  const submitAnswer = async () => {
    if (isSubmitting) return;
    stopMic()
    setIsSubmitting(true)

    try {
      const result = await axios.post(ServerUrl + "/api/interview/submit-answer", {
        interviewId,
        questionIndex: currentIndex,
        answer,
        timeTaken:
          currentQuestion.timeLimit - timeLeft,
      } , {withCredentials:true})

      setFeedback(result.data.feedback)
      speakText(result.data.feedback)
      setIsSubmitting(false)
    } catch (error) {
console.log(error)
setIsSubmitting(false)
    }
  }

  const handleNext =async () => {
    setAnswer("");
    setFeedback("");

    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }

    await speakText("Alright, let's move to the next question.");

    setCurrentIndex(currentIndex + 1);
    setTimeout(() => {
      if (isMicOn) startMic();
    }, 500);

   
  }

  const finishInterview = async () => {
    stopMic()
    setIsMicOn(false)
    try {
      const result = await axios.post(ServerUrl+ "/api/interview/finish" , { interviewId} , {withCredentials:true})

      console.log(result.data)
      onFinish(result.data)
    } catch (error) {
      console.log(error)
    }
  }


   useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;

    if (timeLeft === 0 && !isSubmitting && !feedback) {
      submitAnswer()
    }
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }

      window.speechSynthesis.cancel();
    };
  }, []);

  // mm:ss display, replaces the old circular Timer component
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeDisplay = `${minutes}:${String(seconds).padStart(2, "0")}`;


  return (
    <div className='min-h-screen bg-dawn flex items-center justify-center p-4'>
      <div className='w-full max-w-2xl'>

        {/* interviewer line - compact, not a big illustration */}
        <div className='flex items-center gap-2 mb-5'>
          <video src={videoSource} ref={videoRef} muted playsInline className='w-7 h-7 rounded-full object-cover' />
          <span className='text-sm text-gray-500'>
            AI Interviewer · {isIntroPhase ? "Getting ready" : isAIPlaying ? "Speaking" : "Listening"}
          </span>
        </div>

        {!isIntroPhase && currentQuestion && (
          <>
            {/* progress row */}
            <div className='flex items-center gap-3 mb-6'>
              <span className='text-sm font-medium text-ink'>Question {currentIndex + 1} of {questions.length}</span>
              <div className='flex gap-1.5'>
                {questions.map((_, i) => (
                  <div key={i} className={`w-4 h-1 rounded-full ${i <= currentIndex ? 'bg-olive' : 'bg-gray-300'}`} />
                ))}
              </div>
              <span className='text-sm text-gray-500 ml-auto'>{timeDisplay} remaining</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}>

                {/* subtitle while AI speaks */}
                {subtitle && (
                  <p className='text-sm text-gray-500 mb-2 italic'>{subtitle}</p>
                )}

                <p className='text-sm text-moss mb-1'>Interview question</p>
                <h1 className='font-display text-2xl text-ink leading-snug mb-5'>
                  {currentQuestion.question}
                </h1>

                <div className='bg-white border border-gray-200 rounded-2xl p-5 mb-4'>
                  <textarea
                    placeholder="Start typing naturally. There are no perfect answers."
                    onChange={(e) => setAnswer(e.target.value)}
                    value={answer}
                    rows={6}
                    className="w-full outline-none resize-none text-ink placeholder-gray-400" />

                  <button
                    onClick={toggleMic}
                    className='flex items-center gap-1.5 text-sm text-indigo mt-3'>
                    {isMicOn ? <FaMicrophone size={13} /> : <FaMicrophoneSlash size={13} />}
                    {isMicOn ? "Listening for speech" : "Speak answer"}
                  </button>
                </div>

                {!feedback ? (
                  <div className='flex justify-end'>
                    <motion.button
                      onClick={submitAnswer}
                      disabled={isSubmitting}
                      whileTap={{ scale: 0.97 }}
                      className='bg-olive text-ink px-6 py-2.5 rounded-full font-medium disabled:bg-gray-300 flex items-center gap-2'>
                      {isSubmitting ? "Submitting..." : "Submit answer"}
                      {!isSubmitting && <BsArrowRight size={16} />}
                    </motion.button>
                  </div>
                ) : (
                  <div className='bg-sage-panel rounded-2xl p-4'>
                    <p className='text-moss text-sm mb-3'>{feedback}</p>
                    <div className='flex justify-end'>
                      <button
                        onClick={handleNext}
                        className='bg-indigo text-white px-6 py-2.5 rounded-full font-medium flex items-center gap-2'>
                        Next question <BsArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  )
}

export default Step2Interview