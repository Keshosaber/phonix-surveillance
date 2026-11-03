// Admin users configuration
export const ADMIN_USERS = [
  { id: 1, username: 'admin', password: 'admin123', name: 'Admin User 1' },
  { id: 2, username: 'admin', password: 'secure456', name: 'Admin User 2' },
  { id: 3, username: 'admin', password: 'protect789', name: 'Admin User 3' },
  { id: 4, username: 'admin', password: 'monitor012', name: 'Admin User 4' },
  { id: 5, username: 'admin', password: 'surveillance345', name: 'Admin User 5' },
  { id: 6, username: 'admin', password: 'security678', name: 'Admin User 6' },
] as const;

export interface User {
  id: number;
  username: string;
  name: string;
}

export interface LoginHistory {
  id: string;
  userId: number;
  userName: string;
  loginTime: Date;
  logoutTime?: Date;
  ipAddress?: string;
}

// Store login history in memory (in production, use a database)
let loginHistory: LoginHistory[] = [];

export function authenticateUser(username: string, password: string): User | null {
  const user = ADMIN_USERS.find(
    (u) => u.username === username && u.password === password
  );
  
  if (user) {
    // Record login
    const historyEntry: LoginHistory = {
      id: crypto.randomUUID(),
      userId: user.id,
      userName: user.name,
      loginTime: new Date(),
      ipAddress: '127.0.0.1', // In production, get real IP
    };
    loginHistory.push(historyEntry);
    
    return {
      id: user.id,
      username: user.username,
      name: user.name,
    };
  }
  
  return null;
}

export function recordLogout(userId: number): void {
  const entry = loginHistory.find((h) => h.userId === userId && !h.logoutTime);
  if (entry) {
    entry.logoutTime = new Date();
  }
}

export function getLoginHistory(): LoginHistory[] {
  return loginHistory.sort((a, b) => b.loginTime.getTime() - a.loginTime.getTime());
}

export function getActiveUsers(): number {
  return loginHistory.filter((h) => !h.logoutTime).length;
}
