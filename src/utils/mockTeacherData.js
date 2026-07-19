// Stateful Mock Data for Teacher Dashboard - CryptoCode

const INITIAL_TEACHER_PROFILE = {
  name: "Prof. Patil",
  role: "teacher",
  avatar: "PP",
  department: "Computer Engineering Department",
  college: "ABC College of Engineering",
  email: "patil@abccollege.edu.in",
  phone: "+91 9876543210",
  joinedOn: "15 Aug 2024"
};

const INITIAL_PRACTICALS = [
  {
    id: "p1",
    title: "Java Sorting Algorithms",
    description: "Write programs to implement Bubble Sort, Selection Sort, and Insertion Sort. Analyze time complexity for different input sizes.",
    batch: "Second Year - Batch A",
    deadline: "2026-07-25T23:59",
    languages: ["Java"],
    status: "Active",
    submissionsCount: 45
  },
  {
    id: "p2",
    title: "Python Stack Implementation",
    description: "Implement a Stack data structure using lists in Python. Include push, pop, peek, and isEmpty methods.",
    batch: "Second Year - Batch B",
    deadline: "2026-07-28T23:59",
    languages: ["Python"],
    status: "Active",
    submissionsCount: 38
  },
  {
    id: "p3",
    title: "C Linked List Operations",
    description: "Implement a Singly Linked List in C with insertion at head, deletion of a node, and reverse list functions.",
    batch: "Second Year - All Batches",
    deadline: "2026-07-20T23:59",
    languages: ["C"],
    status: "Active",
    submissionsCount: 52
  },
  {
    id: "p4",
    title: "Binary Search Tree",
    description: "Construct a BST in C++ and implement Inorder, Preorder, and Postorder traversals.",
    batch: "Third Year - Batch A",
    deadline: "2026-08-02T23:59",
    languages: ["C++"],
    status: "Active",
    submissionsCount: 12
  }
];

const INITIAL_STUDENTS = [
  {
    rollNo: "CS23015",
    name: "Rahul Patil",
    branch: "Computer",
    year: "2nd Year",
    batch: "A1",
    subject: "Java Programming",
    email: "rahulpatil@gmail.com",
    joinedOn: "15 Aug 2024",
    status: "Active",
    progress: 82,
    avgScore: 88,
    lastActive: "Today, 10:30 AM",
    problemsSolved: 42,
    assignmentsCompleted: 18,
    acceptanceRate: 88
  },
  {
    rollNo: "CS23016",
    name: "Sneha More",
    branch: "Computer",
    year: "2nd Year",
    batch: "A2",
    subject: "Java Programming",
    email: "snehamore@gmail.com",
    joinedOn: "18 Aug 2024",
    status: "Active",
    progress: 74,
    avgScore: 75,
    lastActive: "Yesterday, 9:15 PM",
    problemsSolved: 35,
    assignmentsCompleted: 15,
    acceptanceRate: 78
  },
  {
    rollNo: "CS23017",
    name: "Amit Shah",
    branch: "IT",
    year: "2nd Year",
    batch: "B1",
    subject: "Java Programming",
    email: "amitshah@gmail.com",
    joinedOn: "12 Aug 2024",
    status: "Active",
    progress: 91,
    avgScore: 92,
    lastActive: "Today, 11:45 AM",
    problemsSolved: 50,
    assignmentsCompleted: 20,
    acceptanceRate: 94
  },
  {
    rollNo: "CS23018",
    name: "Pooja Yadav",
    branch: "Computer",
    year: "2nd Year",
    batch: "A1",
    subject: "Python Programming",
    email: "poojayadav@gmail.com",
    joinedOn: "20 Aug 2024",
    status: "Active",
    progress: 65,
    avgScore: 68,
    lastActive: "2 days ago",
    problemsSolved: 28,
    assignmentsCompleted: 12,
    acceptanceRate: 70
  },
  {
    rollNo: "CS23019",
    name: "Karan Gupta",
    branch: "IT",
    year: "2nd Year",
    batch: "B2",
    subject: "Java Programming",
    email: "karangupta@gmail.com",
    joinedOn: "14 Aug 2024",
    status: "Active",
    progress: 88,
    avgScore: 85,
    lastActive: "Today, 08:20 AM",
    problemsSolved: 45,
    assignmentsCompleted: 19,
    acceptanceRate: 85
  },
  {
    rollNo: "CS23020",
    name: "Neha Singh",
    branch: "Computer",
    year: "2nd Year",
    batch: "A2",
    subject: "Python Programming",
    email: "nehasingh@gmail.com",
    joinedOn: "19 Aug 2024",
    status: "Active",
    progress: 70,
    avgScore: 78,
    lastActive: "Yesterday, 04:30 PM",
    problemsSolved: 32,
    assignmentsCompleted: 14,
    acceptanceRate: 80
  }
];

const INITIAL_SUBMISSIONS = [
  {
    id: "s1",
    studentRoll: "CS23015",
    studentName: "Rahul Patil",
    practicalTitle: "Sorting Algorithms",
    practicalId: "p1",
    language: "Java",
    status: "Accepted",
    score: 100,
    submittedOn: "12 Jul 2026, 10:30 AM",
    timeTaken: "0.24 sec",
    memoryUsed: "18 MB",
    system: "Judge0 CE",
    code: `public class Main {
    public static void main(String[] args) {
        int arr[] = {5, 1, 4, 2, 8};
        Arrays.sort(arr);
        for(int i = 0; i < arr.length; i++){
            System.out.print(arr[i] + " ");
        }
    }
}`,
    output: "1 2 4 5 8"
  },
  {
    id: "s2",
    studentRoll: "CS23015",
    studentName: "Rahul Patil",
    practicalTitle: "Stack using Array",
    practicalId: "p2",
    language: "Java",
    status: "Accepted",
    score: 95,
    submittedOn: "10 Jul 2026, 09:15 AM",
    timeTaken: "0.18 sec",
    memoryUsed: "16 MB",
    system: "Judge0 CE",
    code: `import java.util.Stack;
public class Main {
    public static void main(String[] args) {
        Stack<Integer> s = new Stack<>();
        s.push(10);
        s.push(20);
        System.out.println(s.pop());
        System.out.println(s.peek());
    }
}`,
    output: "20\n10"
  },
  {
    id: "s3",
    studentRoll: "CS23015",
    studentName: "Rahul Patil",
    practicalTitle: "Queue Implementation",
    practicalId: "p3",
    language: "Java",
    status: "Wrong Answer",
    score: 40,
    submittedOn: "08 Jul 2026, 07:45 PM",
    timeTaken: "0.15 sec",
    memoryUsed: "15 MB",
    system: "Judge0 CE",
    code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Queue overflow");
    }
}`,
    output: "Queue Overflow"
  },
  {
    id: "s4",
    studentRoll: "CS23015",
    studentName: "Rahul Patil",
    practicalTitle: "Linked List",
    practicalId: "p3",
    language: "Java",
    status: "Accepted",
    score: 90,
    submittedOn: "05 Jul 2026, 11:20 AM",
    timeTaken: "0.22 sec",
    memoryUsed: "17 MB",
    system: "Judge0 CE",
    code: `class Node {
    int data;
    Node next;
    Node(int d) { data = d; next = null; }
}`,
    output: "List created successfully"
  },
  {
    id: "s5",
    studentRoll: "CS23015",
    studentName: "Rahul Patil",
    practicalTitle: "Recursion",
    practicalId: "p1",
    language: "Java",
    status: "Compilation Error",
    score: 0,
    submittedOn: "02 Jul 2026, 08:10 PM",
    timeTaken: "0.00 sec",
    memoryUsed: "0 MB",
    system: "Judge0 CE",
    code: `public class Main {
    public static void main(String[] args) {
        System.out.print(factorial(5))
    }
}`,
    output: "error: ';' expected\n        System.out.print(factorial(5))\n                                      ^"
  },
  {
    id: "s6",
    studentRoll: "CS23016",
    studentName: "Sneha More",
    practicalTitle: "Python Stack Implementation",
    practicalId: "p2",
    language: "Python",
    status: "Accepted",
    score: 100,
    submittedOn: "Yesterday, 9:15 PM",
    timeTaken: "0.08 sec",
    memoryUsed: "8 MB",
    system: "Judge0 CE",
    code: `class Stack:
    def __init__(self):
        self.items = []
    def push(self, item):
        self.items.append(item)
    def pop(self):
        return self.items.pop()
s = Stack()
s.push(5)
print(s.pop())`,
    output: "5"
  }
];

const INITIAL_ACTIVITIES = [
  { id: "a1", text: "Rahul Patil submitted Java Practical 5", time: "10:30 AM", type: "submission" },
  { id: "a2", text: "Sneha More completed Python Assignment", time: "Yesterday, 9:15 PM", type: "completion" },
  { id: "a3", text: "20 new submissions received in Java Sorting", time: "Yesterday, 7:45 PM", type: "submissions_count" },
  { id: "a4", text: "Practical 3 (C Linked List) deadline is tomorrow", time: "Today, 8:00 AM", type: "reminder" },
  { id: "a5", text: "Teacher comments updated on Amit Shah's code", time: "3 days ago", type: "comment" }
];

const INITIAL_ANALYTICS = {
  weeklyTrend: [
    { name: "Mon", submissions: 20 },
    { name: "Tue", submissions: 45 },
    { name: "Wed", submissions: 32 },
    { name: "Thu", submissions: 58 },
    { name: "Fri", submissions: 40 },
    { name: "Sat", submissions: 15 },
    { name: "Sun", submissions: 25 }
  ],
  languageUsage: [
    { name: "Java", value: 70, color: "#8b5cf6" },
    { name: "Python", value: 20, color: "#3b82f6" },
    { name: "C", value: 10, color: "#06b6d4" }
  ],
  submissionStatus: [
    { name: "Accepted", value: 88, color: "#10b981" },
    { name: "Wrong Answer", value: 8, color: "#f59e0b" },
    { name: "Runtime Error", value: 3, color: "#ef4444" },
    { name: "Compile Error", value: 1, color: "#6b7280" }
  ],
  problemsSolvedOverTime: [
    { name: "Jan", solved: 15 },
    { name: "Feb", solved: 22 },
    { name: "Mar", solved: 30 },
    { name: "Apr", solved: 38 },
    { name: "May", solved: 45 },
    { name: "Jun", solved: 55 }
  ],
  scoreTrend: [
    { name: "Jan", score: 72 },
    { name: "Feb", score: 78 },
    { name: "Mar", score: 85 },
    { name: "Apr", score: 81 },
    { name: "May", score: 88 },
    { name: "Jun", score: 91 }
  ],
  weeklyActivityGrid: [
    { day: "Mon", hr0: 2, hr4: 5, hr8: 12, hr12: 18, hr16: 14, hr20: 8 },
    { day: "Tue", hr0: 1, hr4: 4, hr8: 15, hr12: 22, hr16: 16, hr20: 10 },
    { day: "Wed", hr0: 3, hr4: 2, hr8: 10, hr12: 25, hr16: 15, hr20: 12 },
    { day: "Thu", hr0: 2, hr4: 6, hr8: 18, hr12: 30, hr16: 20, hr20: 15 },
    { day: "Fri", hr0: 4, hr4: 8, hr8: 14, hr12: 20, hr16: 18, hr20: 9 },
    { day: "Sat", hr0: 0, hr4: 1, hr8: 5, hr12: 8, hr16: 10, hr20: 5 },
    { day: "Sun", hr0: 1, hr4: 2, hr8: 4, hr12: 12, hr16: 12, hr20: 6 }
  ]
};

const getFromStorage = (key, defaultVal) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

const setToStorage = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error("Storage error:", e);
  }
};

export const mockTeacherData = {
  // Profile
  getProfile: () => getFromStorage("cc_teacher_profile", INITIAL_TEACHER_PROFILE),
  updateProfile: (updated) => {
    const current = mockTeacherData.getProfile();
    const next = { ...current, ...updated };
    setToStorage("cc_teacher_profile", next);
    return next;
  },

  // Practicals
  getPracticals: () => getFromStorage("cc_teacher_practicals", INITIAL_PRACTICALS),
  createPractical: (practical) => {
    const current = mockTeacherData.getPracticals();
    const newPractical = {
      ...practical,
      id: "p_" + Date.now(),
      submissionsCount: 0,
      status: "Active"
    };
    const next = [newPractical, ...current];
    setToStorage("cc_teacher_practicals", next);
    return newPractical;
  },
  updatePractical: (id, updatedFields) => {
    const current = mockTeacherData.getPracticals();
    const next = current.map(p => p.id === id ? { ...p, ...updatedFields } : p);
    setToStorage("cc_teacher_practicals", next);
    return next.find(p => p.id === id);
  },
  deletePractical: (id) => {
    const current = mockTeacherData.getPracticals();
    const next = current.filter(p => p.id !== id);
    setToStorage("cc_teacher_practicals", next);
    return next;
  },

  // Students
  getStudents: () => getFromStorage("cc_teacher_students", INITIAL_STUDENTS),
  getStudentByRoll: (rollNo) => {
    return mockTeacherData.getStudents().find(s => s.rollNo === rollNo);
  },

  // Submissions
  getSubmissions: () => getFromStorage("cc_teacher_submissions", INITIAL_SUBMISSIONS),
  getSubmissionById: (id) => {
    return mockTeacherData.getSubmissions().find(s => s.id === id);
  },
  getSubmissionsByStudent: (rollNo) => {
    return mockTeacherData.getSubmissions().filter(s => s.studentRoll === rollNo);
  },
  createSubmission: (submission) => {
    const current = mockTeacherData.getSubmissions();
    const newSub = {
      ...submission,
      id: "s_" + Date.now(),
      submittedOn: new Date().toLocaleString()
    };
    const next = [newSub, ...current];
    setToStorage("cc_teacher_submissions", next);
    return newSub;
  },

  // Recent Activity
  getActivities: () => getFromStorage("cc_teacher_activities", INITIAL_ACTIVITIES),
  addActivity: (text, type = "notification") => {
    const current = mockTeacherData.getActivities();
    const newAct = {
      id: "act_" + Date.now(),
      text,
      time: "Just Now",
      type
    };
    const next = [newAct, ...current.slice(0, 19)]; // Keep max 20 activities
    setToStorage("cc_teacher_activities", next);
    return next;
  },

  // Analytics
  getAnalytics: () => INITIAL_ANALYTICS, // Analytics remains read-only mock configuration

  // Reset
  resetAll: () => {
    localStorage.removeItem("cc_teacher_profile");
    localStorage.removeItem("cc_teacher_practicals");
    localStorage.removeItem("cc_teacher_students");
    localStorage.removeItem("cc_teacher_submissions");
    localStorage.removeItem("cc_teacher_activities");
  }
};
