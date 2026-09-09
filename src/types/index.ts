export interface IExperience {
  company: string;
  position: string;
  startDate: Date;
  endDate: Date;
  description: string;
}
export interface Education {
  school: string;
  degree: string;
  field: string;
  startYear: number;
  endYear: number;
}
export interface IUser {
  email: string;
  password: string;
  posts: string[];
  firstName: string;
  role: string;
  lastName: string;
  age: number;
  avatar: string;
  job: string;
  backgroundImage: string;
  bio: string;
  website: string;
  company: string;
  experience: IExperience[];
  education: Education[];
  skills: string[];
  connections: string[];
  following: string[];
}
export interface ICompany {
  email: string;
  password: string;
  companyName: string;
  industry: string;
  companySize: string;
  website: string;
  location: string;
  logo: string;
  coverImage: string;
  role: string;
  about: string;
  isVerified: boolean;
  followers: IUser[];
}
export interface IVacancy {
  company: string;
  title: string;
  description: string;
  employmentType: 
    | "FULL_TIME"
    | "PART_TIME"
    | "CONTRACT"
    | "INTERN"
    | "FREELANCE";
  locationType: "ON_SITE" | "HYBRID" | "REMOTE";
  location: string;
  experienceLevel: "JUNIOR" | "MIDDLE" | "SENIOR" | "EXPERT";
  salary: {
    min: number | null;
    max: number | null;
    currency: string;
    period: string;
  };
  applicantsCount: number;
  isActive: boolean;
  skills: string[];
}