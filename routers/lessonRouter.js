const express = require('express');
const fs = require('fs');
const router = express.Router();

// GET: List all lessons
router.get('/', (req, res) => {
  fs.readFile('./data/lessons.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Internal server error');
      return;
    }
    res.json(JSON.parse(data));
  });
});

// POST: Add a new lesson
router.post('/', (req, res) => {
  fs.readFile('./data/lessons.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Internal server error');
      return;
    }

    const lessons = JSON.parse(data);
    const newLesson = {
      id: parseInt(Date.now().toString()),
      ...req.body,
    };
    lessons.push(newLesson);

    fs.writeFile('./data/lessons.json', JSON.stringify(lessons, null, 2), (err) => {
      if (err) {
        res.status(500).send('Internal server error');
        return;
      }
      res.status(201).json(newLesson);
    });
  });
});

// PUT: Update a lesson
router.put('/:id', (req, res) => {
  const lessonId = req.params.id;
  const updatedLessonInfo = req.body;

  fs.readFile('./data/lessons.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Internal server error');
      return;
    }

    let lessons = JSON.parse(data);
    const lessonIndex = lessons.findIndex((lesson) => lesson.id === parseInt(lessonId));

    if (lessonIndex === -1) {
      res.status(404).send('Lesson not found');
      return;
    }

    lessons[lessonIndex] = {
      ...lessons[lessonIndex],
      ...updatedLessonInfo,
    };

    fs.writeFile('./data/lessons.json', JSON.stringify(lessons, null, 2), (err) => {
      if (err) {
        res.status(500).send('Internal server error');
        return;
      }
      res.json(lessons[lessonIndex]);
    });
  });
});

// DELETE: Delete a lesson
router.delete('/:id', (req, res) => {
  const lessonId = req.params.id;

  fs.readFile('./data/lessons.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Internal server error');
      return;
    }

    let lessons = JSON.parse(data);
    const lessonIndex = lessons.findIndex((lesson) => lesson.id === parseInt(lessonId));

    if (lessonIndex === -1) {
      res.status(404).send('Lesson not found');
      return;
    }

    lessons.splice(lessonIndex, 1);

    fs.writeFile('./data/lessons.json', JSON.stringify(lessons, null, 2), (err) => {
      if (err) {
        res.status(500).send('Internal server error');
        return;
      }
      res.send('Lesson deleted');
    });
  });
});

// GET: Get a lesson by ID
router.get('/:id', (req, res) => {
  const lessonId = req.params.id;

  fs.readFile('./data/lessons.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Internal server error');
      return;
    }

    const lessons = JSON.parse(data);
    const lesson = lessons.find((lesson) => lesson.id === parseInt(lessonId));

    if (!lesson) {
      res.status(404).send('Lesson not found');
      return;
    }

    res.json(lesson);
  });
});

// GET: Query lessons
router.get('/query', (req, res) => {

  try {
    let filters = {...req.query};
        filters = Object.keys(filters).reduce((acc, key) => {
          if (key === "page" || key === "size" || key === "sort") {
            return acc;
          }
          acc[key] = filters[key];
          return acc;
        }, {});
  
    fs.readFile('./data/lessons.json', 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Internal server error');
        return;
      }
  
      const lessons = JSON.parse(data);
      const filteredList = lessons;

      if (Object.keys(filters).length !== 0) {
        filteredList = filteredList.filter(
          (lesson) => {
            // Check if all filters are satisfied
            return Object.entries(filters).every(([key, value]) => {
              if (!(key in lesson)) {
                return true;
              }

              if (key === 'id') {
                return lesson[key] === parseInt(value);
              }else{
                return lesson[key].toString().toLocaleLowerCase().includes(value.toLocaleLowerCase());
              }
            });
          }
        );
      }
  
      filters.page = filters.page || 0;
      filters.size = filters.size || 20;
      const startIndex = parseInt(filters.page) * filters.size;
      const endIndex = (parseInt(filters.page) + 1) * filters.size;

      // Send the results to the client
      res.json({
        number: parseInt(filters.page),
        size: filters.size,
        sort: {
          sorted: false,
          unsorted: true,
          empty: true,
        },
        totalPages: Math.ceil(filteredList.length / filters.size),
        totalElements: filteredList.length,
        processDurationMs: null,
        content: filteredList.slice(startIndex, endIndex),
      });

    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
    
  }
});

module.exports = router;