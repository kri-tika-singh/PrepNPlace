import Step1AptitudeSetup from '../components/Step1AptiSetUp'
import Step2AptitudeTest from '../components/Step2AptiTest'
import Step3AptitudeReport from '../components/Step3AptiReport'
import { useState } from 'react'
function AptitudePage() {
    const [step, setStep] = useState(1)
    const [aptitudeData, setAptitudeData] = useState(null)

    return (
        <div className='min-h-screen bg-gray-50'>
            {step === 1 && (
                <Step1AptitudeSetup onStart={(data) => {
                    setAptitudeData(data);
                    setStep(2)
                }} />
            )}
            {step === 2 && (
                <Step2AptitudeTest interviewData={aptitudeData}
                    onFinish={(report) => {
                        setAptitudeData(report);
                        setStep(3)
                    }}
                />
            )}
            {step === 3 && (
                <Step3AptitudeReport report={aptitudeData} />
            )}
        </div>
    )
}

export default AptitudePage