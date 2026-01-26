export async function getOverviewData() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    students: {
      value: 1245,
      growthRate: 2.43,
    },
    teachers: {
      value: 68,
      growthRate: 1.35,
    },
    classes: {
      value: 42,
      growthRate: 0.59,
    },
    attendance: {
      value: 94.2,
      growthRate: 0.95,
    },
  };
}

export async function getRecentActivityData() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    {
      name: "Sarah Johnson",
      profile: "/images/user/student-01.png",
      isActive: true,
      lastActivity: {
        content: "Submitted Math assignment",
        type: "assignment",
        timestamp: "2024-12-19T14:30:00Z",
        isRead: false,
      },
      unreadCount: 2,
    },
    {
      name: "Mr. David Wilson",
      profile: "/images/user/teacher-01.png",
      isActive: true,
      lastActivity: {
        content: "Graded Science tests",
        type: "grade",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      name: "Michael Brown",
      profile: "/images/user/student-02.png",
      isActive: false,
      lastActivity: {
        content: "Asked question in Physics",
        type: "question",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      name: "Mrs. Lisa Garcia",
      profile: "/images/user/teacher-02.png",
      isActive: false,
      lastActivity: {
        content: "Posted new assignment",
        type: "assignment",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 1,
    },
    {
      name: "Emily Chen",
      profile: "/images/user/student-03.png",
      isActive: false,
      lastActivity: {
        content: "Completed English homework",
        type: "homework",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
  ];
}

// Mock data for charts
export async function getAttendanceData(timeFrame?: string) {
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const data = {
    daily: [
      { day: "Mon", attendance: 92, late: 5, absent: 3 },
      { day: "Tue", attendance: 94, late: 4, absent: 2 },
      { day: "Wed", attendance: 91, late: 6, absent: 3 },
      { day: "Thu", attendance: 95, late: 3, absent: 2 },
      { day: "Fri", attendance: 93, late: 4, absent: 3 },
      { day: "Sat", attendance: 90, late: 5, absent: 5 },
      { day: "Sun", attendance: 88, late: 6, absent: 6 },
    ],
    weekly: [
      { week: "Week 1", attendance: 91, late: 5, absent: 4 },
      { week: "Week 2", attendance: 93, late: 4, absent: 3 },
      { week: "Week 3", attendance: 94, late: 3, absent: 3 },
      { week: "Week 4", attendance: 92, late: 5, absent: 3 },
    ],
    monthly: [
      { month: "Jan", attendance: 91, late: 6, absent: 3 },
      { month: "Feb", attendance: 92, late: 5, absent: 3 },
      { month: "Mar", attendance: 93, late: 4, absent: 3 },
      { month: "Apr", attendance: 94, late: 3, absent: 3 },
      { month: "May", attendance: 95, late: 3, absent: 2 },
      { month: "Jun", attendance: 94, late: 4, absent: 2 },
    ]
  };
  
  return data[timeFrame as keyof typeof data] || data.daily;
}

export async function getPerformanceData(timeFrame?: string) {
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const data = {
    daily: [
      { subject: "Math", average: 85, improvement: 2 },
      { subject: "Science", average: 78, improvement: 1 },
      { subject: "English", average: 82, improvement: 3 },
      { subject: "History", average: 75, improvement: 0 },
      { subject: "Physics", average: 80, improvement: 2 },
    ],
    weekly: [
      { subject: "Math", average: 87, improvement: 3 },
      { subject: "Science", average: 79, improvement: 2 },
      { subject: "English", average: 83, improvement: 4 },
      { subject: "History", average: 76, improvement: 1 },
      { subject: "Physics", average: 81, improvement: 3 },
    ],
    monthly: [
      { subject: "Math", average: 88, improvement: 5 },
      { subject: "Science", average: 80, improvement: 3 },
      { subject: "English", average: 84, improvement: 5 },
      { subject: "History", average: 77, improvement: 2 },
      { subject: "Physics", average: 82, improvement: 4 },
    ]
  };
  
  return data[timeFrame as keyof typeof data] || data.daily;
}