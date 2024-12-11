const express = require("express");
const fs = require("fs");
const router = express.Router();

// GET: List all students
router.get("/", (req, res) => {
  try {
    fs.readFile("./data/students.json", "utf8", (err, data) => {
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

// POST: Add a new student
router.post("/", (req, res) => {
  try {
    fs.readFile("./data/students.json", "utf8", (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return;
      }

      const students = JSON.parse(data);
      const newStudent = {
        id: parseInt(Date.now().toString()),
        ...req.body,
      };
      students.push(newStudent);

      fs.writeFile(
        "./data/students.json",
        JSON.stringify(students, null, 2),
        (err) => {
          if (err) {
            res.status(500).send("Internal server error");
            return;
          }
          res.status(201).json(newStudent);
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// PUT: Update a student
router.put("/:id", (req, res) => {
  try {
    const studentId = req.params.id;
    const updatedStudentInfo = req.body;

    fs.readFile("./data/students.json", "utf8", (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return;
      }

      let students = JSON.parse(data);
      const studentIndex = students.findIndex(
        (student) => student.id === parseInt(studentId)
      );

      if (studentIndex === -1) {
        res.status(404).send("Student not found");
        return;
      }

      students[studentIndex] = {
        ...students[studentIndex],
        ...updatedStudentInfo,
      };

      fs.writeFile(
        "./data/students.json",
        JSON.stringify(students, null, 2),
        (err) => {
          if (err) {
            res.status(500).send("Internal server error");
            return;
          }
          res.json(students[studentIndex]);
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE: Delete a student
router.delete("/:id", (req, res) => {
  try {
    const studentId = req.params.id;

    fs.readFile("./data/students.json", "utf8", (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return;
      }

      let students = JSON.parse(data);
      const studentIndex = students.findIndex(
        (student) => student.id === parseInt(studentId)
      );

      if (studentIndex === -1) {
        res.status(404).send("Student not found");
        return;
      }

      students = students.filter(
        (student) => student.id !== parseInt(studentId)
      );

      fs.writeFile(
        "./data/students.json",
        JSON.stringify(students, null, 2),
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

// GET: Get a student
router.get("/:id", (req, res) => {
  try {
    const studentId = req.params.id;
    fs.readFile("./data/students.json", "utf8", (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return;
      }

      const students = JSON.parse(data);
      const student = students.find(
        (student) => student.id === parseInt(studentId)
      );

      if (!student) {
        res.status(404).send("Student not found");
        return;
      }

      res.json(student);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// GET: Get a student by lesson
router.get("/lesson/:lessonId", (req, res) => {
  try {
    const lessonId = req.params.lessonId;
    fs.readFile("./data/students.json", "utf8", (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return;
      }

      const students = JSON.parse(data);
      const studentsByLesson = students.filter((student) =>
        student.lessons.includes(parseInt(lessonId))
      );

      res.json(studentsByLesson);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// GET: Query students with pagination
router.get("/query", (req, res) => {
  try {
    let filters = { ...req.query };
    const specificFilterKeys = ["class.name"];
    filters = Object.keys(filters).reduce((acc, key) => {
      if (key === "page" || key === "size" || key === "sort") {
        return acc;
      }
      acc[key] = filters[key];
      return acc;
    }, {});

    fs.readFile("./data/students.json", "utf8", (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
        return;
      }

      const students = JSON.parse(data);
      let filteredList = students;

      if (Object.keys(filters).length !== 0) {
        filteredList = filteredList.filter((student) => {
          // Check if all filters are satisfied
          return Object.entries(filters).every(([key, value]) => {
            // Check if the key is a object key

            // Eg. if there is a filter like class.name=5A, check class.name

            // If the key is not in the student object or key is specific , return true to filter out
            if (!(key in student)  && !specificFilterKeys.includes(key)) {
              return true;
            }

            if (key === "class.name") {
              return student["class"]["className"]
                .toString()
                .toLocaleLowerCase()
                .includes(value.toLocaleLowerCase());
            } else if (key === "id") {
              return student[key] === parseInt(value);
            } else {
              return student[key]
                .toString()
                .toLocaleLowerCase()
                .includes(value.toLocaleLowerCase());
            }
          });
        });
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
