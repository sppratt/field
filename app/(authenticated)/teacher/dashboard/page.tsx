'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUserProfile } from '@/lib/db/users';
import { ClassroomStatCard } from '@/app/components/ClassroomStatCard';
import { TotalStudentsModal } from '@/app/components/modals/TotalStudentsModal';
import { PathwaysMetricModal } from '@/app/components/modals/PathwaysMetricModal';
import { StudentsNeedingAttentionModal } from '@/app/components/modals/StudentsNeedingAttentionModal';
import { FieldTrendsModal } from '@/app/components/modals/FieldTrendsModal';
import { StudentDetailModal } from '@/app/components/modals/StudentDetailModal';
import { AverageCompletionModal } from '@/app/components/modals/AverageCompletionModal';
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

interface Student {
  id: string;
  name: string;
  email: string;
  pathways_started: number;
  pathways_completed: number;
  completion_percentage: number;
  last_active: string | null;
}

export default function TeacherDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [modalsOpen, setModalsOpen] = useState({
    totalStudents: false,
    pathwaysStarted: false,
    pathwaysCompleted: false,
    studentsNeedingAttention: false,
    fieldTrends: false,
    studentDetail: false,
    averageCompletion: false,
  });

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
      {/* Hero: Classroom Overview */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.welcomeHeading}>Welcome, {user?.name}!</h1>

          <div className={styles.heroGrowthSection}>
            <h2 className={styles.heroHeadline}>Your classroom is progressing</h2>
            <p className={styles.heroSubheading}>
              Monitor class-wide progress, encourage exploration, and see where students need support.
            </p>
          </div>

          <div className={styles.statsContainer}>
            <h3 className={styles.statsHeading}>Classroom Stats</h3>
            <div className={styles.statsGrid}>
              <ClassroomStatCard
                label="Total Students"
                value={mockInsights.totalStudents}
                subtext="Enrolled in your class"
                onClick={() => setModalsOpen({ ...modalsOpen, totalStudents: true })}
              />
              <ClassroomStatCard
                label="Fields Explored"
                value={mockInsights.pathwaysStarted}
                subtext="Total class-wide"
                onClick={() => setModalsOpen({ ...modalsOpen, pathwaysStarted: true })}
              />
              <ClassroomStatCard
                label="Completed"
                value={mockInsights.pathwaysCompleted}
                subtext="Simulations finished"
                onClick={() => setModalsOpen({ ...modalsOpen, pathwaysCompleted: true })}
              />
              <ClassroomStatCard
                label="Avg Completion"
                value={`${mockInsights.averageCompletion}%`}
                subtext="Class progress rate"
                onClick={() => setModalsOpen({ ...modalsOpen, averageCompletion: true })}
              />
              <ClassroomStatCard
                label="Needing Attention"
                value={mockInsights.needingAttention}
                subtext="Students stuck or inactive"
                onClick={() => setModalsOpen({ ...modalsOpen, studentsNeedingAttention: true })}
              />
              <ClassroomStatCard
                label="Most Explored"
                value={mockInsights.mostExplored}
                subtext="Trending in your class"
                onClick={() => setModalsOpen({ ...modalsOpen, fieldTrends: true })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.actionsSection}>
        <div className={styles.actionsGrid}>
          <button className={styles.actionButton} onClick={() => alert('Invite students feature coming soon')}>
            <span className={styles.actionIcon}>👥</span>
            <span className={styles.actionLabel}>Invite Students</span>
          </button>
          <button className={styles.actionButton} onClick={() => alert('Create assignment feature coming soon')}>
            <span className={styles.actionIcon}>📋</span>
            <span className={styles.actionLabel}>Create Assignment</span>
          </button>
          <button className={styles.actionButton} onClick={() => alert('View analytics feature coming soon')}>
            <span className={styles.actionIcon}>📊</span>
            <span className={styles.actionLabel}>View Analytics</span>
          </button>
          <button className={styles.actionButton} onClick={() => alert('Send message feature coming soon')}>
            <span className={styles.actionIcon}>📢</span>
            <span className={styles.actionLabel}>Send Message</span>
          </button>
        </div>
      </div>

      {/* Classroom Insights */}
      <div className={styles.insightsSection}>
        <h2 className={styles.insightsSectionTitle}>Classroom Insights</h2>
        <div className={styles.insightsGrid}>
          <div className={styles.insightCard}>
            <div className={styles.insightLabel}>Most Explored Field</div>
            <div className={styles.insightValue}>{mockInsights.mostExplored}</div>
            <div className={styles.insightSubtext}>Your class shows strong interest in this field</div>
          </div>
          <div className={styles.insightCard}>
            <div className={styles.insightLabel}>Least Explored Field</div>
            <div className={styles.insightValue}>{mockInsights.leastExplored}</div>
            <div className={styles.insightSubtext}>Consider promoting this career pathway</div>
          </div>
          <div className={styles.insightCard}>
            <div className={styles.insightLabel}>Class Engagement</div>
            <div className={styles.insightValue}>{Math.round((mockStudents.filter((s) => s.last_active).length / mockStudents.length) * 100)}%</div>
            <div className={styles.insightSubtext}>Active students this week</div>
          </div>
        </div>
      </div>

      {/* Student Progress Table */}
      <div className={styles.section}>
        <h2>Student Progress</h2>

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
                  <tr
                    key={student.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedStudent(student);
                      setModalsOpen({ ...modalsOpen, studentDetail: true });
                    }}
                  >
                    <td>
                      <span className={styles.studentName} style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
                        {student.name}
                      </span>
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

      {/* Modals */}
      <TotalStudentsModal
        open={modalsOpen.totalStudents}
        onClose={() => setModalsOpen({ ...modalsOpen, totalStudents: false })}
        students={mockStudents}
      />
      <PathwaysMetricModal
        open={modalsOpen.pathwaysStarted}
        onClose={() => setModalsOpen({ ...modalsOpen, pathwaysStarted: false })}
        students={mockStudents}
        type="started"
        totalCount={mockInsights.pathwaysStarted}
      />
      <PathwaysMetricModal
        open={modalsOpen.pathwaysCompleted}
        onClose={() => setModalsOpen({ ...modalsOpen, pathwaysCompleted: false })}
        students={mockStudents}
        type="completed"
        totalCount={mockInsights.pathwaysCompleted}
      />
      <StudentsNeedingAttentionModal
        open={modalsOpen.studentsNeedingAttention}
        onClose={() => setModalsOpen({ ...modalsOpen, studentsNeedingAttention: false })}
        students={mockStudents}
      />
      <FieldTrendsModal
        open={modalsOpen.fieldTrends}
        onClose={() => setModalsOpen({ ...modalsOpen, fieldTrends: false })}
        mostExplored={mockInsights.mostExplored}
        leastExplored={mockInsights.leastExplored}
      />
      <StudentDetailModal
        open={modalsOpen.studentDetail}
        onClose={() => setModalsOpen({ ...modalsOpen, studentDetail: false })}
        student={selectedStudent}
      />
      <AverageCompletionModal
        open={modalsOpen.averageCompletion}
        onClose={() => setModalsOpen({ ...modalsOpen, averageCompletion: false })}
        averagePercentage={mockInsights.averageCompletion}
        totalStudents={mockInsights.totalStudents}
        completedSimulations={mockInsights.pathwaysCompleted}
      />
    </div>
  );
}
