# System Design & Architecture

## 1. Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USER ||--o{ REGISTRATION : registers
    USER ||--o{ FEEDBACK : submits
    USER ||--o{ CERTIFICATE : earns
    USER ||--o{ NOTIFICATION : receives
    USER ||--o{ EVENT : "saves (savedEvents)"
    
    EVENT ||--o{ REGISTRATION : has
    EVENT ||--o{ FEEDBACK : has
    EVENT ||--o{ CERTIFICATE : generates
    
    ORGANIZATION ||--o{ EVENT : "creates (createdBy)"

    USER {
        ObjectId _id
        String name
        String email
        String password
        String role
        String department
        String rollNumber
        Array savedEvents
    }

    EVENT {
        ObjectId _id
        String title
        String description
        String category
        Date date
        Number max_capacity
        Number current_count
        Number budget
        String approval_status
        Array tags
    }

    REGISTRATION {
        ObjectId _id
        ObjectId student
        ObjectId event
        String status
        Date registeredAt
    }

    CERTIFICATE {
        ObjectId _id
        ObjectId student
        ObjectId event
        String certificateId
        Date issuedAt
    }
```

## 2. Data Flow Diagram (Level 0 - Context Diagram)

```mermaid
graph TD
    S[Student] -- "Views Events, Registers, \n Submits Feedback" --> SYS((Smart College \n Event System))
    O[Organization] -- "Creates Events, Approves, \n Views Analytics" --> SYS
    SYS -- "Provides QR Tickets, \n Certificates, Recommendations" --> S
    SYS -- "Provides Dashboards, \n Live Stats, Registration Data" --> O
```

## 3. Technology Stack Justification
- **MongoDB:** Chosen for its flexible, document-based schema, allowing for rapid iteration of the Event and User models. The atomic `$inc` operator is crucial for managing concurrent registrations and preventing race conditions.
- **Express.js & Node.js:** Provides a lightweight, high-performance asynchronous backend capable of handling multiple concurrent requests, particularly useful during high-traffic registration periods.
- **React.js:** Facilitates the creation of a dynamic, single-page application (SPA). The component-based architecture ensures code reusability.
- **Zustand:** Selected over Redux for state management due to its minimal boilerplate, providing a clean and efficient way to manage global state (e.g., authentication, events).
- **Framer Motion & Recharts:** Utilized to achieve the premium SaaS aesthetic, providing fluid animations and interactive data visualizations that elevate the user experience beyond standard academic projects.
