// /lib/mockApi.ts

import initialUsers from '../data/users.json';
import initialTasks from '../data/tasks.json';
import initialCommittees from '../data/committees.json';
import initialEvents from '../data/events.json';

// A generic helper function to get data from localStorage or use the initial seed data
const getFromStorage = (key: string, initialData: any[]) => {
  if (typeof window === 'undefined') return initialData;
  const storedValue = localStorage.getItem(key);
  if (!storedValue) {
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
  }
  try { return JSON.parse(storedValue); } catch (error) { return initialData; }
};

// A generic helper function to save data to localStorage
const saveToStorage = (key: string, data: any) => {
  if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(data));
};

// --- Our Expanded Mock API Function Library ---

export const api = {
  // AUTHENTICATION
  login: (email: string, password: string): Promise<{ success: boolean; user?: any; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = getFromStorage('users', initialUsers);
        const user = users.find((u: { email: string; password: string; }) => u.email === email && u.password === password);
        if (user) resolve({ success: true, user, message: 'Login successful!' });
        else resolve({ success: false, message: 'Invalid email or password.' });
      }, 500);
    });
  },

  signupStudent: (studentData: any): Promise<{ success: boolean; user?: any; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let users = getFromStorage('users', initialUsers);
        if (users.find((u: { email: any; sapId: any; }) => u.email === studentData.email || u.sapId === studentData.sapId)) {
          return resolve({ success: false, message: 'A user with that Email or SAP ID already exists.' });
        }
        const newUser = { id: `student-${Date.now()}`, role: 'student', ...studentData };
        users.push(newUser);
        saveToStorage('users', users);
        resolve({ success: true, user: newUser, message: 'Signup successful! Please log in.' });
      }, 500);
    });
  },

  // NEW: Faculty Signup Logic
  signupFaculty: (facultyData: any): Promise<{ success: boolean; user?: any; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let users = getFromStorage('users', initialUsers);
        if (users.find((u: { email: any; }) => u.email === facultyData.email)) {
          return resolve({ success: false, message: 'A user with that Email already exists.' });
        }
        const newUser = { id: `faculty-${Date.now()}`, role: 'faculty', ...facultyData };
        users.push(newUser);
        saveToStorage('users', users);
        resolve({ success: true, user: newUser, message: 'Faculty account created! Please log in.' });
      }, 500);
    });
  },

  // NEW: Committee Signup Logic
  signupCommittee: (committeeData: any): Promise<{ success: boolean; user?: any; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let users = getFromStorage('users', initialUsers);
        if (users.find((u: { email: any; }) => u.email === committeeData.email)) {
          return resolve({ success: false, message: 'A committee with that Email already exists.' });
        }
        const newUser = { id: `committee-${Date.now()}`, role: 'committee', ...committeeData };
        users.push(newUser);
        saveToStorage('users', users);
        resolve({ success: true, user: newUser, message: 'Committee account created! Please log in.' });
      }, 500);
    });
  },

  // DATA FETCHING
  getTasks: (): Promise<any[]> => new Promise((resolve) => setTimeout(() => resolve(getFromStorage('tasks', initialTasks)), 300)),
  getCommittees: (): Promise<any[]> => new Promise((resolve) => setTimeout(() => resolve(getFromStorage('committees', initialCommittees)), 300)),
  getEvents: (): Promise<any[]> => new Promise((resolve) => setTimeout(() => resolve(getFromStorage('events', initialEvents)), 300)),
};