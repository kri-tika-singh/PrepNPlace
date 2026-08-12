import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from "axios"
import { ServerUrl } from '../App'
import Step3AptitudeReport from '../components/Step3AptiReport'

function AptitudeReport() {
    const { id } = useParams()
    const [report, setReport] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getReport = async () => {
            try {
                const result = await axios.get(ServerUrl + `/api/aptitude/report/${id}`, { withCredentials: true })
                setReport(result.data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        getReport()

    }, [id])

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <p className='text-gray-500 text-lg'>Loading report...</p>
            </div>
        )
    }

    return <Step3AptitudeReport report={report} />
}

export default AptitudeReport