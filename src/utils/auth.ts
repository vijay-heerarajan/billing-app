import type { User, AuthUser, LoginCredentials, RegisterData } from '../types/user';

const USERS_STORAGE_KEY = 'billing_app_users';
const CURRENT_USER_KEY = 'billing_app_current_user';

// Simple password hashing (for demo - use proper hashing in production)
const hashPassword = (password: string): string => {
  return btoa(password + 'billing_app_salt');
};

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

export const registerUser = (userData: RegisterData): { success: boolean; error?: string; user?: AuthUser } => {
  const users = getUsers();
  
  // Check if user already exists
  if (users.find(user => user.email === userData.email)) {
    return { success: false, error: 'User already exists with this email' };
  }

  const newUser: User = {
    id: Date.now().toString(),
    email: userData.email,
    name: userData.name,
    businessName: userData.businessName,
    businessAddress: userData.businessAddress,
    phone: userData.phone,
    gstNo: userData.gstNo || '',
    logo: userData.logo || '',
    bankDetails: {
      bankName: '',
      accountNo: '',
      ifsc: ''
    },
    createdAt: new Date().toISOString()
  };

  // Store user with hashed password
  const userWithPassword = {
    ...newUser,
    passwordHash: hashPassword(userData.password)
  };

  users.push(userWithPassword);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  const authUser: AuthUser = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name
  };

  return { success: true, user: authUser };
};

export const loginUser = (credentials: LoginCredentials): { success: boolean; error?: string; user?: AuthUser } => {
  const users = getUsers();
  const user = users.find(u => u.email === credentials.email);

  if (!user) {
    return { success: false, error: 'User not found' };
  }

  if (!verifyPassword(credentials.password, user.passwordHash)) {
    return { success: false, error: 'Invalid password' };
  }

  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    name: user.name
  };

  setCurrentUser(authUser);
  return { success: true, user: authUser };
};

export const logoutUser = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): AuthUser | null => {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const setCurrentUser = (user: AuthUser): void => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const getUserProfile = (userId: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return null;
  
  // Remove password hash from returned data
  const { passwordHash, ...userProfile } = user;
  return userProfile as User;
};

export const updateUserProfile = (userId: string, updates: Partial<User>): boolean => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) return false;
  
  users[userIndex] = { ...users[userIndex], ...updates };
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  return true;
};

const getUsers = (): any[] => {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};