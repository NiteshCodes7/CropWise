# CropWise Frontend <img src="./frontend/public/icon.svg" alt="CropWise Logo" width="32" height="32" style="vertical-align:middle;" />

CropWise is a web application designed to help farmers and agricultural professionals manage crops efficiently. This repository contains the frontend codebase built with modern web technologies.

**CropWise supports multiple languages, making it accessible to users from diverse regions.**

## Demo

### Video Overview

[![Watch the demo video]](./frontend/public/demovideo.mp4)
> _Click the image above to watch a short demo of CropWise in action._

### App Screenshot

![CropWise App Screenshot](./frontend/public/demoss.png)
> _A preview of the CropWise dashboard interface._

## Features

- User authentication and profile management
- Dashboard for crop monitoring
- Weather and soil data integration
- Crop health analytics and recommendations
- Responsive and user-friendly interface
- **Multilingual support for a global user base**

## Tech Stack

- ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) **Framework:** React  
- ![JavaScript](https://img.shields.io/badge/useState-20232A?style=for-the-badge&logo=javascript&logoColor=F7DF1E) **State Management:** useState  
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) **Styling:** CSS/tailwind CSS, ShadCN  
- ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white) **API Communication:** Axios  
- ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) **Routing:** React Router  
- ![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white) **MAP:** leaflet  

## Getting Started

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/CropWise.git
    cd CropWise/frontend
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Start the development server:**
    ```bash
    npm start
    ```

4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Folder Structure

```
frontend/
├── public/
│   ├── logo.png
│   └── app-screenshot.png
├── src/
│   ├── components/
│   ├── pages/
│   ├── redux/
│   ├── utils/
│   └── App.js
├── package.json
└── README.md
```

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements.

## License

This project is licensed under the MIT License.

---

# CropWise Backend ![Node.js Logo](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

The backend for CropWise powers the core business logic, data storage, and API endpoints for the application. It is designed to be secure, scalable, and easy to maintain.

## Features

- RESTful API for frontend integration
- User authentication and authorization (Clerk)
- Crop, weather, and soil data management
- Analytics and recommendation engine
- Secure data storage

## Tech Stack

- ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) **Language:** Node.js  
- ![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white) **Framework:** Express.js  
- ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) **Database:** MongoDB  
- ![Clerk](https://img.shields.io/badge/Clerk-3B3B98?style=for-the-badge&logo=clerk&logoColor=white) **Authentication:** Clerk  
- ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white) **API Testing:** Postman  

## Getting Started

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/CropWise.git
    cd CropWise/backend
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up environment variables:**
    - Create a `.env` file in the `backend` directory.
    - Add the following variables:
      ```
      PORT=5000
      MONGO_URI=your_mongodb_connection_string
      CLERK_SECRET_KEY=your_clerk_secret_key
      ```

4. **Start the backend server:**
    ```bash
    npm start
    ```

5. The API will be available at [http://localhost:5000](http://localhost:5000).


## Additional Tech Stack

- ![node-cron](https://img.shields.io/badge/node--cron-6DB33F?style=for-the-badge&logo=node.js&logoColor=white) **Task Scheduling:** node-cron (for scheduled jobs such as notifications or data sync)
- ![Nodemailer](https://img.shields.io/badge/Nodemailer-009688?style=for-the-badge&logo=maildotru&logoColor=white) **Email Service:** Nodemailer (for sending transactional emails)
- ![Twilio](https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=twilio&logoColor=white) **SMS Service:** Twilio (for sending SMS alerts and notifications)
- ![dotenv](https://img.shields.io/badge/dotenv-8DD6F9?style=for-the-badge&logo=dotenv&logoColor=white) **Environment Variables:** dotenv (for managing configuration)
- ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black) **API Documentation:** Swagger (for documenting RESTful APIs)
- ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white) ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white) **Linting & Formatting:** ESLint, Prettier (for code quality and consistency)


## Folder Structure

```
backend/
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
├── app.js
├── package.json
└── README.md
```

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements.

## License

This project is licensed under the MIT License.