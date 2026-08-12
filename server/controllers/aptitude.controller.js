import { askAi } from "../services/openRouter.service.js";
import User from "../models/user.model.js";
import Aptitude from "../models/aptitude.model.js";

const CREDIT_COST = 30;

export const generateQuestions = async (req, res) => {
  try {
    let { category, questionCount, difficulty, timePerQuestion } = req.body;

    category = category?.trim();
    difficulty = difficulty?.trim();
    questionCount = Number(questionCount);
    timePerQuestion = Number(timePerQuestion);

    if (!category || !difficulty || !questionCount || !timePerQuestion) {
      return res.status(400).json({
        message: "Category, difficulty, questionCount and timePerQuestion are required."
      });
    }

    if (![10, 20, 30].includes(questionCount)) {
      return res.status(400).json({ message: "Invalid question count." });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.credits < CREDIT_COST) {
      return res.status(400).json({
        message: `Not enough credits. Minimum ${CREDIT_COST} required.`
      });
    }

    const messages = [
      {
        role: "system",
        content: `
You are an expert exam-question writer creating aptitude test questions for job placement practice, similar to those asked by companies like TCS, Infosys, and Accenture.

Generate exactly ${questionCount} multiple choice questions for the category "${category}" at "${difficulty}" difficulty.

Strict Rules:
- Each question must have exactly 4 options.
- Exactly one option must be correct.
- correctAnswer must be an exact string match to one of the options.
- Do not repeat questions.
- Do not add explanations, numbering, or extra text.
- Return ONLY valid JSON, no markdown fences, no commentary.

Return strictly in this JSON format:

{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "string"
    }
  ]
}
`
      },
      {
        role: "user",
        content: `Generate ${questionCount} ${difficulty} level ${category} MCQs.`
      }
    ];

    const aiResponse = await askAi(messages);

    if (!aiResponse || !aiResponse.trim()) {
      return res.status(500).json({ message: "AI returned empty response." });
    }

    // strip markdown fences if the model wraps the JSON despite instructions
    const cleaned = aiResponse.trim()
      .replace(/^```json/i, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("Failed to parse AI JSON:", cleaned);
      return res.status(500).json({ message: "AI returned invalid format." });
    }

    const questions = parsed?.questions;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(500).json({ message: "AI failed to generate questions." });
    }

    // basic validation of each question shape
    const validQuestions = questions.filter(q =>
      q.question &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      q.correctAnswer &&
      q.options.includes(q.correctAnswer)
    );

    if (validQuestions.length === 0) {
      return res.status(500).json({ message: "AI returned malformed questions." });
    }

    user.credits -= CREDIT_COST;
    await user.save();

    const aptitude = await Aptitude.create({
      userId: user._id,
      category,
      difficulty,
      timePerQuestion,
      questions: validQuestions
    });

    // attach the mongo _id as "id" for the frontend to reference per question
    const responseQuestions = aptitude.questions.map((q) => ({
      id: q._id,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer
    }));

    res.json({
      aptitudeId: aptitude._id,
      creditsLeft: user.credits,
      category,
      difficulty,
      timePerQuestion,
      questions: responseQuestions
    });

  } catch (error) {
    return res.status(500).json({ message: `failed to create aptitude test ${error}` });
  }
};

export const submitAptitude = async (req, res) => {
  try {
    const { aptitudeId, breakdown, correctCount, score } = req.body;

    if (!aptitudeId || !Array.isArray(breakdown)) {
      return res.status(400).json({ message: "aptitudeId and breakdown are required." });
    }

    const aptitude = await Aptitude.findOne({ _id: aptitudeId, userId: req.userId });

    if (!aptitude) {
      return res.status(404).json({ message: "Aptitude test not found." });
    }

    // map chosenAnswer/isCorrect from the client-scored breakdown onto each subdocument
    breakdown.forEach((item) => {
      const question = aptitude.questions.id(item.id);
      if (question) {
        question.chosenAnswer = item.chosenAnswer;
        question.isCorrect = item.isCorrect;
      }
    });

    aptitude.correctCount = correctCount;
    aptitude.score = score;
    aptitude.status = "completed";

    await aptitude.save();

    return res.status(200).json({ message: "Aptitude test saved.", aptitudeId: aptitude._id });

  } catch (error) {
    return res.status(500).json({ message: `failed to submit aptitude test ${error}` });
  }
};

export const getMyAptitudes = async (req, res) => {
  try {
    const aptitudes = await Aptitude.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select("category difficulty score correctCount status createdAt questions");

    const summary = aptitudes.map((a) => ({
      _id: a._id,
      category: a.category,
      difficulty: a.difficulty,
      score: a.score,
      correctCount: a.correctCount,
      totalQuestions: a.questions.length,
      status: a.status,
      createdAt: a.createdAt,
    }));

    return res.status(200).json(summary);

  } catch (error) {
    return res.status(500).json({ message: `failed to find current user aptitude tests ${error}` });
  }
};

export const getAptitudeReport = async (req, res) => {
  try {
    const aptitude = await Aptitude.findOne({ _id: req.params.id, userId: req.userId });

    if (!aptitude) {
      return res.status(404).json({ message: "Aptitude test not found." });
    }

    return res.json({
      category: aptitude.category,
      difficulty: aptitude.difficulty,
      totalQuestions: aptitude.questions.length,
      correctCount: aptitude.correctCount,
      score: aptitude.score,
      breakdown: aptitude.questions.map((q) => ({
        id: q._id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        chosenAnswer: q.chosenAnswer,
        isCorrect: q.isCorrect,
      })),
    });

  } catch (error) {
    return res.status(500).json({ message: `failed to find aptitude report ${error}` });
  }
};