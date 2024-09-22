# Reading Recommendation System APIs

## Description
Reading Recommendation System allows users to submit their reading intervals and recommends the top-rated books based on the number of unique pages read by all users.

## System Overview
The Reading Recommendation System provides two main operations:
1. Allow users to submit an interval of starting and ending pages that they read for a specific book. Users can submit multiple intervals for the same book.
2. Show the top five books in the system, based on the number of unique pages read by all users (sorted from most read pages to least read pages).

## Technical Overview

This project has been created in a <b>Modular Monolithic Architecture</b> using:

- NestJs
- Postgres DB
- Clean Architecture
- Repository Pattern
- Code First using Sequlize ORM
- Entity Folder Structure
- Authentication
- Authorization (Role-Based)
- Logging and Exception Handling


## Prerequisites

- ### Database

    Create a new database in Postgres (Ex: reading-recommendations)


- ### Project

    Create `.env` file and paste the values from the `.env.example` file and change the database credentials


## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
$ npm run start
```


## API Specification

* ###  Submit a User Reading Interval

    #### Request
    Allows users to submit their reading intervals for a specific book.
    
    `PATCH /books/:bookId/progress`
    
    ```json
    {
      "start_page": 2,
      "end_page": 30
    }
    ```
    
    #### Response
    Returns a status code indicating whether the request was successful or not.
    ```json
    {
      "status_code": "success"
    }
    ```
* ###  Calculate the Most Recommended Five Books

    #### Request
    The API allows users to get the top five recommended books in the system.
    
    `GET /books/recommendations`
    
    #### Response
    The API returns an array of books sorted by the number of read pages in descending order.
    ```json
    [
      {
        "book_id": "5",
        "book_name": "test1",
        "num_of_pages": "143",
        "num_of_read_pages": "100"
      },
      {
        "book_id": "1",
        "book_name": "test3",
        "num_of_pages": "100",
        "num_of_read_pages": "90"
      }
    ]
    ```
    
## Example API Test Cases

Here are some example test cases you can use to verify the functionality of the APIs:

- **POST /register/admin**: Should create a new admin.
- **POST /register/user**: Should create a new user.
- **POST /login**: Should return token by verifying the email and password.
- **GET /books**: Should return a list of all books **(requires admin role)**.
- **POST /books**: Should create a new book **(requires admin role)**.
- **GET /books/:bookId**: Should return the details of a specific book **(requires admin role)**.
- **PATCH /books/:bookId**: Should update the details of a specific book **(requires admin role)**.
- **GET /books/:bookId**: Should return the details of a specific book **(requires admin role)**.
- **PUT /books/:bookId/progress**: Should update the reading intervals for a specific book.
- **GET /books/recommendations**: Should return a list of top five recommended books in the system.
