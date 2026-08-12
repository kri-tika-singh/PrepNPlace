import React, { useState } from 'react'
import { motion, AnimatePresence } from "motion/react"
import { FaCheckCircle, FaTimesCircle, FaChevronDown, FaTrophy, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function Step3AptitudeReport({ report }) {
    const navigate = useNavigate();
    const [expandedId, setExpandedId] = useState(null);

    if (!report) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-dawn'>
                <p className='text-gray-600 text-lg'>No report available.</p>
            </div>
        )
    }

    const { category, difficulty, totalQuestions, correctCount, score, breakdown } = report;
    const incorrectCount = totalQuestions - correctCount;

    const scoreColor = score >= 70 ? 'text-indigo' : score >= 40 ? 'text-straw' : 'text-red-600';
    const ringColor = score >= 70 ? '#4A5A8C' : score >= 40 ? '#C4B896' : '#dc2626';

    let performanceText = "";
    let shortTagline = "";

    if (score >= 70) {
        performanceText = "Strong performance.";
        shortTagline = "Solid grasp of core concepts.";
    } else if (score >= 40) {
        performanceText = "Room to improve.";
        shortTagline = "Review the missed questions below.";
    } else {
        performanceText = "Needs more practice.";
        shortTagline = "Revisit fundamentals and try again.";
    }

    const toggleExpand = (id) => {
        setExpandedId((prev) => (prev === id ? null : id));
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className='min-h-screen bg-dawn px-4 sm:px-6 lg:px-10 py-8'>

            <div className='mb-8 w-full flex items-start gap-4 flex-wrap'>
                <button
                    onClick={() => navigate('/')}
                    className='mt-1 p-3 rounded-full bg-white shadow hover:shadow-md transition'>
                    <FaArrowLeft className='text-gray-600' />
                </button>

                <div>
                    <h1 className='font-display text-3xl text-ink'>
                        Aptitude analytics dashboard
                    </h1>
                    <p className='text-gray-500 mt-2'>
                        {category} · {difficulty} difficulty
                    </p>
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>

                <div className='space-y-6'>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className='bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 text-center'>

                        <div className='flex justify-center mb-4'>
                            <div className='bg-sage-panel p-4 rounded-full'>
                                <FaTrophy className='text-3xl text-indigo' />
                            </div>
                        </div>

                        <p className="text-gray-500 mb-6 text-sm">Overall score</p>

                        <div className='flex items-center justify-center mb-6'>
                            <svg width="140" height="140" viewBox="0 0 160 160">
                                <circle cx="80" cy="80" r="70" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                                <motion.circle
                                    cx="80" cy="80" r="70" fill="none"
                                    stroke={ringColor}
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                    strokeDasharray={2 * Math.PI * 70}
                                    initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                                    animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - score / 100) }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    transform="rotate(-90 80 80)"
                                />
                                <text x="80" y="88" textAnchor="middle" className={`text-3xl font-semibold ${scoreColor}`} fill="currentColor">
                                    {score}%
                                </text>
                            </svg>
                        </div>

                        <p className="text-gray-400 text-xs sm:text-sm mb-4">
                            {correctCount} / {totalQuestions} correct
                        </p>

                        <div className="mb-2">
                            <p className="font-semibold text-ink text-sm sm:text-base">
                                {performanceText}
                            </p>
                            <p className="text-gray-500 text-xs sm:text-sm mt-1">
                                {shortTagline}
                            </p>
                        </div>

                        <motion.button
                            onClick={() => navigate('/')}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            className='mt-6 bg-indigo text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition'>
                            Back to home
                        </motion.button>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className='bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8'>

                        <div className='grid grid-cols-2 gap-4'>
                            <div className='bg-sage-panel rounded-xl p-4 text-center'>
                                <p className='text-2xl font-bold text-moss'>{correctCount}</p>
                                <p className='text-gray-500 text-sm'>Correct</p>
                            </div>
                            <div className='bg-red-50 rounded-xl p-4 text-center'>
                                <p className='text-2xl font-bold text-red-600'>{incorrectCount}</p>
                                <p className='text-gray-500 text-sm'>Incorrect</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className='lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8'>

                    <h3 className='text-base sm:text-lg font-semibold text-ink mb-6'>Question review</h3>

                    <div className='space-y-3'>
                        {breakdown.map((item, index) => (
                            <div key={item.id} className={`border rounded-xl overflow-hidden ${expandedId === item.id ? 'border-indigo' : 'border-gray-200'}`}>

                                <div
                                    onClick={() => toggleExpand(item.id)}
                                    className='flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition'>

                                    <div className='flex items-center space-x-3'>
                                        {item.isCorrect
                                            ? <FaCheckCircle className='text-moss flex-shrink-0' />
                                            : <FaTimesCircle className='text-red-600 flex-shrink-0' />}
                                        <span className='text-ink font-medium text-sm sm:text-base'>
                                            Q{index + 1}. {item.question}
                                        </span>
                                    </div>

                                    <motion.div
                                        animate={{ rotate: expandedId === item.id ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}>
                                        <FaChevronDown className={`flex-shrink-0 ${expandedId === item.id ? 'text-indigo' : 'text-gray-400'}`} />
                                    </motion.div>
                                </div>

                                <AnimatePresence>
                                    {expandedId === item.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className='overflow-hidden'>

                                            <div className='p-4 pt-0 space-y-2'>
                                                {item.options.map((option, i) => {
                                                    const isChosen = option === item.chosenAnswer;
                                                    const isCorrectOption = option === item.correctAnswer;

                                                    let style = 'border-gray-200 text-gray-600';
                                                    if (isCorrectOption) style = 'border-moss bg-sage-panel text-moss';
                                                    else if (isChosen && !isCorrectOption) style = 'border-red-300 bg-red-50 text-red-700';

                                                    return (
                                                        <div key={i} className={`p-3 rounded-lg border ${style} flex items-center justify-between text-sm`}>
                                                            <span>{option}</span>
                                                            {isChosen && <span className='text-xs font-semibold'>Your answer</span>}
                                                            {isCorrectOption && !isChosen && <span className='text-xs font-semibold'>Correct answer</span>}
                                                        </div>
                                                    )
                                                })}
                                                {!item.chosenAnswer && (
                                                    <p className='text-sm text-gray-400 italic pt-1'>Not answered (time ran out)</p>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                </motion.div>

            </div>
        </motion.div>
    )
}

export default Step3AptitudeReport