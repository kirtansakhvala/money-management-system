const express = require("express")
const { getDashboardSummary, getAnalytics } = require("../controllers/reportController")
const { protect } = require("../middleware/authMiddleware")

const router = express.Router()

router.use(protect)

router.get("/summary", getDashboardSummary)
router.get("/analytics", getAnalytics)

module.exports = router
