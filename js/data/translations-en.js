/**
 * Mindless — English Translation Strings
 * All user-facing text organized by section.
 * Usage: import { translations } from './data/translations-en.js';
 */

export const translations = {
  // ─── App-wide ──────────────────────────────────
  app: {
    name: 'Mindless',
    tagline: "Your family's second brain",
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    done: 'Done',
    next: 'Next',
    back: 'Back',
    skip: 'Skip',
    confirm: 'Confirm',
    search: 'Search',
    filter: 'Filter',
    all: 'All',
    none: 'None',
    today: 'Today',
    tomorrow: 'Tomorrow',
    yesterday: 'Yesterday',
    or: 'or',
    and: 'and',
  },

  // ─── Greeting ──────────────────────────────────
  greeting: {
    morning: 'Good morning',
    afternoon: 'Good afternoon',
    evening: 'Good evening',
    night: 'Good night',
  },

  // ─── Welcome Screen ────────────────────────────
  welcome: {
    feature1: "I'll read your emails so you don't have to.",
    feature2: "I'll create reminders before you forget.",
    feature3: "I'll organize your family's schedule.",
    feature4: "I'll never do anything without asking first.",
    continueGoogle: 'Continue with Google',
    permissionNote: "We'll need access to Gmail and Calendar to help you.",
    alreadyHaveAccount: 'Already have an account?',
    signIn: 'Sign in',
  },

  // ─── Onboarding ────────────────────────────────
  onboarding: {
    title: 'Tell me about your family',
    subtitle: 'Speak or type, whatever you prefer',
    speakOrType: 'Speak or type your answer',
    typeHere: 'Or type here...',
    step1_greeting: "Hi, {name}! Let's set up your family.",
    step2_partner: 'Do you have a partner who helps manage the household?',
    step2_partnerInvite: "Great! Enter their email so they can get reminders too.",
    step2_partnerSkip: "No worries, you can always add one later.",
    step2_partnerEmail: "Partner's email address",
    step2_inviteSent: "Invite sent! They'll get an email to join.",
    step3_familySize: 'How many people live in your home?',
    step4_memberName: "What's {ordinal} person's name?",
    step4_memberBirth: 'When was {name} born?',
    step4_memberRole: 'Is {name} an adult or a child?',
    step5_schoolName: 'What school does {name} go to?',
    step5_healthCenter: "What's {name}'s health center?",
    step6_colors: 'Pick your colors',
    step6_colorsSubtitle: 'Choose colors to organize your calendar and tasks.',
    step7_finance: 'Want to track shared expenses?',
    step7_financeSubtitle: "Like Splitwise, but you just say it and I'll categorize it.",
    step7_splitDefault: "Default split: 50/50",
    step8_priorities: 'What causes you the most mental load?',
    step8_prioritiesSubtitle: "I'll focus on these first.",
    step9_summary: "All set! Here's what I've set up for you:",
    step9_summaryBirthdays: '🎂 Birthday reminders for everyone',
    step9_summaryVaccines: '💉 Vaccination schedule for {name}',
    step9_summaryHomework: '📚 Daily homework reminders',
    step9_summarySchool: '🏫 Monitoring emails from {school}',
    step9_summaryExpenses: '💰 Expense tracking (50/50 split)',
    step9_letsGo: "Let's go!",
    roleAdult: 'Adult',
    roleChild: 'Child',
    ordinals: ['the first', 'the second', 'the third', 'the fourth', 'the fifth', 'the sixth', 'the seventh', 'the eighth'],
  },

  // ─── Dashboard ─────────────────────────────────
  dashboard: {
    noTasksToday: 'Nothing on your plate today. Enjoy! 🌿',
    upcomingTasks: 'Upcoming',
    addTask: 'Add a task',
    addTaskVoice: 'Say it, I\'ll remember it',
    quickAdd: 'What do you need to remember?',
    tasksRemaining: '{count} task remaining | {count} tasks remaining',
  },

  // ─── Calendar ──────────────────────────────────
  calendar: {
    title: 'Calendar',
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    dayNamesShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    noEvents: 'No events this day',
    addEvent: 'Add event',
    allDay: 'All day',
    filterByMember: 'Filter by person',
    filterByCategory: 'Filter by category',
  },

  // ─── Tasks ─────────────────────────────────────
  tasks: {
    title: 'Tasks',
    newTask: 'New task',
    taskName: 'What needs to be done?',
    assignTo: 'Assign to',
    dueDate: 'Due date',
    category: 'Category',
    priority: 'Priority',
    notes: 'Notes',
    statusPending: 'Pending',
    statusInProgress: 'In progress',
    statusDone: 'Done',
    priorityLow: 'Low',
    priorityMedium: 'Medium',
    priorityHigh: 'High',
    noTasks: 'All clear! Nothing to do. 🎉',
    completedSection: 'Completed',
    deleteConfirm: 'Delete this task?',
  },

  // ─── Family ────────────────────────────────────
  family: {
    title: 'Family',
    addMember: 'Add member',
    age: '{years} years old',
    ageMonths: '{months} months old',
    school: 'School',
    healthCenter: 'Health center',
    pendingTasks: '{count} pending task | {count} pending tasks',
    upcomingVaccine: 'Next vaccine',
    noUpcomingVaccines: 'All vaccines up to date ✓',
    birthdayIn: 'Birthday in {days} days 🎂',
    birthdayToday: 'Happy birthday today! 🎉',
    role: {
      adult: 'Adult',
      child: 'Child',
    },
  },

  // ─── Expenses ──────────────────────────────────
  expenses: {
    title: 'Expenses',
    addExpense: 'Add expense',
    addByVoice: 'Say it: "I spent 45 on groceries"',
    amount: 'Amount',
    description: 'Description',
    paidBy: 'Paid by',
    splitWith: 'Split with',
    split5050: '50/50',
    splitCustom: 'Custom %',
    splitOnePays: 'One pays',
    monthlyTotal: 'This month',
    balance: 'Balance',
    youOwe: 'You owe {name}',
    theyOwe: '{name} owes you',
    settled: "You're settled up! ✓",
    noExpenses: 'No expenses yet this month.',
    recentExpenses: 'Recent',
    byCategory: 'By category',
  },

  // ─── Settings ──────────────────────────────────
  settings: {
    title: 'Settings',
    colorPalette: 'Color palette',
    categories: 'Categories',
    notifications: 'Notifications',
    language: 'Language',
    connectedAccounts: 'Connected accounts',
    partner: 'Partner',
    invitePartner: 'Invite partner',
    removePartner: 'Remove partner',
    financeSettings: 'Finance',
    defaultSplit: 'Default split',
    exportData: 'Export data',
    importData: 'Import data',
    about: 'About Mindless',
    signOut: 'Sign out',
    version: 'Version {version}',
    dangerZone: 'Danger zone',
    deleteAllData: 'Delete all data',
    deleteConfirm: 'This will permanently delete all your data. Are you sure?',
  },

  // ─── Confirmation ──────────────────────────────
  confirmation: {
    done: 'Done.',
    outOfHead: "It's out of your head.",
    enjoy: 'Enjoy.',
    backHome: 'Back to home',
  },

  // ─── Navigation ────────────────────────────────
  nav: {
    home: 'Home',
    calendar: 'Calendar',
    tasks: 'Tasks',
    family: 'Family',
    expenses: 'Expenses',
    settings: 'Settings',
  },

  // ─── Categories ────────────────────────────────
  categories: {
    school: 'School',
    health: 'Health',
    home: 'Home',
    work: 'Work',
    family: 'Family',
    leisure: 'Leisure',
    shopping: 'Shopping',
    returns: 'Returns',
    finance: 'Finance',
  },

  // ─── Voice ─────────────────────────────────────
  voice: {
    listening: 'Listening...',
    processing: 'Processing...',
    notSupported: 'Voice input is not supported in this browser. Please type instead.',
    permissionDenied: 'Microphone access was denied. Please type instead.',
    tryAgain: "I didn't catch that. Try again?",
    micPermission: 'Tap to speak',
  },

  // ─── Notifications ─────────────────────────────
  notifications: {
    permissionTitle: 'Stay in the loop',
    permissionBody: "Allow notifications so I can remind you about important things.",
    permissionAllow: 'Allow notifications',
    permissionDeny: 'Not now',
    vaccineReminder: "Time to schedule {name}'s {vaccine} vaccine",
    birthdayReminder: "{name}'s birthday is in {days} days!",
    taskReminder: "Don't forget: {task}",
    homeworkReminder: "Time for {name}'s homework",
  },

  // ─── Errors ────────────────────────────────────
  errors: {
    generic: 'Something went wrong. Please try again.',
    offline: "You're offline. Changes will sync when you reconnect.",
    authFailed: 'Google sign-in failed. Please try again.',
    saveFailed: "Couldn't save. Please try again.",
  },
};
