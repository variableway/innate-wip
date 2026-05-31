# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-express/
# Original language: javascript
# Normalized: js
# Block index: 31

const userRouter = express.Router();
userRouter.get("/v1/user", (req, res) => res.send("User API v1"));
app.use("/", userRouter);