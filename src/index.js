const express = require('express');
const port = process.env.PORT || 7788;
const userRouter = require('./routers/user');
const taskRoutes = require('./routers/task');

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRoutes);

app.listen(port, () => {
    console.log(`Listening on port:${port}`);
});
