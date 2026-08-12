import React from 'react'
import { motion } from "motion/react"
import {
    FaListOl,
    FaClock,
    FaSignal,
    FaBrain,
    FaChartLine,
} from "react-icons/fa";
import { useState } from 'react';
import axios from "axios"
import { ServerUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function Step1AptitudeSetup({ onStart }) {
    const { userData } = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const [category, setCategory] = useState("Logical Reasoning");
    const [questionCount, setQuestionCount] = useState(10);
    const [difficulty, setDifficulty] = useState("Medium");
    const [timePerQuestion, setTimePerQuestion] = useState(45);
    const [loading, setLoading] = useState(false);

    const handleStart = async () => {
        setLoading(true)
        try {
            const result = await axios.post(ServerUrl + "/api/aptitude/generate-questions", {
                category,
                questionCount,
                difficulty,
                timePerQuestion
            }, { withCredentials: true })

            console.log(result.data)
            if (userData) {
                dispatch(setUserData({ ...userData, credits: result.data.creditsLeft }))
            }
            setLoading(false)
            onStart(result.data)

        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className='min-h-screen flex items-center justify-center bg-dawn px-4'>

            <div className='w-full max-w-6xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden'>

                <motion.div
                    initial={{ x: -80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className='relative bg-ink p-12 flex flex-col justify-center border-t-4 border-indigo'>

                    <h2 className="font-display text-4xl text-white mb-6">
                        Start Your Aptitude Test
                    </h2>

                    <p className="text-gray-400 mb-10">
                        Practice company-style aptitude questions powered by AI.
                        Sharpen your logical, quantitative, and verbal skills.
                    </p>

                    <div className='space-y-5'>

                        {
                            [
                                {
                                    icon: <FaBrain className="text-periwinkle text-xl" />,
                                    text: "Choose Category & Difficulty",
                                },
                                {
                                    icon: <FaClock className="text-periwinkle text-xl" />,
                                    text: "Timed MCQ Rounds",
                                },
                                {
                                    icon: <FaChartLine className="text-periwinkle text-xl" />,
                                    text: "Instant Score Report",
                                },
                            ].map((item, index) => (
                                <motion.div key={index}
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 + index * 0.15 }}
                                    whileHover={{ scale: 1.03 }}
                                    className='flex items-center space-x-4 bg-white/5 p-4 rounded-xl cursor-pointer'>
                                    {item.icon}
                                    <span className='text-white font-medium'>{item.text}</span>

                                </motion.div>
                            ))
                        }
                    </div>

                </motion.div>

                <motion.div
                    initial={{ x: 80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className="p-12 bg-white">

                    <h2 className='font-display text-3xl text-ink mb-8'>
                        Test SetUp
                    </h2>

                    <div className='space-y-6'>

                        <div className='relative'>
                            <FaBrain className='absolute top-4 left-4 text-gray-400' />

                            <select value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className='w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo outline-none transition appearance-none'>

                                <option value="Logical Reasoning">Logical Reasoning</option>
                                <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                                <option value="Verbal Ability">Verbal Ability</option>
                                <option value="Data Interpretation">Data Interpretation</option>
                            </select>
                        </div>

                        <div className='relative'>
                            <FaListOl className='absolute top-4 left-4 text-gray-400' />

                            <select value={questionCount}
                                onChange={(e) => setQuestionCount(Number(e.target.value))}
                                className='w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo outline-none transition appearance-none'>

                                <option value={10}>10 Questions</option>
                                <option value={20}>20 Questions</option>
                                <option value={30}>30 Questions</option>
                            </select>
                        </div>

                        <div className='relative'>
                            <FaSignal className='absolute top-4 left-4 text-gray-400' />

                            <select value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className='w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo outline-none transition appearance-none'>

                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>

                        <div className='relative'>
                            <FaClock className='absolute top-4 left-4 text-gray-400' />

                            <select value={timePerQuestion}
                                onChange={(e) => setTimePerQuestion(Number(e.target.value))}
                                className='w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo outline-none transition appearance-none'>

                                <option value={30}>30 sec / question</option>
                                <option value={45}>45 sec / question</option>
                                <option value={60}>60 sec / question</option>
                            </select>
                        </div>

                        <motion.button
                            onClick={handleStart}
                            disabled={loading}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            className='w-full disabled:bg-gray-400 bg-indigo text-white py-3 rounded-full text-lg font-semibold transition duration-300 shadow-md'>
                            {loading ? "Preparing..." : "Start Test"}
                        </motion.button>
                    </div>

                </motion.div>
            </div>

        </motion.div>
    )
}

export default Step1AptitudeSetup