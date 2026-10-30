const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Event = require('../models/Event');
const Category = require('../models/Category');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const { generateQRCode } = require('./qrCodeService');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDatabase = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event_management_db';
    const isAtlas = uri.startsWith('mongodb+srv://');
    console.log(`[Seeder] Connecting to ${isAtlas ? 'MongoDB Atlas Cloud' : 'Local MongoDB'}...`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log('[Seeder] Connected! Purging existing records...');

    await User.deleteMany();
    await Event.deleteMany();
    await Category.deleteMany();
    await Booking.deleteMany();
    await Review.deleteMany();
    await Notification.deleteMany();

    console.log('[Seeder] Creating Users & Demo Accounts...');

    const admin = await User.create({
      name: 'Tim Cook (Admin)',
      email: 'admin@eventhub.com',
      password: 'password123',
      role: 'admin',
      phone: '+1 (408) 996-1010',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      bio: 'Platform Administrator & Chief Experience Officer at Apple Events.',
      organizationName: 'Apple Keynote Inc.',
    });

    const organizer = await User.create({
      name: 'Craig Federighi',
      email: 'organizer@eventhub.com',
      password: 'password123',
      role: 'organizer',
      phone: '+1 (408) 555-0199',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      bio: 'Senior Vice President of Software & Global Tech Conferences Curator.',
      organizationName: 'Cupertino Global Events Group',
    });

    const organizer2 = await User.create({
      name: 'Jony Ive Creative',
      email: 'design@eventhub.com',
      password: 'password123',
      role: 'organizer',
      phone: '+1 (408) 555-0188',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
      bio: 'Industrial design advocate and creator of LoveFrom symposiums.',
      organizationName: 'LoveFrom Architecture & Design',
    });

    const standardUser = await User.create({
      name: 'Alex Morgan',
      email: 'user@eventhub.com',
      password: 'password123',
      role: 'user',
      phone: '+1 (415) 555-2671',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      bio: 'Design engineer, audiophile, and avid live event attendee.',
    });

    console.log('[Seeder] Creating Categories...');
    const categoriesData = [
      {
        name: 'Technology',
        description: 'Keynotes, developer summits, AI conferences, and cutting-edge hardware debuts.',
        iconName: 'Cpu',
        image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop&q=80',
        featured: true,
      },
      {
        name: 'Music',
        description: 'Orchestral acoustics, spatial audio concerts, and immersive electronic performances.',
        iconName: 'Music',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
        featured: true,
      },
      {
        name: 'Art & Culture',
        description: 'Minimalist industrial exhibitions, modern architecture showcases, and sculpture galleries.',
        iconName: 'Palette',
        image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&auto=format&fit=crop&q=80',
        featured: true,
      },
      {
        name: 'Business',
        description: 'Executive roundtables, venture summits, leadership keynotes, and founder forums.',
        iconName: 'Briefcase',
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80',
        featured: true,
      },
      {
        name: 'Workshops',
        description: 'Hands-on masterclasses in Swift, product architecture, UI typography, and cinematography.',
        iconName: 'Layers',
        image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80',
        featured: false,
      },
      {
        name: 'Sports',
        description: 'High-performance marathons, precision esports championships, and wellness retreats.',
        iconName: 'Trophy',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
        featured: false,
      },
      {
        name: 'Education',
        description: 'Interactive STEM symposia, research presentations, and student design honors.',
        iconName: 'GraduationCap',
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
        featured: false,
      },
      {
        name: 'Entertainment',
        description: 'Cinematic film premieres, immersive spatial theater, and comedy specials.',
        iconName: 'Film',
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
        featured: false,
      },
    ];

    const categoriesWithSlugs = categoriesData.map(c => ({
      ...c,
      slug: c.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-'),
    }));

    await Category.insertMany(categoriesWithSlugs);

    console.log('[Seeder] Creating Events...');

    const futureDate = (daysAhead) => {
      const d = new Date();
      d.setDate(d.getDate() + daysAhead);
      return d;
    };

    const eventsData = [
      {
        title: 'Apple Worldwide Developers Conference 2026',
        slug: 'wwdc-2026-apple-park',
        shortDescription: 'Witness the unveiling of groundbreaking software, visionOS enhancements, and revolutionary developer APIs at Apple Park.',
        description: 'WWDC26 introduces state-of-the-art platforms, tools, and technologies that will empower developers to build their most innovative apps yet. Experience sessions led by Apple engineers, 1-on-1 developer labs, and hands-on spatial computing experiences in Steve Jobs Theater.',
        category: 'Technology',
        organizer: organizer._id,
        date: futureDate(14),
        startTime: '10:00 AM',
        endTime: '05:00 PM',
        venueName: 'Steve Jobs Theater, Apple Park',
        address: '1 Apple Park Way',
        city: 'Cupertino',
        state: 'California',
        country: 'United States',
        bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop&q=85',
        galleryImages: [
          'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
        ],
        ticketTiers: [
          {
            tierName: 'Developer Pass',
            price: 2499,
            totalSeats: 250,
            availableSeats: 215,
            description: 'Access to keynote, engineering labs, visionOS demos, and developer gift bag.',
            perks: ['Steve Jobs Theater Entry', 'Direct Lab Access', 'WWDC26 Special Jacket', 'Breakfast & Lunch'],
          },
          {
            tierName: 'VIP Executive Pass',
            price: 4999,
            totalSeats: 50,
            availableSeats: 32,
            description: 'Front-row keynote seating, private executive networking dinner, and Apple Park tour.',
            perks: ['VIP Reserved Seating', 'Executive Dinner with Apple VPs', 'Private Campus Tour', 'Priority Access'],
          },
        ],
        status: 'approved',
        isFeatured: true,
        tags: ['Apple', 'Developers', 'Keynote', 'visionOS', 'AI'],
        ratingsAverage: 4.9,
        ratingsQuantity: 84,
      },
      {
        title: 'Spatial Audio Symphony: Hans Zimmer Live',
        slug: 'spatial-audio-symphony-hans-zimmer',
        shortDescription: 'An acoustic masterpiece rendered in 360-degree spatial acoustics with a 100-piece orchestral ensemble.',
        description: 'Immerse your senses in a transcendent musical spectacle featuring Hans Zimmer performing legendary cinematic scores from Interstellar, Dune, and Inception. Engineered with Apple Spatial Audio transducers suspended throughout the hall for acoustic perfection.',
        category: 'Music',
        organizer: organizer._id,
        date: futureDate(21),
        startTime: '07:30 PM',
        endTime: '10:30 PM',
        venueName: 'Walt Disney Concert Hall',
        address: '111 S Grand Ave',
        city: 'Los Angeles',
        state: 'California',
        country: 'United States',
        bannerImage: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1600&auto=format&fit=crop&q=85',
        galleryImages: [
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
        ],
        ticketTiers: [
          {
            tierName: 'Balcony Acoustics',
            price: 1800,
            totalSeats: 300,
            availableSeats: 278,
            description: 'Pristine sound dispersion from upper mezzanine tiers.',
            perks: ['Spatial Audio Program Book', 'Complimentary Glass of Champagne'],
          },
          {
            tierName: 'Orchestra Front Stalls',
            price: 3800,
            totalSeats: 120,
            availableSeats: 88,
            description: 'Direct proximity to the master composer and central acoustic stage.',
            perks: ['Premium Orchestra Seating', 'VIP Lounge Reception', 'Signed Commemorative Vinyl'],
          },
        ],
        status: 'approved',
        isFeatured: true,
        tags: ['Orchestra', 'Music', 'Spatial Audio', 'Hans Zimmer'],
        ratingsAverage: 5.0,
        ratingsQuantity: 128,
      },
      {
        title: 'Minimalist Architecture & Industrial Design Summit',
        slug: 'minimalist-architecture-industrial-design',
        shortDescription: 'Exploring the philosophy of purity, tactile glass, aerospace-grade aluminum, and sustainable architectural forms.',
        description: 'Gather with internationally renowned industrial designers, architects, and material scientists. We deconstruct how Scandinavian restraint and Cupertino precision converge to build timeless artifacts and living spaces that seamlessly blend with nature.',
        category: 'Art & Culture',
        organizer: organizer2._id,
        date: futureDate(30),
        startTime: '09:00 AM',
        endTime: '04:30 PM',
        venueName: 'The Guggenheim Architectural Pavilion',
        address: '1071 5th Ave',
        city: 'New York',
        state: 'New York',
        country: 'United States',
        bannerImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=85',
        ticketTiers: [
          {
            tierName: 'General Admission',
            price: 1200,
            totalSeats: 180,
            availableSeats: 160,
            description: 'Access to all design talks, material sample pavilions, and monograph exhibits.',
            perks: ['Design Monograph Book', 'Access to Keynote Lectures', 'Curated Coffee Bar'],
          },
          {
            tierName: 'Architect Studio Pass',
            price: 2600,
            totalSeats: 40,
            availableSeats: 30,
            description: 'Includes closed-door critiquing workshop with principal architects.',
            perks: ['Masterclass Access', '1-on-1 Portfolio Critique', 'Private Dinner'],
          },
        ],
        status: 'approved',
        isFeatured: true,
        tags: ['Design', 'Architecture', 'Minimalism', 'Industrial'],
        ratingsAverage: 4.8,
        ratingsQuantity: 42,
      },
      {
        title: 'Global AI & Autonomous Intelligence Summit',
        slug: 'global-ai-autonomous-intelligence-summit',
        shortDescription: 'The defining conference on generative intelligence, on-device neural processing, and human-aligned foundation models.',
        description: 'Three transformative days exploring modern neural computation, privacy-preserving on-device LLMs, and ethical autonomy. Hear from the foremost AI researchers pushing boundaries in reinforcement learning and real-time reasoning.',
        category: 'Technology',
        organizer: organizer._id,
        date: futureDate(45),
        startTime: '08:30 AM',
        endTime: '06:00 PM',
        venueName: 'Moscone Center West',
        address: '747 Howard St',
        city: 'San Francisco',
        state: 'California',
        country: 'United States',
        bannerImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&auto=format&fit=crop&q=85',
        ticketTiers: [
          {
            tierName: 'Standard Conference',
            price: 3200,
            totalSeats: 500,
            availableSeats: 440,
            description: 'Full 3-day pass to research tracks, breakout stages, and tech expo.',
            perks: ['All Technical Sessions', 'Exhibition Access', 'Conference Proceedings'],
          },
          {
            tierName: 'Research & Founder Pass',
            price: 5500,
            totalSeats: 100,
            availableSeats: 82,
            description: 'All-inclusive pass with investor matchmaking and closed breakout roundtables.',
            perks: ['Founder Dinner', 'VIP Lounge', 'Recorded Keynotes in 4K'],
          },
        ],
        status: 'approved',
        isFeatured: true,
        tags: ['AI', 'Machine Learning', 'Future Tech', 'Silicon Valley'],
        ratingsAverage: 4.9,
        ratingsQuantity: 67,
      },
      {
        title: 'Venture & Exponential Capital Forum 2026',
        slug: 'venture-exponential-capital-forum',
        shortDescription: 'Connect with visionary founders and global capital allocators backing the next generational technological breakthroughs.',
        description: 'An invite-grade gathering of top angel syndicates, venture partners, and institutional investors shaping seed to pre-IPO capital allocation. Featuring curated pitch showcases and macroeconomic panels.',
        category: 'Business',
        organizer: organizer._id,
        date: futureDate(18),
        startTime: '09:00 AM',
        endTime: '05:30 PM',
        venueName: 'The St. Regis Grand Ballroom',
        address: '125 3rd St',
        city: 'San Francisco',
        state: 'California',
        country: 'United States',
        bannerImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1600&auto=format&fit=crop&q=85',
        ticketTiers: [
          {
            tierName: 'Delegate Pass',
            price: 4500,
            totalSeats: 150,
            availableSeats: 130,
            description: 'Access to plenary sessions, networking breaks, and deal-room software.',
            perks: ['Delegate Directory Access', 'Catered Luncheon', 'Deal Flow Lounge'],
          },
        ],
        status: 'approved',
        isFeatured: false,
        tags: ['Venture Capital', 'Finance', 'Startups', 'Economy'],
        ratingsAverage: 4.7,
        ratingsQuantity: 29,
      },
      {
        title: 'Mastering Swift 6 & Metal Graphics Workshop',
        slug: 'mastering-swift-6-metal-graphics',
        shortDescription: 'An intensive hands-on lab on concurrency, spatial shaders, and low-latency rendering pipelines.',
        description: 'Level up your Apple platform programming skills. Led by core engineering contributors, this workshop breaks down Swift concurrency actors, zero-cost memory models, and direct Metal pipeline compute shaders.',
        category: 'Workshops',
        organizer: organizer2._id,
        date: futureDate(25),
        startTime: '10:00 AM',
        endTime: '04:00 PM',
        venueName: 'Cupertino Tech Innovation Center',
        address: '10500 N De Anza Blvd',
        city: 'Cupertino',
        state: 'California',
        country: 'United States',
        bannerImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&auto=format&fit=crop&q=85',
        ticketTiers: [
          {
            tierName: 'Workshop Attendee',
            price: 1500,
            totalSeats: 60,
            availableSeats: 48,
            description: 'Hands-on workstation pass, source code repos, and digital certificate.',
            perks: ['Lab Code Repositories', 'Certificate of Completion', 'Direct Mentorship'],
          },
        ],
        status: 'approved',
        isFeatured: false,
        tags: ['Swift', 'Metal', 'Coding', 'Workshop'],
        ratingsAverage: 5.0,
        ratingsQuantity: 36,
      },
      {
        title: 'Pacific Coast International Marathon & Wellness Festival',
        slug: 'pacific-coast-marathon-wellness',
        shortDescription: 'Run along the pristine Pacific coastline followed by biometric recovery clinics and sound bath sessions.',
        description: 'A world-class marathon route along Big Sur and Monterey Bay. Featuring Apple Fitness+ pacers, precision GPS chip timing, and recovery hydrotherapy pods at the finish village.',
        category: 'Sports',
        organizer: organizer._id,
        date: futureDate(40),
        startTime: '06:00 AM',
        endTime: '02:00 PM',
        venueName: 'Monterey Bay Coastal Plaza',
        address: 'Cannery Row',
        city: 'Monterey',
        state: 'California',
        country: 'United States',
        bannerImage: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1600&auto=format&fit=crop&q=85',
        ticketTiers: [
          {
            tierName: 'Full Marathon Runner',
            price: 950,
            totalSeats: 1000,
            availableSeats: 940,
            description: 'Full 42.2 km bib, timing chip, technical race shirt, and finisher medal.',
            perks: ['Technical Race Shirt', 'Finisher Medal', 'Recovery Zone Entry'],
          },
          {
            tierName: 'Half Marathon Runner',
            price: 750,
            totalSeats: 800,
            availableSeats: 720,
            description: '21.1 km scenic route bib and race pack.',
            perks: ['Race Shirt', 'Finisher Medal', 'Hydration Stations'],
          },
        ],
        status: 'approved',
        isFeatured: false,
        tags: ['Running', 'Marathon', 'Fitness', 'Wellness'],
        ratingsAverage: 4.8,
        ratingsQuantity: 53,
      },
      {
        title: 'Sundance Horizon: Indie Cinema Gala 2026',
        slug: 'sundance-horizon-indie-cinema-gala',
        shortDescription: 'Premieres of boundary-pushing independent motion pictures filmed exclusively with high-dynamic-range cinema rigs.',
        description: 'Celebrate visionary storytelling in cinema. Featuring world premieres, Director Q&A panels, and red carpet cocktail galas with the cast and cinematographers.',
        category: 'Entertainment',
        organizer: organizer2._id,
        date: futureDate(50),
        startTime: '06:00 PM',
        endTime: '11:00 PM',
        venueName: 'Egyptian Theatre Hollywood',
        address: '6712 Hollywood Blvd',
        city: 'Los Angeles',
        state: 'California',
        country: 'United States',
        bannerImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&auto=format&fit=crop&q=85',
        ticketTiers: [
          {
            tierName: 'Red Carpet Screening Pass',
            price: 2100,
            totalSeats: 220,
            availableSeats: 195,
            description: 'Access to 3 premiere screenings and filmmaker Q&A.',
            perks: ['Screening Seat', 'Director Q&A Session', 'Cocktail Reception'],
          },
        ],
        status: 'approved',
        isFeatured: false,
        tags: ['Film', 'Cinema', 'Hollywood', 'Premiere'],
        ratingsAverage: 4.9,
        ratingsQuantity: 31,
      },
      // PENDING APPROVAL EVENTS (For testing the Admin approval workflow!)
      {
        title: 'Next-Gen Quantum Computing & Cryptography Forum',
        slug: 'quantum-computing-cryptography-forum',
        shortDescription: 'A deep-dive research symposium on post-quantum encryption and topological qubit stabilization.',
        description: 'Exploring quantum supremacy benchmarks, fault-tolerant error correction algorithms, and transitioning classical cybersecurity standards to quantum-resistant key exchanges.',
        category: 'Technology',
        organizer: organizer._id,
        date: futureDate(60),
        startTime: '09:00 AM',
        endTime: '05:00 PM',
        venueName: 'Stanford Computing Auditorium',
        address: '450 Jane Stanford Way',
        city: 'Palo Alto',
        state: 'California',
        country: 'United States',
        bannerImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1600&auto=format&fit=crop&q=85',
        ticketTiers: [
          {
            tierName: 'Researcher Pass',
            price: 1900,
            totalSeats: 120,
            availableSeats: 120,
            description: 'Access to all quantum physics and computing sessions.',
            perks: ['Proceedings Digest', 'Catered Lunch'],
          },
        ],
        status: 'pending_approval',
        isFeatured: false,
        tags: ['Quantum', 'Physics', 'Cryptography', 'Stanford'],
        ratingsAverage: 5.0,
        ratingsQuantity: 0,
      },
      {
        title: 'Silicon Valley Robotics & Autonomous Drone Expo',
        slug: 'silicon-valley-robotics-drone-expo',
        shortDescription: 'Live flight demonstrations, humanoid bipedal dexterity showcases, and robotic manufacturing showcases.',
        description: 'Witness the latest advancements in commercial UAVs, LiDAR sensor fusion, and neural dexterity hands in an outdoor live arena.',
        category: 'Technology',
        organizer: organizer2._id,
        date: futureDate(75),
        startTime: '10:00 AM',
        endTime: '06:00 PM',
        venueName: 'Santa Clara Convention Center',
        address: '5001 Great America Pkwy',
        city: 'Santa Clara',
        state: 'California',
        country: 'United States',
        bannerImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1600&auto=format&fit=crop&q=85',
        ticketTiers: [
          {
            tierName: 'General Expo Pass',
            price: 850,
            totalSeats: 400,
            availableSeats: 400,
            description: 'Full day access to live flight arena and hardware exhibition halls.',
            perks: ['Live Arena Entry', 'Expo Guidebook'],
          },
        ],
        status: 'pending_approval',
        isFeatured: false,
        tags: ['Robotics', 'Drones', 'Hardware', 'AI'],
        ratingsAverage: 5.0,
        ratingsQuantity: 0,
      },
    ];

    const createdEvents = await Event.create(eventsData);
    console.log(`[Seeder] Created ${createdEvents.length} events!`);

    // Create a sample confirmed booking for Alex Morgan
    console.log('[Seeder] Creating sample booking for demo user...');
    const wwdcEvent = createdEvents[0];
    const bookingId = 'BK-893421';

    const qrPayload = {
      bookingId,
      eventId: wwdcEvent._id,
      eventTitle: wwdcEvent.title,
      userName: standardUser.name,
      userEmail: standardUser.email,
      tierName: 'Developer Pass',
      quantity: 2,
      date: wwdcEvent.date,
      venue: wwdcEvent.venueName,
    };

    const qrCode = await generateQRCode(qrPayload);

    await Booking.create({
      bookingId,
      user: standardUser._id,
      event: wwdcEvent._id,
      tierName: 'Developer Pass',
      unitPrice: 2499,
      quantity: 2,
      subtotal: 4998,
      taxAmount: 250,
      totalAmount: 5248,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentId: 'pay_simulated_apple_9831',
      orderId: 'order_simulated_apple_4102',
      paymentMethod: 'Apple Pay / Credit Card',
      qrCodeDataUrl: qrCode,
    });

    // Create a sample review
    await Review.create({
      user: standardUser._id,
      event: wwdcEvent._id,
      rating: 5,
      comment: 'An absolute benchmark in event production and architectural elegance. Everything from check-in to spatial audio keynote staging was sublime.',
    });

    // Create a welcome notification
    await Notification.create({
      user: standardUser._id,
      title: 'Welcome to Apple Events Experience',
      message: 'Explore world-class keynotes, summits, and musical performances. Your ticket to WWDC26 is ready.',
      type: 'system',
      link: '/user/bookings',
    });

    console.log('[Seeder] Database successfully seeded with Apple-grade sample data!');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]', error);
    process.exit(1);
  }
};

seedDatabase();
