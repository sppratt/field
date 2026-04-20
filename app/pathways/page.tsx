'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { careers, RecommendationTag, CareerLevel } from '@/app/data/careers';
import { CareerCard } from '@/app/components/CareerCard';
import { useAuth } from '@/app/providers/AuthProvider';
import { useUserRole } from '@/app/hooks/useUserRole';
import { getUserProgress } from '@/lib/db/progress';
import { StudentProgress } from '@/lib/db/types';
import styles from '@/app/styles/PathwaysPage.module.css';

const careerIcons: Record<string, string> = {
  'software-engineer': '⚙️',
  'nurse': '💊',
  'graphic-designer': '🎨',
  'data-analyst': '📊',
  'architect': '🏗️',
};

const careerColors: Record<string, string> = {
  'software-engineer': 'var(--career-software-engineer)',
  'nurse': 'var(--career-nurse)',
  'graphic-designer': 'var(--career-graphic-designer)',
  'data-analyst': 'var(--career-data-analyst)',
  'architect': 'var(--career-architect)',
};

const sortOptions = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'level', label: 'Difficulty (Intro First)' },
];

export default function PathwaysPage() {
  const router = useRouter();
  const { user } = useAuth();
  const role = useUserRole();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [selectedLevels, setSelectedLevels] = useState<Set<CareerLevel>>(new Set());
  const [sortBy, setSortBy] = useState('name');
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set());
  const [progressData, setProgressData] = useState<Record<string, StudentProgress>>({});
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState<Set<'not_started' | 'in_progress' | 'completed'>>(
    new Set(['not_started', 'in_progress', 'completed'])
  );

  // Redirect teachers away from pathways
  useEffect(() => {
    if (role === 'teacher') {
      router.push('/teacher/dashboard');
    }
  }, [role, router]);

  // Fetch user progress
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) {
        setLoadingProgress(false);
        return;
      }

      try {
        const progress = await getUserProgress(user.id);
        const progressMap: Record<string, StudentProgress> = {};
        progress.forEach((p) => {
          progressMap[p.pathway_id] = p;
        });
        setProgressData(progressMap);
      } catch (err) {
        console.error('Error fetching progress:', err);
      } finally {
        setLoadingProgress(false);
      }
    };

    fetchProgress();
  }, [user]);

  const allSkills = useMemo(() => {
    const skills = new Set<string>();
    careers.forEach((career) => {
      career.keySkills.forEach((skill) => skills.add(skill));
    });
    return Array.from(skills).sort();
  }, []);

  const allLevels: CareerLevel[] = ['intro', 'intermediate', 'advanced'];

  const filteredCareers = useMemo(() => {
    let results = careers.filter((career) => {
      const matchesSearch =
        career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        career.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSkills =
        selectedSkills.size === 0 ||
        career.keySkills.some((skill) => selectedSkills.has(skill));

      const matchesLevels =
        selectedLevels.size === 0 || selectedLevels.has(career.level);

      return matchesSearch && matchesSkills && matchesLevels;
    });

    if (sortBy === 'name') {
      results.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'level') {
      const levelOrder = { intro: 0, intermediate: 1, advanced: 2 };
      results.sort((a, b) => levelOrder[a.level] - levelOrder[b.level]);
    }

    return results;
  }, [searchQuery, selectedSkills, selectedLevels, sortBy]);

  // Group careers by status
  const groupedCareers = useMemo(() => {
    const notStarted = selectedStatuses.has('not_started')
      ? filteredCareers.filter((c) => !progressData[c.id] || progressData[c.id].status === 'not_started')
      : [];
    const inProgress = selectedStatuses.has('in_progress')
      ? filteredCareers.filter((c) => progressData[c.id] && progressData[c.id].status === 'in_progress')
      : [];
    const completed = selectedStatuses.has('completed')
      ? filteredCareers.filter((c) => progressData[c.id] && progressData[c.id].status === 'completed')
      : [];

    return { notStarted, inProgress, completed };
  }, [filteredCareers, progressData, selectedStatuses]);

  const toggleSkill = (skill: string) => {
    const newSkills = new Set(selectedSkills);
    if (newSkills.has(skill)) {
      newSkills.delete(skill);
    } else {
      newSkills.add(skill);
    }
    setSelectedSkills(newSkills);
  };

  const toggleLevel = (level: CareerLevel) => {
    const newLevels = new Set(selectedLevels);
    if (newLevels.has(level)) {
      newLevels.delete(level);
    } else {
      newLevels.add(level);
    }
    setSelectedLevels(newLevels);
  };

  const toggleStatus = (status: 'not_started' | 'in_progress' | 'completed') => {
    const newStatuses = new Set(selectedStatuses);
    if (newStatuses.has(status)) {
      newStatuses.delete(status);
    } else {
      newStatuses.add(status);
    }
    setSelectedStatuses(newStatuses);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSkills(new Set());
    setSelectedLevels(new Set());
    setSelectedStatuses(new Set(['not_started', 'in_progress', 'completed']));
  };

  const toggleAccordion = (section: string) => {
    const newAccordions = new Set(openAccordions);
    if (newAccordions.has(section)) {
      newAccordions.delete(section);
    } else {
      newAccordions.add(section);
    }
    setOpenAccordions(newAccordions);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedSkills.size > 0 ||
    selectedLevels.size > 0 ||
    selectedStatuses.size < 3;

  return (
    <div className={styles.page}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarContent}>
          <div className={styles.header}>
            <h1 className={styles.title}>Explore Fields</h1>
            <p className={styles.description}>
              Choose a career to step into a scenario and experience what the job is really like.
            </p>
          </div>

          <div className={styles.controls}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search careers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.controlsRow}>
          <div className={styles.sortControl}>
            <label htmlFor="sort">Sort by:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className={styles.clearButton}
            >
              Clear Filters
            </button>
          )}
        </div>

        <div className={styles.filterSection}>
          <div className={styles.filterGroup}>
            <button
              onClick={() => toggleAccordion('status')}
              className={styles.accordionHeader}
            >
              <span className={styles.filterTitle}>Status</span>
              <span className={`${styles.accordionIcon} ${openAccordions.has('status') ? styles.accordionIconOpen : ''}`}>
                ▼
              </span>
            </button>
            {openAccordions.has('status') && (
              <div className={styles.filterPills}>
                <button
                  onClick={() => toggleStatus('not_started')}
                  className={`${styles.filterPill} ${
                    selectedStatuses.has('not_started') ? styles.filterPillActive : ''
                  }`}
                >
                  Not Started
                </button>
                <button
                  onClick={() => toggleStatus('in_progress')}
                  className={`${styles.filterPill} ${
                    selectedStatuses.has('in_progress') ? styles.filterPillActive : ''
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => toggleStatus('completed')}
                  className={`${styles.filterPill} ${
                    selectedStatuses.has('completed') ? styles.filterPillActive : ''
                  }`}
                >
                  Completed
                </button>
              </div>
            )}
          </div>

          <div className={styles.filterGroup}>
            <button
              onClick={() => toggleAccordion('difficulty')}
              className={styles.accordionHeader}
            >
              <span className={styles.filterTitle}>Difficulty</span>
              <span className={`${styles.accordionIcon} ${openAccordions.has('difficulty') ? styles.accordionIconOpen : ''}`}>
                ▼
              </span>
            </button>
            {openAccordions.has('difficulty') && (
              <div className={styles.filterPills}>
                {allLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => toggleLevel(level)}
                    className={`${styles.filterPill} ${
                      selectedLevels.has(level) ? styles.filterPillActive : ''
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.filterGroup}>
            <button
              onClick={() => toggleAccordion('skills')}
              className={styles.accordionHeader}
            >
              <span className={styles.filterTitle}>Skills</span>
              <span className={`${styles.accordionIcon} ${openAccordions.has('skills') ? styles.accordionIconOpen : ''}`}>
                ▼
              </span>
            </button>
            {openAccordions.has('skills') && (
              <div className={styles.filterPills}>
                {allSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`${styles.filterPill} ${
                      selectedSkills.has(skill) ? styles.filterPillActive : ''
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

          <p className={styles.resultsCount}>
            {filteredCareers.length} field{filteredCareers.length !== 1 ? 's' : ''} found
          </p>
        </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Not Started Section */}
        {groupedCareers.notStarted.length > 0 && (
          <div>
            <div className={styles.sectionLabel}>
              <span className={styles.statusPill}>Not Started</span>
            </div>
            <div className={styles.grid}>
              {groupedCareers.notStarted.map((career) => (
                <CareerCard
                  key={career.id}
                  id={career.id}
                  title={career.title}
                  description={career.description}
                  level={career.level}
                  keySkills={career.keySkills}
                  icon={careerIcons[career.id]}
                  accentColor={careerColors[career.id]}
                  isDashboard={true}
                  status="not_started"
                  progress={0}
                  showTear={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* In Progress Section */}
        {groupedCareers.inProgress.length > 0 && (
          <div>
            <div className={styles.sectionLabel}>
              <span className={styles.statusPill + ' ' + styles.statusPillProgress}>In Progress</span>
            </div>
            <div className={styles.grid}>
              {groupedCareers.inProgress.map((career) => {
                const progress = progressData[career.id];
                return (
                  <CareerCard
                    key={career.id}
                    id={career.id}
                    title={career.title}
                    description={career.description}
                    level={career.level}
                    keySkills={career.keySkills}
                    icon={careerIcons[career.id]}
                    accentColor={careerColors[career.id]}
                    isDashboard={true}
                    status="in_progress"
                    progress={progress?.completion_percentage || 0}
                    showTear={false}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Section */}
        {groupedCareers.completed.length > 0 && (
          <div>
            <div className={styles.sectionLabel}>
              <span className={styles.statusPill + ' ' + styles.statusPillCompleted}>Completed</span>
            </div>
            <div className={styles.grid}>
              {groupedCareers.completed.map((career) => {
                const progress = progressData[career.id];
                return (
                  <CareerCard
                    key={career.id}
                    id={career.id}
                    title={career.title}
                    description={career.description}
                    level={career.level}
                    keySkills={career.keySkills}
                    icon={careerIcons[career.id]}
                    accentColor={careerColors[career.id]}
                    isDashboard={true}
                    status="completed"
                    progress={100}
                    showTear={false}
                  />
                );
              })}
            </div>
          </div>
        )}

        {filteredCareers.length === 0 && (
          <div className={styles.noResults}>
            <p>No careers match your filters. Try adjusting your search.</p>
            <button onClick={clearFilters} className={styles.clearButton}>
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
