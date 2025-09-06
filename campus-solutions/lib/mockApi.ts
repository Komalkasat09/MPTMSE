// /lib/mockApi.ts

import initialUsers from '../data/users.json';
import initialTasks from '../data/tasks.json';
import initialCommittees from '../data/committees.json';
import initialEvents from '../data/events.json';
import initialApplications from '../data/applications.json';
import initialSickLeaves from '../data/sickLeaves.json';
import initialChannels from '../data/channels.json';
import initialMessages from '../data/messages.json';
import initialAchievements from '../data/achievements.json';
import initialFeedback from '../data/feedback.json';


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
        const user = users.find((u: any) => u.email === email && u.password === password);
        if (user) resolve({ success: true, user, message: 'Login successful!' });
        else resolve({ success: false, message: 'Invalid email or password.' });
      }, 500);
    });
  },
  signupStudent: (studentData: any): Promise<{ success: boolean; user?: any; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let users = getFromStorage('users', initialUsers);
        if (users.find((u: any) => u.email === studentData.email || u.sapId === studentData.sapId)) {
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
        if (users.find((u: any) => u.email === facultyData.email)) {
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
        if (users.find((u: any) => u.email === committeeData.email)) {
          return resolve({ success: false, message: 'A committee with that Email already exists.' });
        }
        const newUser = { id: `committee-${Date.now()}`, role: 'committee', ...committeeData };
        users.push(newUser);
        saveToStorage('users', users);
        resolve({ success: true, user: newUser, message: 'Committee account created! Please log in.' });
      }, 500);
    });
  },
  getStudentAttendance: (studentId: string): Promise<any[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sickLeaves = getFromStorage('sickLeaves', initialSickLeaves);
        const studentRecords = sickLeaves.filter((leave: any) => leave.studentId === studentId);
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
          proofUrl: "/proof/simulated_upload.pdf",
          status: 'pending',
          facultyApproverId: 'faculty-1'
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
        const profile = users.find((user: any) => user.id === studentId && user.role === 'student');
        resolve(profile || null);
      }, 300);
    });
  },
  updateStudentProfile: (studentId: string, updatedData: any): Promise<{ success: boolean; message: string; user: any }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let users = getFromStorage('users', initialUsers);
        const userIndex = users.findIndex((user: any) => user.id === studentId);
        if (userIndex === -1) {
          return resolve({ success: false, message: 'User not found.', user: null });
        }
        users[userIndex] = { ...users[userIndex], ...updatedData };
        saveToStorage('users', users);
        const sessionUser = JSON.parse(localStorage.getItem('campus-user-session') || '{}');
        if (sessionUser.id === studentId) {
          localStorage.setItem('campus-user-session', JSON.stringify(users[userIndex]));
        }
        resolve({ success: true, message: 'Profile updated successfully!', user: users[userIndex] });
      }, 800);
    });
  },
  getDashboardTasks: (): Promise<any[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const tasks = getFromStorage('tasks', initialTasks);
            const users = getFromStorage('users', initialUsers);
            const committees = getFromStorage('committees', initialCommittees);
            const enrichedTasks = tasks.map((task: any) => {
                let author = users.find((user: any) => user.id === task.postedBy);
                if (!author) {
                  author = committees.find((committee: any) => committee.id === task.postedBy);
                }
                return {
                    ...task,
                    postedByName: author ? author.name : 'Unknown',
                    matchScore: task.matchScore || 0, // Preserve match score
                };
            });
            resolve(enrichedTasks);
        }, 400);
    });
  },
  getTasksForExplorer: (studentId: string): Promise<any[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
          const tasks = getFromStorage('tasks', initialTasks);
          const users = getFromStorage('users', initialUsers);
          const committees = getFromStorage('committees', initialCommittees);
          const applications = getFromStorage('applications', initialApplications);
          const enrichedTasks = tasks.map((task: any) => {
              let author = users.find((user: any) => user.id === task.postedBy);
              if (!author) {
                author = committees.find((committee: any) => committee.id === task.postedBy);
              }
              const hasApplied = applications.some((app: any) => app.studentId === studentId && app.taskId === task.id);
              return {
                  ...task,
                  postedByName: author ? author.name : 'Unknown',
                  hasApplied: hasApplied,
              };
          });
          resolve(enrichedTasks);
      }, 500);
    });
  },
  submitApplication: (appData: { studentId: string; taskId: string; motivation: string; useProfileResume: boolean; }): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
          const applications = getFromStorage('applications', initialApplications);
          const existingApp = applications.find((app: any) => app.studentId === appData.studentId && app.taskId === appData.taskId);
          if (existingApp) {
            return resolve({ success: false, message: 'You have already applied for this task.' });
          }
          const newApp = {
              id: `app-${Date.now()}`,
              studentId: appData.studentId,
              taskId: appData.taskId,
              motivation: appData.motivation,
              resumeSource: appData.useProfileResume ? 'profile' : 'manual_upload',
              submittedAt: new Date().toISOString(),
              status: 'pending'
          };
          applications.push(newApp);
          saveToStorage('applications', applications);
          resolve({ success: true, message: 'Application submitted successfully!' });
      }, 800);
    });
  },
  getCommittees: (): Promise<any[]> => new Promise((resolve) => setTimeout(() => resolve(getFromStorage('committees', initialCommittees)), 300)),
  getEvents: (): Promise<any[]> => new Promise((resolve) => setTimeout(() => resolve(getFromStorage('events', initialEvents)), 300)),
  // Add these three new functions inside the `api` object in /lib/mockApi.ts

getChatData: (userId: string): Promise<{ channels: any[], users: any[] }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const allChannels = getFromStorage('channels', initialChannels);
            const allUsers = getFromStorage('users', initialUsers);
            // For now, let's assume the user has access to all public/committee channels
            // In a real app, this would be based on their memberships
            resolve({ channels: allChannels, users: allUsers });
        }, 400);
    });
},

getMessagesForChannel: (channelId: string): Promise<any[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const allMessages = getFromStorage('messages', initialMessages);
            const channelMessages = allMessages.filter((m: any) => m.channelId === channelId);
            resolve(channelMessages);
        }, 200);
    });
},

sendMessage: (messageData: 
    { channelId: string; 
        authorId: string; 
        content: string
        imageUrl?: string; }):
         
        Promise<{ success: boolean; 
        message: any }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const messages = getFromStorage('messages', initialMessages);
            const newMessage = {
                id: `msg-${Date.now()}`,
                ...messageData,
                timestamp: new Date().toISOString()
            };
            messages.push(newMessage);
            
            // Check if this should trigger an auto-reply
            const shouldAutoReply = messageData.channelId === 'dm-vidhi-kavish' && 
                (messageData.content.toLowerCase().includes('hi') || 
                 messageData.content.toLowerCase().includes('hello') ||
                 messageData.content.toLowerCase().includes('hey') ||
                 messageData.content.toLowerCase().includes('how are you'));
            
            if (shouldAutoReply) {
                // Add auto-reply after a 2-second delay
                setTimeout(() => {
                    const updatedMessages = getFromStorage('messages', initialMessages);
                    const replyMessage = {
                        id: `msg-${Date.now()}`,
                        channelId: messageData.channelId,
                        authorId: 'student-2', // Kavish's ID
                        content: "Hii! How's it going? 😊",
                        timestamp: new Date().toISOString()
                    };
                    updatedMessages.push(replyMessage);
                    saveToStorage('messages', updatedMessages);
                }, 2000); // 2 second delay for auto-reply
            }
            
            saveToStorage('messages', messages);
            resolve({ success: true, message: newMessage });
        }, 300); // Simulate network latency
    });
},
    getCollegeAchievements: (): Promise<any[]> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const achievements = getFromStorage('achievements', initialAchievements);
          const users = getFromStorage('users', initialUsers);

          // Enrich each achievement with the student's name and branch
          const enrichedAchievements = achievements
            .filter((ach: any) => ach.approved) // Only show approved achievements
            .map((achievement: any) => {
              const student = users.find((user: any) => user.id === achievement.studentId);
              return {
                ...achievement,
                studentName: student ? student.name : 'Unknown Student',
                studentBranch: student ? student.branch : 'N/A',
              };
            })
            // Sort by most recent date first
            .sort((a: { date: string | number | Date; }, b: { date: string | number | Date; }) => new Date(b.date).getTime() - new Date(a.date).getTime());

          resolve(enrichedAchievements);
        }, 600);
      });
    },
// Add these two new functions inside the `api` object in /lib/mockApi.ts

getFeedbackTargets: (): Promise<{ committees: any[], faculty: any[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const committees = getFromStorage('committees', initialCommittees);
      const users = getFromStorage('users', initialUsers);
      const faculty = users.filter((user: any) => user.role === 'faculty');
      resolve({ committees, faculty });
    }, 400);
  });
},

submitFeedback: (feedbackData: {
  studentId: string;
  targetId: string;
  targetType: 'committee' | 'faculty';
  rating: number;
  comment: string;
  isAnonymous: boolean;
}): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const feedback = getFromStorage('feedback', initialFeedback);
      const newFeedback = {
        id: `feedback-${Date.now()}`,
        ...feedbackData,
        submittedAt: new Date().toISOString(),
      };
      feedback.push(newFeedback);
      saveToStorage('feedback', feedback);
      resolve({ success: true, message: 'Thank you! Your feedback has been submitted.' });
    }, 800);
  });
},
};