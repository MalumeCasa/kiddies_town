import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    //Comment Here
    // Monama NT
    // Mlaba MS
    //
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "Overview",
            url: "/",
          },
        ],
      },
      {
        title: "Student Management",
        url: "/calendar",
        icon: Icons.Calendar,
        items: [
          {
            title: "Student Directory",
            url: "/dashboard/users/students/"
          },
          {
            title: "Fees",
            url: "/dashboard/fees"
          },
          {
            title: "Attendance",
            url: "/attendance"
          }
        ],
      },
      {
        title: "Academics",
        url: "/profile",
        icon: Icons.User,
        items: [
          {
            title: 'Classes',
            url: '/academics/classes'
          },
          {
            title: 'Subjects',
            url: '/academics/subjects'
          },
          {
            title: 'TimeTable',
            url: '/academics/calendar'
          },
          {
            title: 'Curriculum',
            url: '/academics/curriculum'
          },
          {
            title: 'Timetables',
            url: '/academics/timetables'
          },
          {
            title: 'Exams',
            url: '/academics/exams'
          },
          {
            title: 'Assignments',
            url: '/academics/assignments'
          },
          {
            title: 'Report Cards',
            url: '/academics/report-cards'
          }
        ],
      },
      {
        title: "Staff Management",
        icon: Icons.Alphabet,
        items: [
          {
            title: 'Staff Directory',
            url: '/staff/'
          },
          {
            title: 'Attendance',
            url: '/staff/attendance'
          },
          {
            title: 'Leave Management',
            url: '/staff/leave'
          },
          {
            title: 'Performance',
            url: '/staff/performance'
          },
          {
            title: "Form Elements",
            url: "/forms/form-elements",
          },
          {
            title: "Form Layout",
            url: "/forms/form-layout",
          },
        ],
      },
      {
        title: "Communication",
        url: "/tables",
        icon: Icons.Table,
        items: [
          {
            title: 'Event Calendar',
            url: '/calendar/'
          },
          {
            title: 'Messages',
            url: '/communication/messages'
          },
          {
            title: 'Announcements',
            url: '/communication/announcements'
          },
          {
            title: 'Notice Board',
            url: '/communication/notice-board'
          },
          {
            title: 'Emergency Alerts',
            url: '/communication/emergency-alerts'
          },
          {
            title: "Tables",
            url: "/tables",
          },
        ],
      },
      {
        title: "Finance",
        icon: Icons.Alphabet,
        items: [
          {
            title: 'Fee Management',
            url: '/finance/fee-management'
          },
          {
            title: 'Payments',
            url: '/finance/payments'
          },
          {
            title: 'Scholarships',
            url: '/finance/scholarships'
          },
          {
            title: 'Reports',
            url: '/finance/reports'
          },
          {
            title: "Settings",
            url: "/pages/settings",
          },
        ],
      },
      {
        title: "Transport",
        icon: Icons.Alphabet,
        items: [
          {
            title: 'Routes',
            url: '/transport/routes'
          },
          {
            title: 'Tracking',
            url: '/transport/tracking'
          },
          {
            title: 'Drivers',
            url: '/transport/drivers'
          },
          {
            title: 'Maintenance',
            url: '/transport/maintenance'
          },
          {
            title: "Settings",
            url: "/pages/settings",
          },
        ],
      },
      {
        title: "Resources",
        icon: Icons.Alphabet,
        items: [
          {
            title: 'Library',
            url: '/resources/library'
          },
          {
            title: 'Inventory',
            url: '/resources/inventory'
          },
          {
            title: 'Facilities',
            url: '/resources/facilities'
          },
          {
            title: 'Assests',
            url: '/resources/assets'
          },
          {
            title: "Settings",
            url: "/pages/settings",
          },
        ],
      },
      {
        title: "Reports & Analytics",
        icon: Icons.Alphabet,
        items: [
          {
            title: 'Academic Reports',
            url: '/reports/academic-reports'
          },
          {
            title: 'Financial Reports',
            url: '/reports/financial-reports'
          },
          {
            title: 'Custom Reports',
            url: '/reports/custom-reports'
          },
          {
            title: 'Analytics Dashboard',
            url: '/analytics/dashboard'
          },
          {
            title: "Settings",
            url: "/pages/settings",
          },
        ],
      },
    ],
  },
  {
    label: "OTHERS",
    items: [
      {
        title: "Settings",
        icon: Icons.Alphabet,
        items: [
          {
            title: 'School Profile',
            url: ''
          },
          {
            title: 'User Management',
            url: ''
          },
          {
            title: 'System Settings',
            url: "/pages/settings"
          },
          {
            title: 'Backup & Security',
            url: ''
          }
        ],
      },
      {
        title: "Charts",
        icon: Icons.PieChart,
        items: [
          {
            title: "Basic Chart",
            url: "/charts/basic-chart",
          },
        ],
      },
      {
        title: "UI Elements",
        icon: Icons.FourCircle,
        items: [
          {
            title: "Alerts",
            url: "/ui-elements/alerts",
          },
          {
            title: "Buttons",
            url: "/ui-elements/buttons",
          },
        ],
      },
      {
        title: "Authentication",
        icon: Icons.Authentication,
        items: [
          {
            title: "Sign In",
            url: "/auth/sign-in",
          },
        ],
      },
    ],
  },
];
