import { DB } from './types';
export const KEY = 'school-platform-db-v1';
export const initialDB: DB = {
  classes: [
    { id:'c1', name:'Quran Level 1', level:'Beginner', teacher:'Ms Sarah', schedule:'Monday 5:00 PM' },
    { id:'c2', name:'Arabic Level 2', level:'Intermediate', teacher:'Mr Ahmed', schedule:'Wednesday 5:30 PM' },
  ],
  students: [
    { id:'s1', firstName:'Anas', lastName:'Ali', dob:'2017-04-10', level:'Beginner', classId:'c1', parentName:'Lamis', parentEmail:'parent@example.com', balance:120, points:8, stamps:2 },
    { id:'s2', firstName:'Lina', lastName:'Ali', dob:'2019-07-18', level:'Beginner', classId:'c1', parentName:'Lamis', parentEmail:'parent@example.com', balance:0, points:12, stamps:4 },
  ],
  homework: [
    { id:'h1', classId:'c1', title:'Memorise short surah', revision:'Revise last lesson pages 3-4', date:new Date().toISOString().slice(0,10), dueDate:new Date(Date.now()+7*86400000).toISOString().slice(0,10), teacher:'Ms Sarah' }
  ],
  scores: [
    { id:'sc1', studentId:'s1', classId:'c1', date:new Date().toISOString().slice(0,10), score:8, notes:'Good participation', points:3, stamps:1 }
  ],
  announcements: [
    { id:'a1', title:'Welcome to the new term', body:'Please check homework every week through the parent portal.', audience:'ALL', date:new Date().toISOString().slice(0,10) }
  ],
  payments: [
    { id:'p1', studentId:'s1', amount:120, dueDate:new Date(Date.now()+14*86400000).toISOString().slice(0,10), status:'DUE', note:'Term fees' }
  ],
  enrollments: []
};

export async function getDB(): Promise<DB> {
  if (typeof window === 'undefined') return initialDB;
  const raw = localStorage.getItem(KEY);
  if (raw) return JSON.parse(raw);

  try {
    const response = await fetch('/api/db', { cache: 'no-store' });
    if (response.ok) {
      const db = await response.json();
      localStorage.setItem(KEY, JSON.stringify(db));
      return db;
    }
    console.error('Failed to load DB from server:', response.statusText);
  } catch (error) {
    console.error('Unable to load DB from server:', error);
  }

  localStorage.setItem(KEY, JSON.stringify(initialDB));
  return initialDB;
}

export async function saveDB(db: DB): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEY, JSON.stringify(db));
    window.dispatchEvent(new Event('school-db-update'));
  }

  try {
    await fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(db),
    });
  } catch (error) {
    console.error('Unable to persist DB to server:', error);
  }
}

export const uid = (p='id') => `${p}_${Math.random().toString(36).slice(2,9)}`;
