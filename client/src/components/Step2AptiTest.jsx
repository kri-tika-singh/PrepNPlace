import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from "motion/react"
import { FaClock } from "react-icons/fa";
import axios from "axios"
import { ServerUrl } from '../App';

function Step2AptitudeTest({ interviewData, onFinish }) {
    const questions = interviewData?.questions || [];
    const timePerQuestion = interviewData?.timePerQuestion || 45;
    const aptitudeId = interviewData?.aptitudeId;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionId: chosenOption }
    const [timeLeft, setTimeLeft] = useState(timePerQuestion);
    const [submitting, setSubmitting] = useState(false);

    const currentQuestion = questions[currentIndex];
    const isLastQuestion = currentIndex === questions.length - 1;

    const buildReport = useCallback((finalAnswers) => {
        let correctCount = 0;
        const breakdown = questions.map((q) => {
            const chosen = finalAnswers[q.id] ?? null;
            const isCorrect = chosen === q.correctAnswer;
            if (isCorrect) correctCount++;
            return {
                id: q.id,
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
                chosenAnswer: chosen,
                isCorrect
            }
        });

        return {
            aptitudeId,
            category: interviewData?.category,
            difficulty: interviewData?.difficulty,
            totalQuestions: questions.length,
            correctCount,
            score: questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0,
            breakdown
        }
    }, [questions, interviewData, aptitudeId]);

    const submitReport = async (report) => {
        if (!aptitudeId) {
            // no session id available (shouldn't happen), just show the report without persisting
            onFinish(report);
            return;
        }

        setSubmitting(true);
        try {
            await axios.post(ServerUrl + "/api/aptitude/submit", {
                aptitudeId: report.aptitudeId,
                breakdown: report.breakdown,
                correctCount: report.correctCount,
                score: report.score
            }, { withCredentials: true });

        } catch (error) {
            console.log(error);
            // even if saving to history fails, still show the user their result
        } finally {
            setSubmitting(false);
            onFinish(report);
        }
    }

    const goToNext = useCallback((answersSoFar) => {
        if (isLastQuestion) {
            submitReport(buildReport(answersSoFar));
        } else {
            setCurrentIndex((prev) => prev + 1);
            setTimeLeft(timePerQuestion);
        }
    }, [isLastQuestion, buildReport, timePerQuestion]);

    // countdown timer per question
    useEffect(() => {
        if (!currentQuestion) return;

        if (timeLeft <= 0) {
            goToNext(selectedAnswers);
            return;
        }

        const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft, currentQuestion, goToNext, selectedAnswers]);

    const handleSelect = (option) => {
        setSelectedAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }));
    }

    const handleNext = () => {
        goToNext(selectedAnswers);
    }

    if (!currentQuestion) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-dawn'>
                <p className='text-gray-600 text-lg'>No questions available.</p>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className='min-h-screen bg-dawn px-6 py-14 md:px-16 md:py-20'>

            <div className='w-full max-w-2xl mx-auto'>

                <div className='flex items-center justify-between mb-3'>
                    <span className='text-ink font-medium text-sm'>
                        Question {currentIndex + 1} of {questions.length}
                    </span>

                    <div className='flex items-center space-x-2 px-4 py-1.5 rounded-full bg-ink text-white'>
                        <FaClock size={13} />
                        <span className='font-medium text-sm'>{timeLeft}s</span>
                    </div>
                </div>

                <div className='w-full bg-mist rounded-full h-1 mb-9'>
                    <motion.div
                        className='bg-indigo h-1 rounded-full'
                        animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                        transition={{ duration: 0.4 }}
                    />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion.id}
                        initial={{ x: 40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -40, opacity: 0 }}
                        transition={{ duration: 0.3 }}>

                        <p className='text-sm text-moss font-medium mb-2 tracking-wide'>
                            {interviewData?.category?.toUpperCase() || "APTITUDE"}
                        </p>

                        <h2 className='font-display text-3xl text-ink leading-snug mb-9'>
                            {currentQuestion.question}
                        </h2>

                        <div className='space-y-3 mb-9'>
                            {currentQuestion.options.map((option, i) => {
                                const isSelected = selectedAnswers[currentQuestion.id] === option;
                                return (
                                    <motion.div
                                        key={i}
                                        onClick={() => handleSelect(option)}
                                        whileHover={{ scale: 1.01 }}
                                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition
                                            ${isSelected
                                                ? 'border-indigo bg-periwinkle/10 text-ink'
                                                : 'border-gray-200 bg-white hover:border-indigo/40'}`}>
                                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium shrink-0
                                            ${isSelected ? 'bg-indigo text-white' : 'bg-gray-100 text-gray-500'}`}>
                                            {String.fromCharCode(65 + i)}
                                        </span>
                                        <span className='font-medium'>{option}</span>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className='flex justify-end'>
                    <motion.button
                        onClick={handleNext}
                        disabled={submitting}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        className='disabled:bg-gray-400 bg-indigo text-white px-8 py-3 rounded-full text-base font-semibold transition duration-300 shadow-md'>
                        {submitting ? "Saving..." : isLastQuestion ? "Submit Test" : "Next Question"}
                    </motion.button>
                </div>

            </div>
        </motion.div>
    )
}

export default Step2AptitudeTest