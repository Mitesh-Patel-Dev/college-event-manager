import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "./models/Event.js";
import User from "./models/User.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// ─── Seed Data: 25 Premium Events ─────────────────────────────
const EVENTS = [
  // ═══════════════ CONCERTS / CULTURAL ═══════════════
  {
    title: "Drake — It's All A Blur Tour 2026",
    description: "The 6 God returns to the campus for an electrifying night of hip-hop and R&B. Featuring hits from For All The Dogs, Certified Lover Boy, and the latest album. VIP meet-and-greet packages available. This is the biggest concert event of the year — don't miss out!",
    category: "Cultural",
    date: new Date("2026-06-15"),
    time: "7:00 PM - 11:30 PM",
    venue: "University Stadium, Main Ground",
    max_capacity: 5000,
    current_count: 4287,
    organizer: "Cultural Committee",
    budget: 250000,
    status: "upcoming",
    approval_status: "approved",
    tags: ["concert", "hip-hop", "drake", "music"],
  },
  {
    title: "Kendrick Lamar — GNX World Tour",
    description: "Pulitzer Prize-winning artist Kendrick Lamar brings the GNX World Tour to campus! Experience HUMBLE, DNA, Not Like Us, and tracks from the new album live. An unforgettable evening of lyrical genius and groundbreaking performance art.",
    category: "Cultural",
    date: new Date("2026-07-02"),
    time: "6:30 PM - 11:00 PM",
    venue: "College Amphitheatre",
    max_capacity: 4000,
    current_count: 3856,
    organizer: "Music Society",
    budget: 300000,
    status: "upcoming",
    approval_status: "approved",
    tags: ["concert", "kendrick", "rap", "music"],
  },
  {
    title: "Arijit Singh Live — Soulful Evenings",
    description: "India's most beloved playback singer Arijit Singh performs live on campus. From Tum Hi Ho to Kesariya, experience the magic of his voice under the stars. Acoustic setup with a 30-piece orchestra. Limited golden circle tickets available.",
    category: "Cultural",
    date: new Date("2026-06-28"),
    time: "7:00 PM - 10:30 PM",
    venue: "Open Air Theatre",
    max_capacity: 3500,
    current_count: 3102,
    organizer: "Cultural Committee",
    budget: 200000,
    status: "upcoming",
    approval_status: "approved",
    tags: ["concert", "bollywood", "arijit", "music"],
  },
  {
    title: "AP Dhillon Live in Concert",
    description: "Punjabi sensation AP Dhillon takes over the campus! Brown Munde, Excuses, Insane — hear all his chart-toppers live. High-energy Punjabi pop meets EDM in this explosive concert experience.",
    category: "Cultural",
    date: new Date("2026-08-10"),
    time: "8:00 PM - 12:00 AM",
    venue: "University Stadium, Main Ground",
    max_capacity: 4500,
    current_count: 2980,
    organizer: "Student Union",
    budget: 180000,
    status: "upcoming",
    approval_status: "approved",
    tags: ["concert", "punjabi", "ap-dhillon", "edm"],
  },
  {
    title: "Taylor Swift — Eras Tour Campus Edition",
    description: "A tribute concert celebrating every era of Taylor Swift's legendary career. Professional cover band, full production with LED walls, costume changes, and friendship bracelet exchange stations. Swifties unite!",
    category: "Cultural",
    date: new Date("2026-06-22"),
    time: "5:00 PM - 10:00 PM",
    venue: "Sports Complex Indoor Arena",
    max_capacity: 3000,
    current_count: 2876,
    organizer: "Cultural Committee",
    budget: 150000,
    status: "upcoming",
    approval_status: "approved",
    tags: ["concert", "taylor-swift", "pop", "music"],
  },

  // ═══════════════ CORPORATE / PROFESSIONAL ═══════════════
  {
    title: "Google Cloud Summit 2026",
    description: "An exclusive tech summit hosted in partnership with Google Cloud. Learn about cloud computing, AI/ML services, BigQuery, and Kubernetes from Google engineers. Includes hands-on labs, certification vouchers, and networking lunch with industry professionals.",
    category: "Technical",
    date: new Date("2026-06-10"),
    time: "9:00 AM - 5:00 PM",
    venue: "Tech Auditorium, Block A",
    max_capacity: 500,
    current_count: 467,
    organizer: "Computer Science Dept.",
    budget: 75000,
    status: "upcoming",
    approval_status: "approved",
    tags: ["google", "cloud", "tech", "corporate"],
  },
  {
    title: "Microsoft Azure Hackathon",
    description: "48-hour hackathon powered by Microsoft Azure. Build innovative solutions using Azure AI, Cosmos DB, and GitHub Copilot. Top 3 teams win cash prizes totaling ₹2,00,000 and internship interviews at Microsoft India.",
    category: "Hackathon",
    date: new Date("2026-07-15"),
    time: "10:00 AM (48 hours)",
    venue: "Innovation Lab, Block C",
    max_capacity: 200,
    current_count: 184,
    organizer: "IT Department",
    budget: 120000,
    status: "upcoming",
    approval_status: "approved",
    tags: ["hackathon", "microsoft", "azure", "coding"],
  },
  {
    title: "Tesla Recruitment Drive 2026",
    description: "Tesla's campus recruitment event. Open for final year B.Tech and M.Tech students. Roles include Software Engineer, Data Analyst, and Embedded Systems Developer. Written test followed by technical and HR interviews.",
    category: "Other",
    date: new Date("2026-06-18"),
    time: "9:00 AM - 6:00 PM",
    venue: "Placement Cell Auditorium",
    max_capacity: 300,
    current_count: 298,
    organizer: "Placement Cell",
    budget: 50000,
    status: "upcoming",
    approval_status: "approved",
    tags: ["placement", "tesla", "recruitment", "corporate"],
  },
  {
    title: "Amazon Web Services — Cloud Practitioner Bootcamp",
    description: "3-day intensive bootcamp to prepare for the AWS Certified Cloud Practitioner exam. Covers AWS fundamentals, pricing, security, and architecture. Free exam voucher for all participants who complete the bootcamp.",
    category: "Workshop",
    date: new Date("2026-07-08"),
    time: "10:00 AM - 4:00 PM",
    venue: "Seminar Hall B",
    max_capacity: 150,
    current_count: 142,
    organizer: "AWS Student Club",
    budget: 40000,
    status: "upcoming",
    approval_status: "approved",
    tags: ["aws", "cloud", "workshop", "certification"],
  },
  {
    title: "Goldman Sachs — Finance & Tech Talk",
    description: "Senior VPs from Goldman Sachs discuss the intersection of finance and technology. Topics include algorithmic trading, blockchain in banking, and quantitative analysis. Exclusive networking session for finance and CS students.",
    category: "Guest Lecture",
    date: new Date("2026-06-25"),
    time: "2:00 PM - 5:00 PM",
    venue: "MBA Auditorium",
    max_capacity: 250,
    current_count: 201,
    organizer: "Finance Society",
    budget: 35000,
    status: "upcoming",
    approval_status: "approved",
    tags: ["finance", "goldman-sachs", "tech-talk", "corporate"],
  },

  // ═══════════════ HACKATHONS & TECHNICAL ═══════════════
  {
    title: "HackVerse 4.0 — National Hackathon",
    description: "The 4th edition of our flagship national-level hackathon! 36 hours, 500+ participants, mentors from FAANG companies. Tracks: HealthTech, EdTech, FinTech, Sustainability. Prize pool worth ₹5,00,000.",
    category: "Hackathon",
    date: new Date("2026-08-01"),
    time: "6:00 PM (36 hours)",
    venue: "Innovation Center",
    max_capacity: 500,
    current_count: 423,
    organizer: "Coding Club",
    budget: 500000,
    status: "upcoming",
    approval_status: "approved",
    tags: ["hackathon", "national", "coding", "prizes"],
  },
  {
    title: "AI/ML Workshop — Building LLM Applications",
    description: "Hands-on workshop on building real-world applications using Large Language Models. Learn prompt engineering, RAG architecture, fine-tuning, and deploying AI apps with LangChain and OpenAI APIs. Laptops required.",
    category: "Workshop",
    date: new Date("2026-06-20"),
    time: "10:00 AM - 4:00 PM",
    venue: "Computer Lab 3, Block D",
    max_capacity: 80,
    current_count: 78,
    organizer: "AI Research Lab",
    budget: 25000,
    status: "upcoming",
    approval_status: "approved",
    tags: ["ai", "ml", "llm", "workshop"],
  },
  {
    title: "React.js Masterclass with Dan Abramov",
    description: "An exclusive online-streamed masterclass featuring Dan Abramov (co-creator of Redux). Deep dive into React Server Components, Suspense patterns, and the future of React. Live Q&A session at the end.",
    category: "Workshop",
    date: new Date("2026-07-20"),
    time: "6:00 PM - 9:00 PM",
    venue: "Virtual + Seminar Hall A",
    max_capacity: 300,
    current_count: 256,
    organizer: "Web Dev Club",
    budget: 15000,
    status: "upcoming",
    approval_status: "approved",
    tags: ["react", "javascript", "web-dev", "masterclass"],
  },
  {
    title: "Capture The Flag (CTF) — CyberSec Challenge",
    description: "Test your cybersecurity skills in this 12-hour CTF competition. Challenges span web exploitation, cryptography, reverse engineering, and forensics. Individual and team categories. Winners get cybersecurity certifications.",
    category: "Technical",
    date: new Date("2026-07-25"),
    time: "8:00 AM - 8:00 PM",
    venue: "Cyber Lab, Block E",
    max_capacity: 120,
    current_count: 98,
    organizer: "CyberSec Club",
    budget: 30000,
    status: "upcoming",
    approval_status: "approved",
    tags: ["ctf", "cybersecurity", "hacking", "competition"],
  },

  // ═══════════════ SPORTS ═══════════════
  {
    title: "Inter-College Cricket Tournament 2026",
    description: "The annual T20 cricket tournament is back! 16 colleges competing for the championship trophy. Live commentary, cheerleading performances, and food stalls. Grand finale under floodlights.",
    category: "Sports",
    date: new Date("2026-07-05"),
    time: "8:00 AM - 7:00 PM",
    venue: "Cricket Ground",
    max_capacity: 2000,
    current_count: 1456,
    organizer: "Sports Committee",
    budget: 100000,
    status: "upcoming",
    approval_status: "approved",
    tags: ["cricket", "sports", "tournament", "inter-college"],
  },
  {
    title: "College Marathon — Run for Health 5K",
    description: "Annual 5K marathon promoting health and fitness. Open to students, faculty, and alumni. Timed race with GPS tracking, finisher medals, energy drink stations every kilometer, and professional timing chips.",
    category: "Sports",
    date: new Date("2026-06-30"),
    time: "6:00 AM - 9:00 AM",
    venue: "Campus Perimeter Road",
    max_capacity: 1000,
    current_count: 734,
    organizer: "NSS Committee",
    budget: 45000,
    status: "upcoming",
    approval_status: "approved",
    tags: ["marathon", "fitness", "running", "health"],
  },

  // ═══════════════ SEMINARS / GUEST LECTURES ═══════════════
  {
    title: "Elon Musk — Future of Space & AI (Virtual)",
    description: "Exclusive virtual keynote by Elon Musk on the convergence of space exploration and artificial intelligence. Topics include Neuralink updates, Mars colonization timeline, and xAI's Grok. Followed by moderated student Q&A.",
    category: "Guest Lecture",
    date: new Date("2026-08-05"),
    time: "8:30 PM - 10:30 PM",
    venue: "Main Auditorium (Live Stream)",
    max_capacity: 1500,
    current_count: 1489,
    organizer: "Innovation Cell",
    budget: 20000,
    status: "upcoming",
    approval_status: "approved",
    tags: ["elon-musk", "space", "ai", "virtual"],
  },
  {
    title: "TEDx College Campus 2026",
    description: "Our annual TEDx event featuring 8 inspiring speakers from diverse fields — technology, art, social entrepreneurship, and science. Theme: 'Breaking Boundaries'. Red carpet photo booth, curated networking dinner.",
    category: "Seminar",
    date: new Date("2026-07-12"),
    time: "10:00 AM - 6:00 PM",
    venue: "Convention Center",
    max_capacity: 600,
    current_count: 587,
    organizer: "TEDx Club",
    budget: 150000,
    status: "upcoming",
    approval_status: "approved",
    tags: ["tedx", "talks", "inspiration", "speakers"],
  },
  {
    title: "Sundar Pichai — Leadership in the AI Era",
    description: "Google CEO Sundar Pichai delivers a virtual address on leadership, innovation, and navigating the AI revolution. Insights from his journey from IIT Kharagpur to leading one of the world's most influential companies.",
    category: "Guest Lecture",
    date: new Date("2026-07-30"),
    time: "7:00 PM - 9:00 PM",
    venue: "Main Auditorium (Hybrid)",
    max_capacity: 1200,
    current_count: 1156,
    organizer: "Entrepreneurship Cell",
    budget: 15000,
    status: "upcoming",
    approval_status: "approved",
    tags: ["sundar-pichai", "google", "leadership", "ai"],
  },

  // ═══════════════ COMPLETED EVENTS ═══════════════
  {
    title: "CodeChef Campus Challenge 2026",
    description: "Competitive programming contest powered by CodeChef. 3-hour individual challenge with 8 problems of increasing difficulty. Top performers qualify for CodeChef SnackDown regionals.",
    category: "Technical",
    date: new Date("2026-05-10"),
    time: "2:00 PM - 5:00 PM",
    venue: "Computer Lab 1 & 2",
    max_capacity: 200,
    current_count: 189,
    organizer: "Coding Club",
    budget: 20000,
    status: "completed",
    approval_status: "approved",
    tags: ["codechef", "competitive", "programming"],
  },
  {
    title: "Annual Cultural Fest — Rhythms 2026",
    description: "The grand 3-day cultural extravaganza! Dance battles, band performances, fashion show, stand-up comedy, art exhibitions, and a star night featuring Diljit Dosanjh. 50+ events across 10 venues.",
    category: "Cultural",
    date: new Date("2026-04-20"),
    time: "10:00 AM - 11:00 PM",
    venue: "Entire Campus",
    max_capacity: 8000,
    current_count: 7562,
    organizer: "Cultural Committee",
    budget: 800000,
    status: "completed",
    approval_status: "approved",
    tags: ["fest", "cultural", "music", "dance"],
  },

  // ═══════════════ PENDING APPROVALS ═══════════════
  {
    title: "Blockchain & Web3 Summit",
    description: "Exploring decentralized technologies: smart contracts, DeFi, NFTs, and DAOs. Speakers from Ethereum Foundation, Polygon Labs, and leading crypto exchanges. Includes a mini hackathon track.",
    category: "Technical",
    date: new Date("2026-08-20"),
    time: "9:00 AM - 6:00 PM",
    venue: "Seminar Hall A",
    max_capacity: 250,
    current_count: 0,
    organizer: "Blockchain Club",
    budget: 60000,
    status: "upcoming",
    approval_status: "pending",
    tags: ["blockchain", "web3", "crypto", "defi"],
  },
  {
    title: "Startup Pitch Competition — LaunchPad 2026",
    description: "Student startups pitch to a panel of angel investors and VCs. Top 3 startups receive seed funding up to ₹10 lakhs. Mentoring sessions with founders of unicorn startups. Open to all departments.",
    category: "Other",
    date: new Date("2026-08-25"),
    time: "10:00 AM - 5:00 PM",
    venue: "Entrepreneurship Hub",
    max_capacity: 150,
    current_count: 0,
    organizer: "E-Cell",
    budget: 100000,
    status: "upcoming",
    approval_status: "pending",
    tags: ["startup", "pitch", "funding", "entrepreneurship"],
  },
  {
    title: "Photography & Filmmaking Workshop",
    description: "Professional photography and short filmmaking workshop. Learn composition, lighting, color grading, and storytelling. Equipment provided. Final project: 2-minute campus documentary. Best film wins a DSLR camera.",
    category: "Workshop",
    date: new Date("2026-08-15"),
    time: "10:00 AM - 5:00 PM",
    venue: "Media Lab",
    max_capacity: 60,
    current_count: 0,
    organizer: "Media Club",
    budget: 35000,
    status: "upcoming",
    approval_status: "pending",
    tags: ["photography", "filmmaking", "creative", "workshop"],
  },
  {
    title: "Model United Nations (MUN) 2026",
    description: "3-day MUN conference with 6 committees including UNSC, UNGA, WHO, and a Crisis Committee. 300+ delegates from 25 colleges. Awards for Best Delegate, High Commendation, and Special Mention.",
    category: "Seminar",
    date: new Date("2026-09-01"),
    time: "9:00 AM - 6:00 PM",
    venue: "Convention Center",
    max_capacity: 350,
    current_count: 0,
    organizer: "Debate Society",
    budget: 80000,
    status: "upcoming",
    approval_status: "pending",
    tags: ["mun", "debate", "diplomacy", "conference"],
  },
];

// ─── Seed Function ──────────────────────────────────────────
async function seedEvents() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Find or create an organization user to be the createdBy
    let orgUser = await User.findOne({ role: "organization" });

    if (!orgUser) {
      // Try finding ANY user to use as createdBy
      orgUser = await User.findOne({});
    }

    if (!orgUser) {
      console.log("📦 No users found at all. Creating org user...");
      orgUser = await User.create({
        name: "College Administration",
        email: `admin_seed_${Date.now()}@college.edu`,
        password: "Admin@12345",
        role: "organization",
      });
      console.log(`✅ Created org user: ${orgUser.email}`);
    } else {
      console.log(`📌 Using existing user: ${orgUser.email} (${orgUser.role})`);
    }

    // Delete existing events (optional - clean slate)
    const deleteCount = await Event.deleteMany({});
    console.log(`🗑️  Deleted ${deleteCount.deletedCount} existing events`);

    // Add createdBy to all events
    const eventsWithUser = EVENTS.map((e) => ({
      ...e,
      createdBy: orgUser._id,
    }));

    // Insert all events
    const inserted = await Event.insertMany(eventsWithUser);
    console.log(`\n🎉 Successfully seeded ${inserted.length} events!\n`);

    // Summary
    const approved = inserted.filter((e) => e.approval_status === "approved").length;
    const pending = inserted.filter((e) => e.approval_status === "pending").length;
    const completed = inserted.filter((e) => e.status === "completed").length;
    const upcoming = inserted.filter((e) => e.status === "upcoming").length;

    console.log("📊 Summary:");
    console.log(`   ├── Approved: ${approved}`);
    console.log(`   ├── Pending:  ${pending}`);
    console.log(`   ├── Upcoming: ${upcoming}`);
    console.log(`   └── Completed: ${completed}`);
    console.log("\n✨ Your website now has premium events!\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
}

seedEvents();
