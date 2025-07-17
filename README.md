
# Happy Candles
**Happy Candles** is a full-stack web application that helps parents organize their children’s birthday parties with ease. It centralizes all planning tasks into one user-friendly interface — from to-do lists and shopping lists to guest invitations and RSVP tracking.
This project is part of the Holberton School Paris curriculum and is for educational and portfolio purposes.
<img width="1851" height="960" alt="Image" src="https://github.com/user-attachments/assets/70882a6f-ee25-430d-9bec-ad8889627212" />

## ✨ Features

- ✅ **To-Do List**: Manage and check off preparation tasks.
- 🛒 **Shopping List**: Track items to purchase for the party.
- 👥 **Guest Management**: Add guests with contact/allergy info and monitor RSVP status (attending, not attending, no response).
- 💌 **Invitation Generator**: Create personalized PDF invitations with a unique QR code for RSVP.
- 📅 **Multi-party Support**: Manage multiple parties for multiple children or years.
- 🔐 **Google OAuth Login**: Secure login using Google — no password storage.

## 🧑‍💻 Tech Stack

### Front-End

- [React](https://reactjs.org/) – Component-based UI development
- [Bootstrap / React-Bootstrap](https://react-bootstrap.github.io/) – Responsive design
- [React Router DOM](https://reactrouter.com/) – Page navigation
- [Axios](https://axios-http.com/) – API requests
- [QRCode.react](https://github.com/zpao/qrcode.react) – Dynamic QR code generation
- [jsPDF](https://github.com/parallax/jsPDF) – PDF generation

### Back-End

- [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/) – RESTful API
- [MySQL](https://www.mysql.com/) – Relational database
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2) – Authentication
- [dotenv](https://github.com/motdotla/dotenv) – Environment variable management
- [UUID](https://www.npmjs.com/package/uuid) – Unique ID generation
- [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) – Cross-origin resource sharing

## 🗃️ Project Structure

```
/src
  ├── Components/       # Reusable components (Todo, Guest, Shopping, etc.)
  ├── Pages/            # Main views (Home, Party, Create Invitation, RSVP)
  ├── Contexts/         # User context management
  ├── App.jsx           # Main App component
  └── main.jsx          # Application entry point
```

```
/server
  ├── controllers/      # Business logic per resource
  ├── routes/           # Express routes (auth, todo, guest, etc.)
  ├── validators/       # Data validation logic
  ├── db.js             # DB connection
  └── server.js         # Entry point for the Express server
```

## 📌 Installation

### Prerequisites

- Node.js and npm
- MySQL
- Git

### Setup Instructions

1. **Clone the repo**  
   `git clone https://github.com/bisoukeiko/holbertonschool-portfolio.git`

2. **Install dependencies**  
   Frontend:  
   ```bash
   cd client
   npm install
   ```

   Backend:  
   ```bash
   cd server
   npm install
   ```

3. **Configure environment variables**  
   Create a `.env` file in `/client` and add:
   ```
   GOOGLE_CLIENT_ID=your-google-client-id
   ```
   Create a `.env` file in `/server` and add:
   ```
   DB_HOST=your-db-host
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   DB_NAME=your-db-name
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_REDIRECT_URL=your-google-redirect-url
   ```

4. **Start development servers**
   - Frontend: `npm run dev`
   - Backend: `npm run start` (using nodemon)

## 📷 Screenshots

### Party Management Page
<img width="1754" height="1154" alt="Image" src="https://github.com/user-attachments/assets/a3f7eaae-4c58-4164-a615-249355c49274" />

### Create Invitation Page
<img width="1846" height="1185" alt="Image" src="https://github.com/user-attachments/assets/54325550-bb5e-4825-ad75-b5b2baa966c7" />

### RSVP page
<img width="1377" height="1042" alt="Image" src="https://github.com/user-attachments/assets/331a039b-1d8d-4eb7-bc23-87c9731c49fb" />
