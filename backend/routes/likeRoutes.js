const {
  toggleLikeLaporan,
} = require("../controller/likeController");

router.post(
  "/:id/like",
  authMiddleware,
  toggleLikeLaporan
);