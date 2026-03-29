'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUserProfile } from '@/lib/db/users';
import type { User } from '@/lib/db/types';
import styles from './TeacherDashboard.module.css';
import { Button } from '@/app/components/Button';

// Mock student data for enrolled students
const mockStudents = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@school.edu',
    pathways_started: 3,
    pathways_completed: 1,
    completion_percentage: 45,
    last_active: '2026-03-29T14:30:00',
  },
  {
    id: '2',
    name: 'Jordan Smith',
    email: 'jordan.smith@school.edu',
    pathways_started: 2,
    pathways_completed: 2,
    completion_percentage: 100,
    last_active: '2026-03-28T10:15:00',
  },
  {
    id: '3',
    name: 'Casey Wilson',
    email: 'casey.wilson@school.edu',
    pathways_started: 1,
    pathways_completed: 0,
    completion_percentage: 25,
    last_active: '2026-03-27T09:00:00',
  },
  {
    id: '4',
    name: 'Morgan Lee',
    email: 'morgan.lee@school.edu',
    pathways_started: 0,
    pathways_completed: 0,
    completion_percentage: 0,
    last_active: null,
  },
  {
    id: '5',
    name: 'Taylor Brown',
    email: 'taylor.brown@school.edu',
    pathways_started: 4,
    pathways_completed: 1,
    completion_percentage: 38,
    last_active: '2026-03-29T16:45:00',
  },
];

// Mock classroom insights
const mockInsights = {
  totalStudents: mockStudents.length,
  pathwaysStarted: mockStudents.reduce((sum, s) => sum + s.pathways_started, 0),
  pathwaysCompleted: mockStudents.reduce((sum, s) => sum + s.pathways_completed, 0),
  averageCompletion:
    Math.round(
      (mockStudents.reduce((sum, s) => sum + s.completion_percentage, 0) / mockStudents.length) *
        100
    ) / 100,
  mostExplored: 'Software Engineer',
  leastExplored: 'Architect',
  needingAttention: mockStudents.filter((s) => !s.last_active || s.pathways_started === 0).length,
};

function formatDate(dateString: string | null): string {
  if (!dateString) return 'Not started';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function TeacherDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userProfile = await getCurrentUserProfile();
        if (!userProfile) {
          router.push('/auth/login');
          return;
        }

        if (userProfile.role !== 'teacher') {
          router.push('/student/dashboard');
          return;
        }

        setUser(userProfile);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Welcome, {user?.name}!</h1>
          <p>Classroom overview and student progress tracking</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className={styles.overviewGrid}>
        <div className={styles.overviewCard}>
          <div className={styles.cardLabel}>Total Students</div>
          <div className={styles.cardValue}>{mockInsights.totalStudents}</div>
          <div className={styles.cardSubtext}>Enrolled in your class</div>
        </div>
        <div className={styles.overviewCard}>
          <div className={styles.cardLabel}>Pathways Started</div>
          <div className={styles.cardValue}>{mockInsights.pathwaysStarted}</div>
          <div className={styles.cardSubtext}>Across all students</div>
        </div>
        <div className={styles.overviewCard}>
          <div className={styles.cardLabel}>Completed</div>
          <div className={styles.cardValue}>{mockInsights.pathwaysCompleted}</div>
          <div className={styles.cardSubtext}>Pathways finished</div>
        </div>
        <div className={styles.overviewCard}>
          <div className={styles.cardLabel}>Avg Completion</div>
          <div className={styles.cardValue}>{mockInsights.averageCompletion}%</div>
          <div className={styles.cardSubtext}>Class progress rate</div>
        </div>
      </div>

      {/* Action Cards */}
      <div className={styles.actionGrid}>
        <button className={styles.actionCard}>
          <div className={styles.actionIcon}>+</div>
          <div className={styles.actionLabel}>Create Class</div>
        </button>
        <button className={styles.actionCard}>
          <div className={styles.actionIcon}>👥</div>
          <div className={styles.actionLabel}>Invite Students</div>
        </button>
        <button className={styles.actionCard}>
          <div className={styles.actionIcon}>📊</div>
          <div className={styles.actionLabel}>View Analytics</div>
        </button>
      </div>

      {/* Classroom Insights */}
      <div className={styles.insightsSection}>
        <h2 style={{ marginTop: 0 }}>Classroom Insights</h2>
        <div className={styles.insightsGrid}>
          <div className={styles.insightCard}>
            <div className={styles.insightLabel}>Most Explored</div>
            <div className={styles.insightValue}>{mockInsights.mostExplored}</div>
            <div className={styles.insightSubtext}>Your class is most interested in this pathway</div>
          </div>
          <div className={styles.insightCard}>
            <div className={styles.insightLabel}>Least Explored</div>
            <div className={styles.insightValue}>{mockInsights.leastExplored}</div>
            <div className={styles.insightSubtext}>Consider promoting this pathway</div>
          </div>
          <div className={styles.insightCard}>
            <div className={styles.insightLabel}>Needing Attention</div>
            <div className={styles.insightValue}>{mockInsights.needingAttention}</div>
            <div className={styles.insightSubtext}>Students who haven&apos;t started yet</div>
          </div>
        </div>
      </div>

      {/* Student Progress Table */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Student Progress</h2>
          <Button variant="secondary">Export Report</Button>
        </div>

        {mockStudents.length > 0 ? (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Status</th>
                  <th>Started</th>
                  <th>Completed</th>
                  <th>Completion %</th>
                  <th>Last Active</th>
                </tr>
              </thead>
              <tbody>
                {mockStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <span className={styles.studentName}>{student.name}</span>
                    </td>
                    <td>
                      <span
                        className={`${styles.status} ${
                          student.last_active ? styles.statusActive : styles.statusInactive
                        }`}
                      >
                        {student.last_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{student.pathways_started}</td>
                    <td>{student.pathways_completed}</td>
                    <td>
                      <span className={styles.progressValue}>{student.completion_percentage}%</span>
                    </td>
                    <td>
                      <span className={styles.lastActive}>{formatDate(student.last_active)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>👥</div>
            <h3>No students yet</h3>
            <p>Invite students to your class to see their progress here</p>
            <div className={styles.buttonWrapper}>
              <Button variant="secondary">Invite Your First Students</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
