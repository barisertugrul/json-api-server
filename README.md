# Express JSON API Server

This project creates a JSON-based API server using Express.js. Below you will find information on setup, existing data files, APIs, and how to use the APIs.

## Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/barisertugrul/json-api-server
   cd json-api-server
    ```

2. **Install the necessary dependencies:**

    ```sh
    npm install
     ```

3. **Start the server:**

   ```sh
    npm start
    ```

4. **Existing Data Files**

   - classes.json: Contains class information.
   - lessons.json: Contains lesson information.
   - schoolInformation.json: Contains school information.
   - students.json: Contains student information.
   - teachers.json: Contains teacher information.

5. **APIs and Usage**

***Classes***

- List all classes:
    `GET /api/class`
- Add a new class:
    `POST /api/class`

    ```
    Content-Type: application/json

    {
        "className": "New Class",
        "teacher": {
            "id": 6,
            "name": "New Teacher",
            "email": "<new.teacher@example.com>",
            "phone": "tel:123-456-7896",
            "address": "123 Main Street, Springfield, IL 62706"
        }
    }
    ```

- Update a class:
    `PUT /api/class/:id`

    ```
    Content-Type: application/json
    {
        "className": "Updated Class"
    }
    ```

- Delete a class:
    `DELETE /api/class/:id`

***Lessons***

- List all lessons:
    `GET /api/lesson`

- Add a new lesson:
    `POST /api/lesson`

    ```
    Content-Type: application/json
    {
        "title": "New Lesson",
        "description": "This is a new lesson",
        "content": "Lesson content"
    }
    ```
    
- Update a lesson:
    `PUT /api/lesson/:id`

    ```
    Content-Type: application/json
    {
        "title": "Updated Lesson"
    }
    ```
    
- Delete a lesson:
    `DELETE /api/lesson/:id`


***School Information***

- Get school information:
    `GET /api/schoolInformation`

- Update school information:
    `PUT /api/schoolInformation`

    ```
    Content-Type: application/json
    {
        "schoolName": "Updated School Name"
    }
    ```

***Students***

- List all students:
    `GET /api/student`

- Add a new student:
    `POST /api/student`

    ```
    Content-Type: application/json
    {
        "name": "New Student",
        "class": {
            "id": 107,
            "className": "New Class"
        },
        "lessons": [
            {
                "id": 21,
                "title": "New Lesson"
            }
        ]
    }
    ```
    
- Update a student:
    `PUT /api/student/:id`

    ```
    Content-Type: application/json
    {
        "name": "Updated Student"
    }
    ```

- Delete a student:
    `DELETE /api/student/:id`

***Teachers***

- List all teachers:
    `GET /api/teacher`

- Add a new teacher:
    `POST /api/teacher`

    ```
    Content-Type: application/json
    {
        "name": "New Teacher",
        "email": "<new.teacher@example.com>",
        "phone": "tel:123-456-7896",
        "address": "123 Main Street, Springfield, IL 62706"
   }
   ```
    
- Update a teacher:
   `PUT /api/teacher/:id`

   ```
    Content-Type: application/json
    {
        "name": "Updated Teacher"
    }
   ```
    
- Delete a teacher:
   `DELETE /api/teacher/:id`

**Environment Variables**
   You can specify the port the server will run on with the PORT variable in the .env file. The default port is 3001.

   With this information, you can easily set up and use your API server.
