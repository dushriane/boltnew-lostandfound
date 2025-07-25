import type { Item, User } from '../types';

export const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@university.edu',
    password: 'admin123',
    name: 'Lost & Found Admin',
    role: 'admin',
    department: 'Student Services',
    createdAt: new Date('2024-01-01'),
    isActive: true,
  },
  {
    id: '2',
    email: 'john.doe@student.university.edu',
    password: 'student123',
    name: 'John Doe',
    phone: '+250788123456',
    role: 'student',
    studentId: 'ST2024001',
    department: 'Computer Science',
    createdAt: new Date('2024-01-15'),
    isActive: true,
  },
  {
    id: '3',
    email: 'prof.smith@university.edu',
    password: 'faculty123',
    name: 'Prof. Sarah Smith',
    phone: '+250788654321',
    role: 'faculty',
    department: 'Mathematics',
    createdAt: new Date('2024-01-10'),
    isActive: true,
  },
  {
    id: '4',
    email: 'jane.student@student.university.edu',
    password: 'student456',
    name: 'Jane Student',
    phone: '+250788987654',
    role: 'student',
    studentId: 'ST2024002',
    department: 'Engineering',
    createdAt: new Date('2024-01-20'),
    isActive: true,
  },
];

export const mockItems: Item[] = [
  {
    id: '1',
    type: 'lost',
    title: 'Black iPhone 14 Pro',
    description: 'Black iPhone 14 Pro with a clear case. Has a small scratch on the back. Contains important work contacts.',
    category: 'Electronics',
    location: 'Library Building, 2nd Floor',
    dateReported: new Date('2024-01-15'),
    dateOccurred: new Date('2024-01-14'),
    userId: '2',
    contactName: 'John Doe',
    contactEmail: 'john.doe@student.university.edu',
    contactPhone: '+250788123456',
    status: 'active',
    tags: ['phone', 'apple', 'work'],
    color: 'Black',
    brand: 'Apple',
    reward: 5000,
    isVerified: true,
  },
  {
    id: '2',
    type: 'found',
    title: 'iPhone with Clear Case',
    description: 'Found an iPhone with a clear protective case near the study area. Screen is cracked but phone seems to work.',
    category: 'Electronics',
    location: 'Library Building, Study Area',
    dateReported: new Date('2024-01-15'),
    dateOccurred: new Date('2024-01-14'),
    userId: '4',
    contactName: 'Jane Student',
    contactEmail: 'jane.student@student.university.edu',
    contactPhone: '+250788987654',
    status: 'active',
    tags: ['phone', 'cracked', 'study'],
    color: 'Black',
    brand: 'Apple',
    isVerified: true,
  },
  {
    id: '3',
    type: 'lost',
    title: 'Brown Leather Wallet',
    description: 'Brown leather wallet with student ID, bank cards, and some cash. Has a photo of my family inside.',
    category: 'Personal Items',
    location: 'Student Center Cafeteria',
    dateReported: new Date('2024-01-16'),
    dateOccurred: new Date('2024-01-16'),
    userId: '2',
    contactName: 'John Doe',
    contactEmail: 'john.doe@student.university.edu',
    status: 'active',
    tags: ['wallet', 'leather', 'cash', 'cards'],
    color: 'Brown',
    brand: 'Coach',
    isVerified: false,
  },
  {
    id: '4',
    type: 'found',
    title: 'Leather Wallet',
    description: 'Found a brown leather wallet near the cafeteria entrance. Contains ID and cards.',
    category: 'Personal Items',
    location: 'Student Center Entrance',
    dateReported: new Date('2024-01-16'),
    dateOccurred: new Date('2024-01-16'),
    userId: '3',
    contactName: 'Prof. Sarah Smith',
    contactEmail: 'prof.smith@university.edu',
    status: 'active',
    tags: ['wallet', 'cafeteria', 'id'],
    color: 'Brown',
    isVerified: true,
  },
  {
    id: '5',
    type: 'lost',
    title: 'Blue Jansport Backpack',
    description: 'Navy blue Jansport backpack containing MacBook Pro, charger, and textbooks. Lost during morning class.',
    category: 'Bags',
    location: 'Engineering Building, Room 201',
    dateReported: new Date('2024-01-17'),
    dateOccurred: new Date('2024-01-17'),
    userId: '4',
    contactName: 'Jane Student',
    contactEmail: 'jane.student@student.university.edu',
    contactPhone: '+250788987654',
    status: 'active',
    tags: ['backpack', 'laptop', 'student', 'class'],
    color: 'Blue',
    brand: 'Jansport',
    reward: 10000,
    isVerified: true,
  },
  {
    id: '6',
    type: 'found',
    title: 'Set of Car Keys',
    description: 'Found a set of car keys with Toyota key fob and house keys on a keychain that says "Best Dad Ever".',
    category: 'Keys',
    location: 'Parking Lot B',
    dateReported: new Date('2024-01-18'),
    dateOccurred: new Date('2024-01-18'),
    userId: '3',
    contactName: 'Prof. Sarah Smith',
    contactEmail: 'prof.smith@university.edu',
    status: 'active',
    tags: ['keys', 'toyota', 'keychain'],
    brand: 'Toyota',
    isVerified: true,
  },
];

export const categories = [
  'Electronics',
  'Personal Items',
  'Bags',
  'Keys',
  'Jewelry',
  'Clothing',
  'Documents',
  'Sports Equipment',
  'Books',
  'Other'
];

export const colors = [
  'Black',
  'White',
  'Brown',
  'Blue',
  'Red',
  'Green',
  'Yellow',
  'Gray',
  'Silver',
  'Gold',
  'Pink',
  'Purple',
  'Orange',
  'Other'
];