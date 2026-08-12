import React from 'react'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import { motion } from "motion/react";
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import { FaMicrophone, FaBrain } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthModel from '../components/AuthModel';
import hrImg from "../assets/HR.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import evalImg from "../assets/ai-ans.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";
import Footer from '../components/Footer';
import HeroBackground from '../components/heroBackground';


function Home() {
  const { userData } = useSelector((state) => state.user)
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate()

  // shared "go here, or ask to log in first" handler for all CTAs
  const goTo = (path) => {
    if (!userData) {
      setShowAuth(true)
      return;
    }
    navigate(path)
  }

  return (
    <div className='min-h-screen bg-dawn flex flex-col font-sans'>
      <Navbar />

      <div className='flex-1 px-6 py-20'>
        <div className='max-w-6xl mx-auto'>

          {/* HERO */}
          <div className='relative text-center mb-28'>
            <HeroBackground />

            <div className='relative z-10 max-w-3xl mx-auto'>
              <p className='flex items-center justify-center gap-2 text-moss font-medium text-sm mb-6'>
                <HiSparkles size={16} />
                AI-powered interview & aptitude practice
              </p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className='font-display text-5xl md:text-7xl leading-tight text-ink'>
                Practice until the pressure feels <span className='italic text-moss'>familiar.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className='text-indigo mt-6 text-xl'>
                Role-based mock interviews and timed aptitude tests, scored in real time.
              </motion.p>

              <div className='flex flex-wrap justify-center gap-6 mt-12'>
                <motion.div
                  onClick={() => goTo("/interview")}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className='text-left bg-ink rounded-2xl p-7 w-80 max-w-full border-t-4 border-olive cursor-pointer shadow-md'>
                  <div className='w-10 h-10 rounded-xl bg-olive/15 flex items-center justify-center mb-4'>
                    <FaMicrophone className='text-olive-light' size={18} />
                  </div>
                  <h3 className='text-white font-medium mb-1'>Mock interview</h3>
                  <p className='text-gray-400 text-sm mb-5'>Voice-based, role-specific, scored live.</p>
                  <span className='text-olive-light text-sm font-medium'>Start interview →</span>
                </motion.div>

                <motion.div
                  onClick={() => goTo("/aptitude")}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className='text-left bg-ink rounded-2xl p-7 w-80 max-w-full border-t-4 border-indigo cursor-pointer shadow-md'>
                  <div className='w-10 h-10 rounded-xl bg-indigo/20 flex items-center justify-center mb-4'>
                    <FaBrain className='text-periwinkle' size={18} />
                  </div>
                  <h3 className='text-white font-medium mb-1'>Aptitude test</h3>
                  <p className='text-gray-400 text-sm mb-5'>Timed MCQs, instant scoring.</p>
                  <span className='text-periwinkle text-sm font-medium'>Start test →</span>
                </motion.div>
              </div>

              {/* <button
                onClick={() => goTo("/history")}
                className='mt-5 text-sm text-indigo underline underline-offset-4'>
                View History
              </button> */}
            </div>
          </div>

          {/* STEPS */}
          <div className='mb-32'>
            <p className='text-center text-sm text-gray-500 mb-16'>How it works</p>

            <div className='grid md:grid-cols-3 gap-x-10 gap-y-20 max-w-5xl mx-auto justify-items-center pt-8'>
              {
                [
                  {
                    icon: <BsRobot size={16} />,
                    step: "1",
                    tag: "SETUP",
                    accentBorder: "border-olive",
                    accentBg: "bg-sage-panel",
                    accentText: "text-moss",
                    title: "Set the scene",
                    desc: "Pick a role for a mock interview, or a category and difficulty for an aptitude test."
                  },
                  {
                    icon: <BsMic size={16} />,
                    step: "2",
                    tag: "PRACTICE",
                    accentBorder: "border-indigo",
                    accentBg: "bg-indigo/10",
                    accentText: "text-indigo",
                    title: "Answer at your own pace",
                    desc: "Speak your answers or work through timed questions, one at a time, no judgment."
                  },
                  {
                    icon: <BsClock size={16} />,
                    step: "3",
                    tag: "REVIEW",
                    accentBorder: "border-straw",
                    accentBg: "bg-straw/20",
                    accentText: "text-moss",
                    title: "AI scores every answer",
                    desc: "Get an instant, AI-generated breakdown of your strengths and gaps, ready to download."
                  }
                ].map((item, index) => (
                  <motion.div key={index}
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 + index * 0.2 }}
                    whileHover={{ rotate: 0, scale: 1.06 }}

                    className={`
        relative bg-white rounded-3xl border-2 border-straw
        hover:border-olive p-10 w-80 max-w-[90%] shadow-md hover:shadow-2xl
        transition-all duration-300
        ${index === 0 ? "rotate-[-4deg]" : ""}
        ${index === 1 ? "rotate-[3deg] md:-mt-6 shadow-xl" : ""}
        ${index === 2 ? "rotate-[-3deg]" : ""}
      `}>

                    <div className='absolute -top-8 left-1/2 -translate-x-1/2 bg-white border-2 border-olive text-moss w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg'>
                      {item.icon}</div>
                    <div className='pt-10 text-center'>
                      <div className='text-xs text-moss font-semibold mb-2 tracking-wider'>{item.tag}</div>
                      <h3 className='font-semibold mb-3 text-lg text-ink'>{item.title}</h3>
                      <p className='text-sm text-gray-500 leading-relaxed'>{item.desc}</p>
                    </div>


                  </motion.div>
                ))
              }
            </div>
          </div>


          <div className='mb-32'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='font-display text-4xl text-center mb-16 text-ink'>
              Advanced AI <span className="text-moss italic">Capabilities</span>
            </motion.h2>

            <div className='grid md:grid-cols-2 gap-10'>
              {
                [
                  {
                    image: evalImg,
                    icon: <BsBarChart size={20} />,
                    title: "AI Answer Evaluation",
                    desc: "Scores communication, technical accuracy and confidence."
                  },
                  {
                    image: resumeImg,
                    icon: <BsFileEarmarkText size={20} />,
                    title: "Resume Based Interview",
                    desc: "Project-specific questions based on uploaded resume."
                  },
                  {
                    image: pdfImg,
                    icon: <BsFileEarmarkText size={20} />,
                    title: "Downloadable PDF Report",
                    desc: "Detailed strengths, weaknesses and improvement insights."
                  },
                  {
                    image: analyticsImg,
                    icon: <BsBarChart size={20} />,
                    title: "History & Analytics",
                    desc: "Track progress with performance graphs and topic analysis."
                  }
                ].map((item, index) => (
                  <motion.div key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className='bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all'>
                    <div className='flex flex-col md:flex-row items-center gap-8'>
                      <div className='w-full md:w-1/2 flex justify-center'>
                        <img src={item.image} alt={item.title} className='w-full h-auto object-contain max-h-64' />
                      </div>

                      <div className='w-full md:w-1/2'>
                        <div className='bg-sage-panel text-moss w-12 h-12 rounded-xl flex items-center justify-center mb-6'>
                          {item.icon}
                        </div>
                        <h3 className='font-semibold mb-3 text-xl text-ink'>{item.title}</h3>
                        <p className='text-gray-500 text-sm leading-relaxed'>{item.desc}</p>
                      </div>

                    </div>


                  </motion.div>
                ))
              }
            </div>


          </div>

          <div className='mb-32'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='font-display text-4xl text-center mb-16 text-ink'>
              Multiple Interview <span className="text-moss italic">Modes</span>
            </motion.h2>

            <div className='grid md:grid-cols-2 gap-10'>
              {
                [
                  {
                    img: hrImg,
                    title: "HR Interview Mode",
                    desc: "Behavioral and communication based evaluation."
                  },
                  {
                    img: techImg,
                    title: "Technical Mode",
                    desc: "Deep technical questioning based on selected role."
                  },

                  {
                    img: confidenceImg,
                    title: "Confidence Detection",
                    desc: "Basic tone and voice analysis insights."
                  },
                  {
                    img: creditImg,
                    title: "Credits System",
                    desc: "Unlock premium interview sessions easily."
                  }
                ].map((mode, index) => (
                  <motion.div key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -6 }}
                    className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all">

                    <div className='flex items-center justify-between gap-6'>
                      <div className="w-1/2">
                        <h3 className="font-semibold text-xl mb-3 text-ink">
                          {mode.title}
                        </h3>

                        <p className="text-gray-500 text-sm leading-relaxed">
                          {mode.desc}
                        </p>
                      </div>

                      {/* RIGHT IMAGE */}
                      <div className="w-1/2 flex justify-end">
                        <img
                          src={mode.img}
                          alt={mode.title}
                          className="w-28 h-28 object-contain"
                        />
                      </div>



                    </div>


                  </motion.div>
                ))
              }
            </div>


          </div>

        </div>
      </div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}

        <Footer/>

    </div>
  )
}

export default Home