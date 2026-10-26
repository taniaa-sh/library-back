import express from "express";
import { ReviewService } from "./review.service";
import { authMiddleware, AuthRequest } from "../../middlewares/jwtAuth";

const router = express.Router();
const reviewService = new ReviewService();

router.post(
    "/addReview",
    authMiddleware,
    async (req: AuthRequest, res) => {
        try {
            const { bookId, rating, comment } = req.body;
            const userId = req.user?._id;
            console.log(userId);

            if (!userId) {
                return res.status(401).json({
                    message: "Please log in to submit a review",
                });
            }

            if (
                !bookId ||
                rating === undefined ||
                rating === null ||
                !comment
            ) {
                return res.status(400).json({
                    message: "bookId, rating and comment are required",
                });
            }

            const result = await reviewService.addReview(
                (bookId),
                String(userId),
                Number(rating),
                comment
            );

            return res.status(200).json({
                message: "Review submitted successfully",
                data: result,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to submit review";

            if (
                message === "Invalid bookId or userId" ||
                message === "Rating must be an integer between 1 and 5" ||
                message ===
                "Comment is required and must be at most 1000 characters"
            ) {
                return res.status(400).json({ message });
            }

            if (message === "Book not found") {
                return res.status(404).json({ message });
            }

            console.error("Add review error:", error);

            return res.status(500).json({
                message: "Failed to submit review",
            });
        }
    }
);

router.get('/getAll', async (req, res) => {
    const result = await reviewService.getAll();

    return res.json(result);
});

export default router;