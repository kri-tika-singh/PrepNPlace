import React from 'react'
import { motion, AnimatePresence } from "motion/react"
import {
    FaUserTie,
    FaBriefcase,
    FaFileUpload,
} from "react-icons/fa";
import { useState } from 'react';
import axios from "axios"
import { ServerUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function Step1SetUp({ onStart }) {
    const { userData } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [role, setRole] = useState("");
    const [experience, setExperience] = useState("");
    const [mode, setMode] = useState("Technical");
    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [resumeText, setResumeText] = useState("");
    const [analysisDone, setAnalysisDone] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);

    // mode drives the accent color everywhere on the page - Technical = indigo, HR = olive
    // (written as full literal class strings, not template interpolation, so Tailwind can detect and generate them)
    const isTechnical = mode === "Technical";
    const accentText = isTechnical ? "text-indigo" : "text-olive";
    // dimmed version for text sitting directly on the dark panel - full-strength accent reads too harsh there
    const accentTextDim = isTechnical ? "text-indigo/70" : "text-olive/70";
    const accentBorderTop = isTechnical ? "border-indigo" : "border-olive";
    const accentBorderLeft = isTechnical ? "border-indigo" : "border-olive";
    const accentRing = isTechnical ? "focus:ring-indigo" : "focus:ring-olive";
    const accentBg = isTechnical ? "bg-indigo" : "bg-olive";

    const handleUploadResume = async () => {
        if (!resumeFile || analyzing) return;
        setAnalyzing(true)

        const formdata = new FormData()
        formdata.append("resume", resumeFile)

        try {
            const result = await axios.post(ServerUrl + "/api/interview/resume", formdata, { withCredentials: true })
            setRole(result.data.role || "");
            setExperience(result.data.experience || "");
            setProjects(result.data.projects || []);
            setSkills(result.data.skills || []);
            setResumeText(result.data.resumeText || "");
            setAnalysisDone(true);
            setAnalyzing(false);
        } catch (error) {
            console.log(error)
            setAnalyzing(false);
        }
    }

    const handleStart = async () => {
        setLoading(true)
        try {
           const result = await axios.post(ServerUrl + "/api/interview/generate-questions" , {role, experience, mode , resumeText, projects, skills } , {withCredentials:true}) 
           console.log(result.data)
           if(userData){
            dispatch(setUserData({...userData , credits:result.data.creditsLeft}))
           }
           setLoading(false)
           onStart(result.data)

        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen grid md:grid-cols-2'>

            {/* LEFT - live briefing preview */}
            <div className={`bg-ink text-white p-12 flex flex-col justify-center border-t-4 ${accentBorderTop} transition-colors duration-500`}>
                <p className='text-sm text-gray-400 mb-3 tracking-wide'>SESSION BRIEFING</p>

                <h2 className="font-display text-3xl md:text-4xl leading-snug mb-10">
                    Preparing a{" "}
                    <span className={`${accentTextDim} font-medium`}>{mode}</span>{" "}
                    interview for{" "}
                    <span className="italic">{role || "your role"}</span>
                    {experience && <> with <span className="italic">{experience}</span> experience</>}.
                </h2>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={mode}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`bg-white/5 border-l-4 ${accentBorderLeft} rounded-xl p-6 space-y-4`}>

                        <div className='flex justify-between text-sm'>
                            <span className='text-gray-400'>Role</span>
                            <span className='font-medium'>{role || "—"}</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                            <span className='text-gray-400'>Experience</span>
                            <span className='font-medium'>{experience || "—"}</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                            <span className='text-gray-400'>Mode</span>
                            <span className={`font-medium ${accentTextDim}`}>{mode}</span>
                        </div>
                        {skills.length > 0 && (
                            <div className='pt-2 border-t border-white/10'>
                                <span className='text-gray-400 text-sm block mb-2'>Skills detected</span>
                                <div className='flex flex-wrap gap-2'>
                                    {skills.map((s, i) => (
                                        <span key={i} className='bg-white/10 px-3 py-1 rounded-full text-xs'>{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* RIGHT - form */}
            <div className='bg-dawn p-12 flex flex-col justify-center'>
                <h2 className='font-display text-3xl text-ink mb-8'>Interview Setup</h2>

                <div className='space-y-6 max-w-md'>

                    <div className='relative'>
                        <FaUserTie className='absolute top-4 left-4 text-gray-400' />
                        <input type='text' placeholder='Enter role'
                            className={`w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 ${accentRing} outline-none transition bg-white`}
                            onChange={(e) => setRole(e.target.value)} value={role} />
                    </div>

                    <div className='relative'>
                        <FaBriefcase className='absolute top-4 left-4 text-gray-400' />
                        <input type='text' placeholder='Experience (e.g. 2 years)'
                            className={`w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 ${accentRing} outline-none transition bg-white`}
                            onChange={(e) => setExperience(e.target.value)} value={experience} />
                    </div>

                    <select value={mode}
                        onChange={(e) => setMode(e.target.value)}
                        className={`w-full py-3 px-4 border border-gray-200 rounded-xl focus:ring-2 ${accentRing} outline-none transition bg-white`}>
                        <option value="Technical">Technical Interview</option>
                        <option value="HR">HR Interview</option>
                    </select>

                    {!analysisDone && (
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            onClick={() => document.getElementById("resumeUpload").click()}
                            className='border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-olive hover:bg-sage-panel transition'>

                            <FaFileUpload className='text-4xl mx-auto text-olive mb-3' />
                            <input type="file" accept="application/pdf" id="resumeUpload" className='hidden'
                                onChange={(e) => setResumeFile(e.target.files[0])} />
                            <p className='text-gray-600 font-medium'>
                                {resumeFile ? resumeFile.name : "Click to upload resume (Optional)"}
                            </p>

                            {resumeFile && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onClick={(e) => { e.stopPropagation(); handleUploadResume() }}
                                    className='mt-4 bg-ink text-white px-5 py-2 rounded-lg hover:opacity-90 transition'>
                                    {analyzing ? "Analyzing..." : "Analyze Resume"}
                                </motion.button>
                            )}
                        </motion.div>
                    )}

                    <motion.button
                        onClick={handleStart}
                        disabled={!role || !experience || loading}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full disabled:bg-gray-400 ${accentBg} text-white py-3 rounded-full text-lg font-semibold transition duration-300 shadow-md`}>
                        {loading ? "Starting..." : "Start Interview"}
                    </motion.button>
                </div>
            </div>
        </div>
    )
}

export default Step1SetUp