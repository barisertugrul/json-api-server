const express = require("express");
const fs = require("fs");
const router = express.Router();

// GET: List all classes
router.get("/", (req, res) => {
  try {
    fs.readFile("./data/classes.json", "utf8", (err, data) => {
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

// POST: Add a new class
router.post("/", (req, res) => {
  try {
    fs.readFile("./data/classes.json", "utf8", (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return;
      }

      const classes = JSON.parse(data);
      const newClass = {
        id: parseInt(Date.now().toString()),
        ...req.body,
      };
      classes.push(newClass);

        fs.writeFile(
            "./data/classes.json",
            JSON.stringify(classes, null, 2),
            (err) => {
                if (err) {
                res.status(500).send("Internal server error");
                return;
                }
                res.status(201).json(newClass);
            }
        );
    }
    );
    } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
    }
}
);

// PUT: Update a class
router.put("/:id", (req, res) => {
    try {
        const classId = req.params.id;
        const updatedClassInfo = req.body

        fs.readFile("./data/classes.json", "utf8", (err, data) => {
            if (err) {
                res.status(500).send("Internal server error");
                return;
            }

            let classes = JSON.parse(data);
            const classIndex = classes.findIndex((class_) => class_.id === parseInt(classId));

            if (classIndex === -1) {
                res.status(404).send("Class not found");
                return;
            }

            classes[classIndex] = {
                ...classes[classIndex],
                ...updatedClassInfo,
            };

            fs.writeFile(
                "./data/classes.json",
                JSON.stringify(classes, null, 2),
                (err) => {
                    if (err) {
                        res.status(500).send("Internal server error");
                        return;
                    }
                    res.json(classes[classIndex]);
                }
            );
        }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}
);

// DELETE: Delete a class
router.delete("/:id", (req, res) => {
    try {
        const classId = req.params.id;

        fs.readFile("./data/classes.json", "utf8", (err, data) => {
            if (err) {
                res.status(500).send("Internal server error");
                return;
            }

            let classes = JSON.parse(data);
            const classIndex = classes.findIndex((class_) => class_.id === parseInt(classId));

            if (classIndex === -1) {
                res.status(404).send("Class not found");
                return;
            }

            classes = classes.filter((class_) => class_.id !== parseInt(classId));

            fs.writeFile(
                "./data/classes.json",
                JSON.stringify(classes, null, 2),
                (err) => {
                    if (err) {
                        res.status(500).send("Internal server error");
                        return;
                    }
                    res.send("Class deleted successfully");
                }
            );
        }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}
);

// GET: Query class with pagination
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

        fs.readFile("./data/classes.json", "utf8", (err, data) => {
            if (err) {
                res.status(500).send("Internal server error");
                return;
            }

            const classes = JSON.parse(data);
            const filteredList = classes;

      if (Object.keys(filters).length !== 0) {
        filteredList = filteredList.filter(
          (classroom) => {
            // Check if all filters are satisfied
            return Object.entries(filters).every(([key, value]) => {
              if (!(key in classroom)) {
                return true;
              }

              if (key === 'id') {
                return classroom[key] === parseInt(value);
              }else{
                return classroom[key].toString().toLocaleLowerCase().includes(value.toLocaleLowerCase());
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
    }
    );
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// GET: Get a class by teacher id
router.get("/teacher/:teacherId", (req, res) => {
    try {
        const teacherId = req.params.teacherId;

        fs.readFile("./data/classes.json", "utf8", (err, data) => {
            if (err) {
                res.status(500).send("Internal server error");
                return;
            }

            const classes = JSON.parse(data);
            const filteredList = classes.filter((class_) => class_.teacherId === parseInt(teacherId));

            res.json(filteredList);
        }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}   
);

module.exports = router;
        