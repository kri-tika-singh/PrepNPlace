import mongoose from "mongoose";

const aptitudeQuestionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    correctAnswer: String,
    chosenAnswer: { type: String, default: null },
    isCorrect: { type: Boolean, default: false },
})

const aptitudeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        required: true
    },
    timePerQuestion: {
        type: Number,
        required: true
    },
    questions: [aptitudeQuestionSchema],

    correctCount: { type: Number, default: 0 },
    score: { type: Number, default: 0 },

    status: {
        type: String,
        enum: ["Incompleted", "completed"],
        default: "Incompleted",
    }
}, { timestamps: true })

const Aptitude = mongoose.model("Aptitude", aptitudeSchema)

export default Aptitude