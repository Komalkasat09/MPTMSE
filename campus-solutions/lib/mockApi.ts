// /lib/mockApi.ts

import initialUsers from '../data/users.json';
import initialTasks from '../data/tasks.json';
import initialCommittees from '../data/committees.json';
import initialEvents from '../data/events.json';
import initialSickLeaves from '../data/sickLeaves.json';

const getFromStorage = (key: string, initialData: any[]) => {
  if (typeof window === 'undefined') return initialData;
  const storedValue = localStorage.getItem(key);
  if (!storedValue) {
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
  }
  try { return JSON.parse(storedValue); } catch (error) { return initialData; }
};

const saveToStorage = (key: string, data: any) => {
  if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(data));
};

export const api = {
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
  getDashboardTasks: (): Promise<any[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const tasks = getFromStorage('tasks', initialTasks);
            const users = getFromStorage('users', initialUsers);
            const enrichedTasks = tasks.map((task: { postedBy: any; }) => {
                const author = users.find((user: { id: any; }) => user.id === task.postedBy);
                return {
                    ...task,
                    postedByName: author ? author.name : 'Unknown',
                };
            });
            resolve(enrichedTasks);
        }, 400);
    });
  },
  getCommittees: (): Promise<any[]> => new Promise((resolve) => setTimeout(() => resolve(getFromStorage('committees', initialCommittees)), 300)),
  getEvents: (): Promise<any[]> => new Promise((resolve) => setTimeout(() => resolve(getFromStorage('events', initialEvents)), 300)),
  getStudentAttendance: (studentId: string): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sickLeaves = getFromStorage('sickLeaves', initialSickLeaves);
      // In a real app, you'd also fetch approved event attendance
      // For now, we'll just show sick leaves
      const studentRecords = sickLeaves.filter((leave: { studentId: string; }) => leave.studentId === studentId);
      resolve(studentRecords);
    }, 500);
  });
},

submitSickLeave: (leaveData: { studentId: string; startDate: string; endDate: string; reason: string; }): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sickLeaves = getFromStorage('sickLeaves', initialSickLeaves);
      const newLeave = {
        id: `sick-${Date.now()}`,
        ...leaveData,
        proofUrl: "/proof/simulated_upload.pdf", // Simulate file upload
        status: 'pending',
        facultyApproverId: 'faculty-1' // Simulate assigning to a default faculty
      };
      sickLeaves.push(newLeave);
      saveToStorage('sickLeaves', sickLeaves);
      resolve({ success: true, message: 'Sick leave submitted for approval.' });
    }, 800);
  });
},

getStudentProfile: (studentId: string): Promise<any | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const users = getFromStorage('users', initialUsers);
      const profile = users.find((user: { id: string; role: string; }) => user.id === studentId && user.role === 'student');
      resolve(profile || null);
    }, 300);
  });
},

updateStudentProfile: (studentId: string, updatedData: any): Promise<{ success: boolean; message: string; user: any }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let users = getFromStorage('users', initialUsers);
      const userIndex = users.findIndex((user: { id: string; }) => user.id === studentId);

      if (userIndex === -1) {
        return resolve({ success: false, message: 'User not found.', user: null });
      }

      // Update the user's data
      users[userIndex] = { ...users[userIndex], ...updatedData };
      saveToStorage('users', users);

      // Also update the session storage if the current user is being edited
      const sessionUser = JSON.parse(localStorage.getItem('campus-user-session') || '{}');
      if (sessionUser.id === studentId) {
        localStorage.setItem('campus-user-session', JSON.stringify(users[userIndex]));
      }

      resolve({ success: true, message: 'Profile updated successfully!', user: users[userIndex] });
    }, 800);
  });
},
};