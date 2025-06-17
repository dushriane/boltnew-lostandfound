# University Lost & Found System 🎓📱

A comprehensive web application designed to help university communities reunite with their lost belongings through smart matching technology and seamless user experience.

![University Lost & Found System](https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## 🌟 About the Project

### Inspiration
The idea for this project came from observing the daily struggles of university students and faculty who lose personal items on campus. Traditional lost and found systems rely on manual checking and word-of-mouth, which often results in items never being reunited with their owners. We wanted to create a digital solution that leverages modern technology to automate the matching process and increase the success rate of item recovery.

### What We Learned
- **AI Integration**: Implementing computer vision for image analysis and description enhancement
- **Pattern Matching**: Developing sophisticated algorithms to match lost and found items based on multiple criteria
- **Real-time Notifications**: Building a comprehensive notification system with email integration
- **Payment Integration**: Implementing mobile money solutions specific to Rwanda's financial ecosystem
- **Role-based Authentication**: Creating secure access controls for different user types
- **State Management**: Using Zustand for efficient and persistent data management

### How We Built It
The project was built using modern web technologies with a focus on user experience and scalability:

1. **Frontend Architecture**: React with TypeScript for type safety and better development experience
2. **State Management**: Zustand for lightweight and efficient state management
3. **UI/UX Design**: Tailwind CSS for responsive and modern interface design
4. **Matching Algorithm**: Custom pattern-matching system with weighted criteria
5. **AI Integration**: Computer vision for image analysis and description enhancement
6. **Authentication**: Role-based access control with persistent sessions
7. **Payment System**: Mobile money integration for Rwanda's financial ecosystem

### Challenges Faced
- **Complex Matching Logic**: Developing an algorithm that accurately matches items based on multiple criteria while avoiding false positives
- **Real-time Updates**: Ensuring that matches and notifications are processed and delivered in real-time
- **Image Processing**: Implementing AI-powered image analysis for better matching accuracy
- **Payment Integration**: Adapting to Rwanda's mobile money ecosystem with proper validation
- **User Experience**: Balancing feature richness with simplicity and ease of use
- **Data Persistence**: Managing complex relationships between users, items, matches, and notifications

## 🚀 Features

### 🔐 Authentication & User Management
- **Role-based Access Control**: Students, Faculty, and Admin roles
- **University Email Validation**: Secure registration with institutional email
- **Persistent Sessions**: Stay logged in across browser sessions
- **Profile Management**: Department and student ID tracking

### 📱 Item Management
- **Report Lost/Found Items**: Comprehensive form with image upload
- **AI-Enhanced Descriptions**: Automatic image analysis and description improvement
- **Category Organization**: Electronics, Personal Items, Bags, Keys, etc.
- **Status Tracking**: Active, Matched, Resolved, Claimed

### 🎯 Smart Matching System
- **Multi-criteria Matching**: Category, location, description, color, brand, size, date
- **AI-Powered Analysis**: Image similarity and description enhancement
- **Confidence Scoring**: Percentage-based match reliability
- **Automatic Notifications**: Email alerts for potential matches

### 💳 Payment Integration (Rwanda)
- **MTN Mobile Money**: Native MoMo payment support
- **Airtel Money**: Alternative mobile payment option
- **Bank Transfer**: Traditional banking integration
- **Reward System**: Optional rewards for lost items

### 👨‍💼 Admin Dashboard
- **System Overview**: Real-time statistics and analytics
- **Item Verification**: Admin approval system for reported items
- **User Management**: Monitor and manage university users
- **Match Oversight**: Review and manage system-generated matches

### 🔔 Notification System
- **In-app Notifications**: Real-time alerts with unread counters
- **Email Notifications**: Automated match alerts via email
- **Toast Messages**: Instant feedback for user actions
- **Match Updates**: Status changes and confirmations

## 🛠️ Built With

### **Frontend Technologies**
- **React 18** - Modern UI library with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript for better development experience
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **React Router DOM** - Client-side routing and navigation
- **React Hook Form** - Performant forms with easy validation

### **State Management**
- **Zustand** - Lightweight state management with persistence
- **React Hot Toast** - Beautiful toast notifications
- **Date-fns** - Modern date utility library

### **UI Components & Icons**
- **Lucide React** - Beautiful and consistent icon library
- **React Infinite Scroll** - Optimized infinite scrolling component

### **Development Tools**
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and quality assurance
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - Automatic CSS vendor prefixing

### **AI & Image Processing**
- **Computer Vision APIs** - Image analysis and object detection
- **Natural Language Processing** - Description enhancement and keyword extraction
- **Embedding Generation** - Image similarity comparison

### **Payment Integration**
- **Mobile Money APIs** - MTN MoMo and Airtel Money integration
- **Banking APIs** - Traditional bank transfer support
- **Payment Validation** - Rwandan phone number and account validation

### **Deployment & Infrastructure**
- **Netlify** - Static site hosting and deployment
- **Environment Variables** - Secure configuration management
- **Progressive Web App** - Mobile-optimized experience

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Modern web browser

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/university-lost-found.git
   cd university-lost-found
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_PAYMENT_API_URL=your_payment_api_url
```

## 🎮 Usage

### Demo Accounts
```
Admin: admin@university.edu / admin123
Student: john.doe@student.university.edu / student123
Faculty: prof.smith@university.edu / faculty123
```

### Getting Started
1. **Register** with your university email address
2. **Report** a lost or found item with detailed description
3. **Upload images** for AI-enhanced matching
4. **Receive notifications** when potential matches are found
5. **Contact** other users directly through the platform
6. **Send rewards** via mobile money for returned items

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── admin/          # Admin dashboard components
│   └── payments/       # Payment-related components
├── pages/              # Main application pages
├── store/              # Zustand state management
├── utils/              # Utility functions and services
├── types/              # TypeScript type definitions
└── data/               # Mock data and constants
```

## 🤝 Contributing

We welcome contributions from the community! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **University Community** - For inspiring this solution
- **Rwanda ICT Chamber** - For mobile money integration guidance
- **Open Source Community** - For the amazing tools and libraries
- **Beta Testers** - Students and faculty who provided valuable feedback

## 📞 Contact & Support

- **Project Maintainer**: [Your Name](mailto:your.email@university.edu)
- **University IT Support**: [support@university.edu](mailto:support@university.edu)
- **Bug Reports**: [GitHub Issues](https://github.com/yourusername/university-lost-found/issues)

## 🔮 Future Enhancements

- **Mobile App**: Native iOS and Android applications
- **Multi-language Support**: Kinyarwanda, French, and English
- **Advanced AI**: Improved image recognition and matching
- **Campus Map Integration**: Visual location-based searching
- **Blockchain Verification**: Immutable item ownership records
- **Social Features**: User ratings and community feedback

---

**Made with ❤️ for the University Community**

*Helping reunite people with their belongings through technology and community spirit.*