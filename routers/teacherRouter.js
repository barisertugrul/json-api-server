const express = require("express");
const fs = require("fs");
const router = express.Router();

// GET: List all teachers
router.get("/", (req, res) => {
  try {
    fs.readFile("./data/teachers.json", "utf8", (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return;
      }
      res.json(JSON.parse(data));
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// POST: Add a new teacher
router.post("/", (req, res) => {
  try {
    fs.readFile("./data/teachers.json", "utf8", (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return;
      }

      const teachers = JSON.parse(data);
      const newTeacher = {
        id: parseInt(Date.now().toString()),
        ...req.body,
      };
      teachers.push(newTeacher);

      fs.writeFile(
        "./data/teachers.json",
        JSON.stringify(teachers, null, 2),
        (err) => {
          if (err) {
            res.status(500).send("Internal server error");
            return;
          }
          res.status(201).json(newTeacher);
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// PUT: Update a teacher
router.put("/:id", (req, res) => {
  try {
    const teacherId = req.params.id;
    const updatedTeacherInfo = req.body;

    fs.readFile("./data/teachers.json", "utf8", (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return;
      }

      const teachers = JSON.parse(data);
      const teacherIndex = teachers.findIndex(
        (teacher) => teacher.id === parseInt(teacherId)
      );

      if (teacherIndex === -1) {
        res.status(404).send("Teacher not found");
        return;
      }

      const updatedTeacher = { ...teachers[teacherIndex], ...updatedTeacherInfo };
      teachers[teacherIndex] = updatedTeacher;

      fs.writeFile(
        "./data/teachers.json",
        JSON.stringify(teachers, null, 2),
        (err) => {
          if (err) {
            res.status(500).send("Internal server error");
            return;
          }
          res.json(updatedTeacher);
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE: Delete a teacher
router.delete("/:id", (req, res) => {
  try {
    const teacherId = req.params.id;

    fs.readFile("./data/teachers.json", "utf8", (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return;
      }

      let teachers = JSON.parse(data);
      const teacherIndex = teachers.findIndex(
        (teacher) => teacher.id === parseInt(teacherId)
      );

      if (teacherIndex === -1) {
        res.status(404).send("Teacher not found");
        return;
      }

      teachers = teachers.filter((teacher) => teacher.id !== parseInt(teacherId));

      fs.writeFile(
        "./data/teachers.json",
        JSON.stringify(teachers, null, 2),
        (err) => {
          if (err) {
            res.status(500).send("Internal server error");
            return;
          }
          res.status(204).send();
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// GET: Query teachers with pagination
router.get("/query", (req, res) => {
  try {
    let filters = {...req.query};
        filters = Object.keys(filters).reduce((acc, key) => {
          if (key === "page" || key === "size" || key === "sort") {
            return acc;
          }
          acc[key] = filters[key];
          return acc;
        }, {});

    fs.readFile("./data/teachers.json", "utf8", (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return;
      }

      const teachers = JSON.parse(data);
      const filteredList = teachers;

      if (Object.keys(filters).length !== 0) {
        filteredList = filteredList.filter(
          (teacher) => {
            // Check if all filters are satisfied
            return Object.entries(filters).every(([key, value]) => {
              if (!(key in teacher)) {
                return true;
              }

              if (key === 'id') {
                return teacher[key] === parseInt(value);
              }else{
                return teacher[key].toString().toLocaleLowerCase().includes(value.toLocaleLowerCase());
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