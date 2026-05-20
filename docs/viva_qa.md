# Viva Questions & Answers

This document contains expected questions from external examiners during the final year project presentation, categorized by difficulty and topic.

## Core Technologies (MERN)

**Q1: Why did you choose the MERN stack for this project instead of Django or PHP?**
**A:** MERN (MongoDB, Express.js, React.js, Node.js) allows for full-stack JavaScript development, meaning the entire codebase utilizes a single language, which improves development speed and code sharing. Node.js provides a non-blocking, event-driven architecture that is highly efficient for handling numerous concurrent registration requests. React's virtual DOM ensures a fast, responsive user interface, crucial for a modern SaaS dashboard.

**Q2: What is the purpose of Zustand, and why didn't you use Redux?**
**A:** Zustand is a small, fast, and scalable bearbones state-management solution. We chose it over Redux because it requires significantly less boilerplate code, doesn't require wrapping the application in context providers, and provides a much simpler API while still solving the prop-drilling problem efficiently.

**Q3: How did you handle concurrent registrations for limited-capacity events?**
**A:** To prevent race conditions (e.g., two students booking the last available seat simultaneously), we utilized MongoDB's atomic `$inc` operator. When a registration occurs, the database atomically increments the `current_count` field only if it's less than `max_capacity`. This ensures data integrity at the database level without requiring complex application-level locking.

## Architecture & Security

**Q4: Explain the authentication flow in your application.**
**A:** We use JSON Web Tokens (JWT) for stateless authentication. When a user logs in, the backend verifies their credentials using bcrypt and issues a signed JWT. This token is sent to the frontend and stored (e.g., in localStorage or cookies). For subsequent protected requests, the frontend sends this JWT in the Authorization header. Custom middleware (`protect` and `authorizeRoles`) decodes the token and verifies the user's role before granting access to specific routes.

**Q5: How are passwords stored in the database?**
**A:** Passwords are never stored in plain text. We use the `bcryptjs` library to salt and hash passwords before saving them to MongoDB. We utilize a pre-save hook in the Mongoose User schema to automatically hash the password if it has been modified.

**Q6: What is a RESTful API?**
**A:** REST (Representational State Transfer) is an architectural style for designing networked applications. Our API is RESTful because it uses standard HTTP methods (GET, POST, PUT, PATCH, DELETE) to perform CRUD operations on resources (like Events, Users, Registrations), and it relies on stateless communication.

## Advanced Features

**Q7: How does the QR Code ticketing system work?**
**A:** Upon confirmed registration, the frontend generates a dynamic QR code using the `qrcode.react` library. The QR code encodes a JSON string containing the unique Registration ID, Event ID, and Student Roll Number. During the event, organizers can scan this code to retrieve and validate the attendee's information instantly.

**Q8: Explain the logic behind the "Event Popularity Prediction" feature.**
**A:** The popularity prediction algorithm analyzes the current fill rate of an event. If the ratio of `current_count` to `max_capacity` exceeds a specific threshold (e.g., 70%), the system dynamically flags the event as "Trending" with a visual badge. This is calculated on the fly in the React component based on real-time data fetched from the backend.

**Q9: How did you implement the Smart Search feature?**
**A:** We implemented MongoDB Text Indexes on the Event schema, specifically indexing the `title`, `description`, `category`, and `venue` fields. This allows the backend to perform efficient, full-text semantic searches across multiple fields simultaneously, rather than relying on slow and basic regex matching.

## UI/UX & Design

**Q10: What is Glassmorphism, and how did you achieve it?**
**A:** Glassmorphism is a modern UI design trend characterized by translucent, frosted-glass-like elements. We achieved this using CSS by combining a semi-transparent background color (`rgba`) with the `backdrop-filter: blur(12px)` property. This allows the background elements or gradients to subtly show through the cards, creating a premium depth effect.

**Q11: Why did you use Framer Motion instead of standard CSS animations?**
**A:** While CSS is great for simple transitions, Framer Motion provides a declarative API for complex, physics-based animations in React. We used it for layout animations, staggered list appearances, and `AnimatePresence` to handle exit animations when components are removed from the DOM (like closing modals or switching tabs).
