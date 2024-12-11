const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Routers
const schoolInformationRouter = require('./routers/schoolInformationRouter');
const studentRouter = require('./routers/studentRouter');
const classRouter = require('./routers/classRouter');
const teacherRouter = require('./routers/teacherRouter');
const lessonRouter = require('./routers/lessonRouter');
const jwtRouter = require('./routers/old/jwtRouter');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/schoolInformation', schoolInformationRouter);
app.use('/api/student', studentRouter);
app.use('/api/class', classRouter);
app.use('/api/teacher', teacherRouter);
app.use('/api/lesson', lessonRouter);
app.use('/api/auth', jwtRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});