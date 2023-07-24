const express = require("express");
const bookRouter = require("./bookRoutes");
const authRouter = require("./auth")
const PORT = 8000;

const app = express();
app.use(express.json());
app.use('/api', bookRouter);
app.use('/auth', authRouter);

app.listen(PORT, () => console.log(`server started on http://localhost:${PORT}`));