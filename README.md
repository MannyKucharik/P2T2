# VetNotes 🐾
**VetNotes** is a full-stack MERN application designed for pet owners to track health vitals, manage pet profiles, and receive automated care reminders.

## 🚀 Features
* **User Authentication:** Secure Sign-up/Login with JWT and email verification.
* **Pet Management:** Create, update, and delete pet profiles (Species, Age, etc.).
* **Health Tracking:** Log and monitor vitals and notes for each pet.
* **Secure API:** RESTful API built with Express and protected with JWT middleware.

## 🛠️ Tech Stack
* **Frontend:** React, Next.js, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Testing:** Jest, Supertest

---

## 🧪 Testing Requirement
This project implements automated **Unit and Integration Testing** to ensure API reliability and security.

* **Requirement:** At least one test per API endpoint.
* **Status:** ✅ **8/8 Endpoints Tested & Passing.**
* **Tools:** Jest for the test runner and Supertest for HTTP assertions.

### How to Run Tests
To verify the API endpoints locally, run:
```bash
npm test
