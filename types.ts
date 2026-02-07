
export type ApplicationStatus = 'Applied' | 'Under Review' | 'Interviewing' | 'Offer Extended' | 'Rejected';

export interface Application {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  status: ApplicationStatus;
  appliedDate: string;
  notes?: string;
  url?: string;
}

export interface CorporateData {
  id: string;
  companyName: string;
  industry: string;
  employeeCount: number;
  linkedinVerified: boolean;
  activePostings: number;
  marketPerception: string;
  hiringStatus: 'Aggressive' | 'Steady' | 'Paused';
}

export interface UserProfileData {
  address: string;
  preferredCategory: string;
  education: string;
  yearsExperience: string;
  noticePeriod: string;
  workAuthorization: boolean;
  salaryExpectation: string;
  willingToRelocate: boolean;
  requiresSponsorship: boolean;
  industryInterests: string;
  careerGoals: string;
  relevantSkills: string;
  recentProject: string;
  workingStyle: string;
  workEnvironment: 'Remote' | 'Hybrid' | 'On-site';
  portfolioUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  profileStrength: number; // 0-100
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  picture: string;
  headline?: string;
  linkedinConnected: boolean;
  linkedinActivity?: string[];
  profileData?: UserProfileData;
  applicationsCount?: number;
  interviewsCount?: number;
  linkedCorporations?: CorporateData[];
  premiumMember?: boolean;
}

// Added missing interface for SavedSearch used in Discovery.tsx
export interface SavedSearch {
  id: string;
  category: string;
  location: string;
}

// Added missing interface for ChatThread used in Messaging.tsx
export interface ChatThread {
  id: string;
  participantName: string;
  participantPic: string;
  lastMessage: string;
  lastTimestamp: string;
  unread: boolean;
}
