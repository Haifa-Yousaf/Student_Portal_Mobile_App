import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, Pressable, View,} from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import {
  CourseCard,
  Header,
  QuickAction,
  SectionTitle,
  SummaryCard,
  ViewButton,
} from './components/StudentComponents';
import {
  announcements,
  courses,
  plannerTasks,
  student,
} from './data/studentData';

export default function App() {
  const [activeView, setActiveView] = useState('Dashboard');
  const [searchText, setSearchText] = useState('');
  const [showOnlyAlerts, setShowOnlyAlerts] = useState(false);
  const [selectedCourseCode, setSelectedCourseCode] = useState('SMD');
  const [studyHours, setStudyHours] = useState('');
  const [planMessage, setPlanMessage] = useState('');
  const [tasks, setTasks] = useState(plannerTasks);
  const [completedTaskIds, setCompletedTaskIds] = useState([]);
  const [taskDescription, setTaskDescription] = useState('');
  const [taskSubject, setTaskSubject] = useState('SMD');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskFormMessage, setTaskFormMessage] = useState('');
  const [taskFilter, setTaskFilter] = useState('All');
  const [taskStatusMessage, setTaskStatusMessage] = useState('');

  const lowAttendanceCourses = courses.filter((course) => course.attendance < 80);

  const totalAttendance = courses.reduce((total, course) => total + course.attendance, 0);
  const averageAttendance = Math.round(totalAttendance / courses.length);

  const selectedCourse = courses.find((course) => course.code === selectedCourseCode);

  const filteredCourses = courses.filter((course) => {
    const search = searchText.toLowerCase();
    const matchesSearch =
      course.code.toLowerCase().includes(search) ||
      course.title.toLowerCase().includes(search);
    const matchesAlert = showOnlyAlerts ? course.attendance < 80 : true;
    return matchesSearch && matchesAlert;
  });

  function selectCourse(courseCode) {
    setSelectedCourseCode(courseCode);
    setActiveView('Academics');
  }

  function openAttendanceAlerts() {
    setShowOnlyAlerts(true);
    setActiveView('Courses');
  }

  function createStudyPlan() {
    const hours = Number(studyHours);

    if (studyHours === '' || hours < 1 || hours > 8) {
      setPlanMessage('Please enter study hours from 1 to 8.');
      return;
    }

    if (lowAttendanceCourses.length > 0) {
      setPlanMessage(
        `Plan ${hours} hour(s): revise ${lowAttendanceCourses[0].code} first, then work on the nearest assignment deadline.`
      );
    } else {
      setPlanMessage(`Plan ${hours} hour(s) for the course with the nearest deadline.`);
    }
  }

  function getToday() {
    return new Date().toISOString().slice(0, 10);
  }

  function isTaskMissed(task) {
    return task.due < getToday() && !completedTaskIds.includes(task.id);
  }

  function toggleTask(taskId) {
    const alreadyCompleted = completedTaskIds.includes(taskId);

    if (alreadyCompleted) {
      setCompletedTaskIds(completedTaskIds.filter((id) => id !== taskId));
    } else {
      setCompletedTaskIds([...completedTaskIds, taskId]);
    }
  }

  function addTask() {
    if (taskDescription.trim() === '' || taskDueDate.trim() === '') {
      setTaskFormMessage('Please enter a task description and due date.');
      return;
    }

    if (taskDueDate.length !== 10 || taskDueDate[4] !== '-' || taskDueDate[7] !== '-') {
      setTaskFormMessage('Use the due date format YYYY-MM-DD.');
      return;
    }

    const newTask = {
      id: Date.now(),
      course: taskSubject,
      title: taskDescription.trim(),
      due: taskDueDate,
    };

    setTasks([...tasks, newTask]);
    setTaskDescription('');
    setTaskDueDate('');
    setTaskFormMessage('Task added successfully.');
  }

  const completedTasks = tasks.filter((task) => completedTaskIds.includes(task.id));
  const missedTasks = tasks.filter((task) => isTaskMissed(task));
  const pendingTasks = tasks.filter(
    (task) => !completedTaskIds.includes(task.id) && !isTaskMissed(task)
  );

  useEffect(() => {
    if (missedTasks.length > 0) {
      setTaskStatusMessage(
        'You have ' + missedTasks.length + ' missed task(s).'
      );
    } else {
      setTaskStatusMessage('You have no missed tasks.');
    }
  }, [tasks, completedTaskIds]);

  const visibleTasks = tasks.filter((task) => {
    if (taskFilter === 'Done') return completedTaskIds.includes(task.id);
    if (taskFilter === 'Missed') return isTaskMissed(task);
    if (taskFilter === 'Pending') {
      return !completedTaskIds.includes(task.id) && !isTaskMissed(task);
    }
    return true;
  });

  const attendanceChartData = {
    labels: courses.map((course) => course.code),
    datasets: [
      {
        data: courses.map((course) => course.attendance),
      },
    ],
  };

  const marksPieData = [
    {
      name: 'Obtained',
      population: selectedCourse.marks,
      color: '#2B6EA6',
      legendFontColor: '#415364',
      legendFontSize: 11,
    },
    {
      name: 'Remaining',
      population: 100 - selectedCourse.marks,
      color: '#DCE6EF',
      legendFontColor: '#415364',
      legendFontSize: 11,
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(21, 58, 99, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(72, 88, 104, ${opacity})`,
    propsForBackgroundLines: {
      stroke: '#E8EDF2',
    },
  };

  function renderDashboard() {
    return (
      <View>
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeTextBox}>
            <Text style={styles.welcomeSmall}>Current semester</Text>
            <Text style={styles.welcomeHeading}>{student.semester}</Text>
            <Text style={styles.welcomeBody}>
              Keep track of classes, attendance, results and upcoming academic work.
            </Text>
          </View>
          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Fee</Text>
            <Text style={styles.statusValue}>{student.feeStatus}</Text>
          </View>
        </View>

        <SectionTitle title="Academic Snapshot" subtitle="Your important semester numbers" />
        <View style={styles.summaryRow}>
          <SummaryCard label="CGPA" value={student.cgpa} note={`SGPA ${student.sgpa}`} />
          <SummaryCard label="Attendance" value={`${averageAttendance}%`} note="Overall average" />
          <SummaryCard label="Credits" value={student.creditHours} note="Registered" />
        </View>

        <SectionTitle title="Quick Actions" subtitle="Common portal tasks in fewer taps" />
        <View style={styles.quickActionGrid}>
          <QuickAction
            title="My Courses"
            subtitle="Class schedule and attendance"
            onPress={() => setActiveView('Courses')}
          />
          <QuickAction
            title="Marks"
            subtitle="Course-wise academic progress"
            onPress={() => setActiveView('Academics')}
          />
          <QuickAction
            title="Low Attendance"
            subtitle={`${lowAttendanceCourses.length} course(s) need attention`}
            onPress={openAttendanceAlerts}
          />
          <QuickAction
            title="Study Planner"
            subtitle="Tasks and study suggestion"
            onPress={() => setActiveView('Planner')}
          />
        </View>

        {lowAttendanceCourses.length > 0 ? (
          <Pressable style={styles.warningBox} onPress={openAttendanceAlerts}>
            <View style={styles.warningTextBox}>
              <Text style={styles.warningTitle}>Attendance warning</Text>
              <Text style={styles.warningBody}>
                {lowAttendanceCourses.map((course) => course.code).join(', ')} are below 80%.
              </Text>
            </View>
            <Text style={styles.warningLink}>Review</Text>
          </Pressable>
        ) : (
          <View style={styles.goodBox}>
            <Text style={styles.goodText}>All courses are at or above 80% attendance.</Text>
          </View>
        )}

        <SectionTitle
          title="Attendance Overview"
          subtitle="Course-wise percentage"
          actionText="View courses"
          onAction={() => setActiveView('Courses')}
        />
        <View style={styles.chartCard}>
          <BarChart
            data={attendanceChartData}
            width={320}
            height={220}
            fromZero={true}
            yAxisSuffix="%"
            chartConfig={chartConfig}
            style={styles.chart}
          />
        </View>

        <SectionTitle
          title="Upcoming Deadlines"
          subtitle="Nearest work from registered courses"
          actionText="Open planner"
          onAction={() => setActiveView('Planner')}
        />
        {courses.slice(0, 3).map((course) => (
          <View key={course.code} style={styles.deadlineRow}>
            <View style={styles.deadlineDateBox}>
              <Text style={styles.deadlineDate}>{course.deadline}</Text>
            </View>
            <View style={styles.deadlineTextBox}>
              <Text style={styles.deadlineCourse}>{course.code}</Text>
              <Text style={styles.deadlineTask}>{course.nextTask}</Text>
            </View>
            <Text style={styles.deadlineArrow}>›</Text>
          </View>
        ))}

        <SectionTitle title="Announcements" subtitle="Latest academic notices" />
        {announcements.map((item) => (
          <View key={item.id} style={styles.announcementCard}>
            <Text style={styles.announcementType}>{item.type}</Text>
            <Text style={styles.announcementTitle}>{item.title}</Text>
            <Text style={styles.announcementText}>{item.text}</Text>
          </View>
        ))}
      </View>
    );
  }

  function renderCourses() {
    return (
      <View>
        <SectionTitle
          title="Registered Courses"
          subtitle="Search courses and check class details"
        />

        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search by course code or name"
          placeholderTextColor="#8A98A6"
          style={styles.searchInput}
        />

        <View style={styles.filterRow}>
          <Pressable
            onPress={() => setShowOnlyAlerts(false)}
            style={[styles.filterButton, !showOnlyAlerts ? styles.filterButtonActive : null]}
          >
            <Text style={[styles.filterText, !showOnlyAlerts ? styles.filterTextActive : null]}>
              All courses
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setShowOnlyAlerts(true)}
            style={[styles.filterButton, showOnlyAlerts ? styles.filterWarningActive : null]}
          >
            <Text style={[styles.filterText, showOnlyAlerts ? styles.filterWarningText : null]}>
              Attendance alerts
            </Text>
          </Pressable>
        </View>

        <Text style={styles.resultText}>{filteredCourses.length} course(s) found</Text>

        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard key={course.code} course={course} onSelect={selectCourse} />
          ))
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No courses found</Text>
            <Text style={styles.emptyText}>Try another search or select All courses.</Text>
          </View>
        )}
      </View>
    );
  }

  function renderAcademics() {
    return (
      <View>
        <SectionTitle
          title="Academic Performance"
          subtitle="Marks, grade estimate and semester history"
        />

        <View style={styles.academicSummaryCard}>
          <View style={styles.academicNumberBox}>
            <Text style={styles.academicLabel}>Current SGPA</Text>
            <Text style={styles.academicNumber}>{student.sgpa}</Text>
          </View>
          <View style={styles.academicDivider} />
          <View style={styles.academicNumberBox}>
            <Text style={styles.academicLabel}>CGPA</Text>
            <Text style={styles.academicNumber}>{student.cgpa}</Text>
          </View>
          <View style={styles.academicDivider} />
          <View style={styles.academicNumberBox}>
            <Text style={styles.academicLabel}>Credits</Text>
            <Text style={styles.academicNumber}>{student.creditHours}</Text>
          </View>
        </View>

        <SectionTitle title="Course Result" subtitle="Select a course to view current progress" />
        <View style={styles.courseChoiceRow}>
          {courses.map((course) => (
            <Pressable
              key={course.code}
              onPress={() => setSelectedCourseCode(course.code)}
              style={[
                styles.courseChoice,
                selectedCourseCode === course.code ? styles.courseChoiceActive : null,
              ]}
            >
              <Text
                style={[
                  styles.courseChoiceText,
                  selectedCourseCode === course.code ? styles.courseChoiceTextActive : null,
                ]}
              >
                {course.code}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.selectedCourseCard}>
          <Text style={styles.selectedCourseCode}>{selectedCourse.code}</Text>
          <Text style={styles.selectedCourseTitle}>{selectedCourse.title}</Text>
          <View style={styles.resultStatsRow}>
            <View style={styles.resultStatBox}>
              <Text style={styles.resultStatLabel}>Marks</Text>
              <Text style={styles.resultStatValue}>{selectedCourse.marks}%</Text>
            </View>
            
            <View style={styles.resultStatBox}>
              <Text style={styles.resultStatLabel}>Grade</Text>
              <Text style={styles.resultStatValue}>{selectedCourse.grade}</Text>
            </View>

            <View style={styles.resultStatBox}>
              <Text style={styles.resultStatLabel}>Attendance</Text>
              <Text style={styles.resultStatValue}>{selectedCourse.attendance}%</Text>
            </View>
          </View>
        </View>

        <View style={styles.chartCard}>
          <PieChart
            data={marksPieData}
            width={320}
            height={190}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="10"
            chartConfig={chartConfig}
          />
          <Text style={styles.chartNote}>
            Current marks progress for {selectedCourse.code}
          </Text>
        </View>

      </View>
    );
  }

  function renderPlanner() {
    return (
      <View>
        <SectionTitle
          title="Study Planner"
          subtitle="Add tasks, track deadlines and mark work as completed"
        />

        <View style={styles.formCard}>
          <Text style={styles.formHeading}>Add New Task</Text>

          <Text style={styles.formLabel}>Task description</Text>
          <TextInput
            value={taskDescription}
            onChangeText={setTaskDescription}
            placeholder="Example: Finish Assignment 1"
            placeholderTextColor="#8A98A6"
            style={styles.input}
          />

          <Text style={styles.formLabelWithSpace}>Subject</Text>
          <View style={styles.subjectChoiceRow}>
            {courses.map((course) => (
              <Pressable
                key={course.code}
                onPress={() => setTaskSubject(course.code)}
                style={[
                  styles.subjectChoice,
                  taskSubject === course.code ? styles.subjectChoiceActive : null,
                ]}
              >
                <Text
                  style={[
                    styles.subjectChoiceText,
                    taskSubject === course.code ? styles.subjectChoiceTextActive : null,
                  ]}
                >
                  {course.code}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.formLabelWithSpace}>Due date</Text>
          <TextInput
            value={taskDueDate}
            onChangeText={setTaskDueDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#8A98A6"
            style={styles.input}
          />

          <Pressable onPress={addTask} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Add task</Text>
          </Pressable>

          {taskFormMessage !== '' ? (
            <Text style={styles.taskFormMessage}>{taskFormMessage}</Text>
          ) : (
            <Text style={styles.helperText}>Example date: 2026-09-20</Text>
          )}
        </View>

        <SectionTitle title="Task Summary" subtitle="Status updates automatically using the due date" />
        <View style={styles.planMessageBox}>
          <Text style={styles.planMessage}>
            {taskStatusMessage}
          </Text>
        </View>

        <View style={styles.taskSummaryRow}>
          <View style={styles.taskSummaryCard}>
            <Text style={styles.taskSummaryNumber}>{pendingTasks.length}</Text>
            <Text style={styles.taskSummaryLabel}>Pending</Text>
          </View>

          <View style={styles.taskSummaryCard}>
            <Text style={styles.taskSummaryNumber}>{completedTasks.length}</Text>
            <Text style={styles.taskSummaryLabel}>Done</Text>
          </View>

          <View style={[styles.taskSummaryCard, styles.missedSummaryCard]}>
            <Text style={styles.missedSummaryNumber}>{missedTasks.length}</Text>
            <Text style={styles.taskSummaryLabel}>Missed</Text>
          </View>
        </View>

        <SectionTitle
          title="My Task List"
          subtitle={`${completedTasks.length} completed · ${missedTasks.length} missed`}
        />

        <View style={styles.filterRow}>
          {['All', 'Pending', 'Done', 'Missed'].map((filterName) => (
            <Pressable
              key={filterName}
              onPress={() => setTaskFilter(filterName)}
              style={[
                styles.taskFilterButton,
                taskFilter === filterName ? styles.taskFilterButtonActive : null,
              ]}
            >
              <Text
                style={[
                  styles.taskFilterText,
                  taskFilter === filterName ? styles.taskFilterTextActive : null,
                ]}
              >
                {filterName}
              </Text>
            </Pressable>
          ))}
        </View>

        {visibleTasks.length > 0 ? (
          visibleTasks.map((task) => {
            const completed = completedTaskIds.includes(task.id);
            const missed = isTaskMissed(task);

            return (
              <View
                key={task.id}
                style={[
                  styles.taskRow,
                  completed ? styles.taskRowCompleted : null,
                  missed ? styles.taskRowMissed : null,
                ]}
              >
                <View
                  style={[
                    styles.taskStatusBox,
                    completed ? styles.taskStatusDone : null,
                    missed ? styles.taskStatusMissed : null,
                  ]}
                >
                  <Text style={styles.taskStatusText}>
                    {completed ? 'DONE' : missed ? 'MISSED' : 'DUE'}
                  </Text>
                </View>

                <View style={styles.taskInfoBox}>
                  <Text style={[styles.taskTitle, completed ? styles.completedText : null]}>
                    {task.title}
                  </Text>
                  <Text style={styles.taskMeta}>{task.course} · Due {task.due}</Text>
                </View>

                {completed ? (
                  <Pressable style={styles.undoButton} onPress={() => toggleTask(task.id)}>
                    <Text style={styles.undoButtonText}>Undo</Text>
                  </Pressable>
                ) : missed ? (
                  <View style={styles.missedButton}>
                    <Text style={styles.missedButtonText}>Missed</Text>
                  </View>
                ) : (
                  <Pressable style={styles.turnInButton} onPress={() => toggleTask(task.id)}>
                    <Text style={styles.turnInButtonText}>Turn in</Text>
                  </Pressable>
                )}
              </View>
            );
          })
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No tasks in this category</Text>
            <Text style={styles.emptyText}>Choose another filter or add a new task.</Text>
          </View>
        )}

        <SectionTitle title="Study Suggestion" subtitle="Optional helper based on your available time" />
        <View style={styles.formCard}>
          <Text style={styles.formLabel}>Available study hours today</Text>
          <TextInput
            value={studyHours}
            onChangeText={setStudyHours}
            keyboardType="numeric"
            placeholder="Example: 3"
            placeholderTextColor="#8A98A6"
            style={styles.input}
          />

          <Pressable onPress={createStudyPlan} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Create study suggestion</Text>
          </Pressable>

          {planMessage !== '' ? (
            <View style={styles.planMessageBox}>
              <Text style={styles.planMessage}>{planMessage}</Text>
            </View>
          ) : (
            <Text style={styles.helperText}>Enter a value from 1 to 8 hours.</Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.page}>
        <Header
          studentName={student.name}
          registrationNo={student.registrationNo}
          semester={student.semester}
          campus={student.campus}
        />

        <View style={styles.content}>
          <View style={styles.viewSwitchBox}>
            <ViewButton
              title="Home"
              active={activeView === 'Dashboard'}
              onPress={() => setActiveView('Dashboard')}
            />
            <ViewButton
              title="Courses"
              active={activeView === 'Courses'}
              onPress={() => setActiveView('Courses')}
            />
            <ViewButton
              title="Academics"
              active={activeView === 'Academics'}
              onPress={() => setActiveView('Academics')}
            />
            <ViewButton
              title="Planner"
              active={activeView === 'Planner'}
              onPress={() => setActiveView('Planner')}
            />
          </View>

          {activeView === 'Dashboard' ? renderDashboard() : null}
          {activeView === 'Courses' ? renderCourses() : null}
          {activeView === 'Academics' ? renderAcademics() : null}
          {activeView === 'Planner' ? renderPlanner() : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F7FA',
  },
  page: {
    paddingBottom: 30,
  },
  content: {
    paddingHorizontal: 14,
  },
  viewSwitchBox: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 6,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E2E8EF',
  },
  welcomeCard: {
    backgroundColor: '#214D79',
    borderRadius: 14,
    padding: 15,
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeTextBox: {
    flex: 1,
  },
  welcomeSmall: {
    color: '#BCD6ED',
    fontSize: 10,
  },
  welcomeHeading: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
    marginTop: 2,
  },
  welcomeBody: {
    color: '#D9E7F3',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },
  statusBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginLeft: 10,
    alignItems: 'center',
  },
  statusLabel: {
    color: '#76889A',
    fontSize: 9,
  },
  statusValue: {
    color: '#34714A',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  quickActionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  warningBox: {
    backgroundColor: '#FFF2EF',
    borderWidth: 1,
    borderColor: '#F3C9C1',
    borderRadius: 12,
    padding: 13,
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningTextBox: {
    flex: 1,
  },
  warningTitle: {
    color: '#9E3E32',
    fontSize: 13,
    fontWeight: '700',
  },
  warningBody: {
    color: '#7A4A43',
    fontSize: 10,
    marginTop: 3,
  },
  warningLink: {
    color: '#9E3E32',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 8,
  },
  goodBox: {
    backgroundColor: '#EDF8F0',
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
  },
  goodText: {
    color: '#3C7048',
    fontSize: 11,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8EF',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chart: {
    borderRadius: 10,
  },
  chartNote: {
    color: '#66788A',
    fontSize: 10,
    marginTop: 2,
    marginBottom: 6,
    textAlign: 'center',
  },
  deadlineRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6EBF0',
  },
  deadlineDateBox: {
    width: 50,
    borderRadius: 8,
    backgroundColor: '#E8F1FA',
    paddingVertical: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  deadlineDate: {
    color: '#153A63',
    fontWeight: '800',
    fontSize: 9,
  },
  deadlineTextBox: {
    flex: 1,
  },
  deadlineCourse: {
    color: '#768697',
    fontSize: 9,
    fontWeight: '700',
  },
  deadlineTask: {
    color: '#2C4052',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  deadlineArrow: {
    color: '#6D8192',
    fontSize: 22,
  },
  announcementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2B6EA6',
  },
  announcementType: {
    color: '#2B6EA6',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  announcementTitle: {
    color: '#203647',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  announcementText: {
    color: '#6C7A89',
    fontSize: 10,
    marginTop: 3,
    lineHeight: 15,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE4EC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: '#1F3344',
    fontSize: 12,
  },
  filterRow: {
    flexDirection: 'row',
    marginTop: 9,
  },
  filterButton: {
    backgroundColor: '#E9EEF4',
    borderRadius: 8,
    paddingHorizontal: 11,
    paddingVertical: 8,
    marginRight: 7,
  },
  filterButtonActive: {
    backgroundColor: '#153A63',
  },
  filterWarningActive: {
    backgroundColor: '#FCE9E5',
  },
  filterText: {
    color: '#536273',
    fontSize: 10,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  filterWarningText: {
    color: '#9E3E32',
  },
  resultText: {
    color: '#758494',
    fontSize: 9,
    marginTop: 9,
    marginBottom: 7,
  },
  emptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8EF',
  },
  emptyTitle: {
    color: '#263849',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyText: {
    color: '#7A8998',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  academicSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8EF',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  academicNumberBox: {
    flex: 1,
    alignItems: 'center',
  },
  academicDivider: {
    width: 1,
    height: 38,
    backgroundColor: '#E4EAF0',
  },
  academicLabel: {
    color: '#7A8998',
    fontSize: 9,
  },
  academicNumber: {
    color: '#153A63',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 3,
  },
  courseChoiceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  courseChoice: {
    backgroundColor: '#E9EEF4',
    borderRadius: 8,
    paddingHorizontal: 11,
    paddingVertical: 7,
    marginRight: 6,
    marginBottom: 6,
  },
  courseChoiceActive: {
    backgroundColor: '#153A63',
  },
  courseChoiceText: {
    color: '#536273',
    fontSize: 10,
    fontWeight: '700',
  },
  courseChoiceTextActive: {
    color: '#FFFFFF',
  },
  selectedCourseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8EF',
    padding: 14,
    marginBottom: 10,
  },
  selectedCourseCode: {
    color: '#2B6EA6',
    fontSize: 11,
    fontWeight: '800',
  },
  selectedCourseTitle: {
    color: '#243A4B',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  resultStatsRow: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EDF1F5',
  },
  resultStatBox: {
    flex: 1,
    alignItems: 'center',
  },
  resultStatLabel: {
    color: '#7D8B98',
    fontSize: 9,
  },
  resultStatValue: {
    color: '#153A63',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8EF',
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#E8F1FA',
    paddingVertical: 9,
    paddingHorizontal: 10,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#EDF1F5',
  },
  tableHeaderText: {
    flex: 1,
    color: '#153A63',
    fontSize: 9,
    fontWeight: '800',
    textAlign: 'center',
  },
  tableText: {
    flex: 1,
    color: '#4D6173',
    fontSize: 10,
    textAlign: 'center',
  },
  tableSemester: {
    flex: 2,
    textAlign: 'left',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8EF',
    borderRadius: 12,
    padding: 14,
  },
  formLabel: {
    color: '#314759',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 7,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D7E0E8',
    borderRadius: 9,
    paddingHorizontal: 11,
    paddingVertical: 10,
    color: '#1F3344',
    fontSize: 12,
  },
  primaryButton: {
    backgroundColor: '#153A63',
    borderRadius: 9,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  helperText: {
    color: '#8492A0',
    fontSize: 9,
    marginTop: 9,
  },
  planMessageBox: {
    backgroundColor: '#EDF4FA',
    borderRadius: 9,
    padding: 10,
    marginTop: 10,
  },
  planMessage: {
    color: '#36566F',
    fontSize: 10,
    lineHeight: 15,
  },
  formHeading: {
    color: '#153A63',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  formLabelWithSpace: {
    color: '#314759',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 7,
    marginTop: 12,
  },
  subjectChoiceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  subjectChoice: {
    borderWidth: 1,
    borderColor: '#D5DEE7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 7,
    marginBottom: 7,
    backgroundColor: '#F8FAFC',
  },
  subjectChoiceActive: {
    backgroundColor: '#153A63',
    borderColor: '#153A63',
  },
  subjectChoiceText: {
    color: '#56697A',
    fontSize: 10,
    fontWeight: '700',
  },
  subjectChoiceTextActive: {
    color: '#FFFFFF',
  },
  taskFormMessage: {
    color: '#496173',
    fontSize: 9,
    marginTop: 9,
  },
  taskSummaryRow: {
    flexDirection: 'row',
    marginHorizontal: -3,
  },
  taskSummaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8EF',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  missedSummaryCard: {
    backgroundColor: '#FFF5F3',
    borderColor: '#F0D0CA',
  },
  taskSummaryNumber: {
    color: '#153A63',
    fontSize: 18,
    fontWeight: '800',
  },
  missedSummaryNumber: {
    color: '#A64A3D',
    fontSize: 18,
    fontWeight: '800',
  },
  taskSummaryLabel: {
    color: '#718191',
    fontSize: 9,
    marginTop: 2,
  },
  taskFilterButton: {
    flex: 1,
    backgroundColor: '#EDF1F5',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  taskFilterButtonActive: {
    backgroundColor: '#153A63',
  },
  taskFilterText: {
    color: '#596B7B',
    fontSize: 9,
    fontWeight: '700',
  },
  taskFilterTextActive: {
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#E8F1FA',
    borderRadius: 9,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#235D91',
    fontSize: 11,
    fontWeight: '700',
  },
  taskRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E3E9EF',
    padding: 11,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskRowCompleted: {
    backgroundColor: '#F2F8F3',
    borderColor: '#CFE3D4',
  },
  taskRowMissed: {
    backgroundColor: '#FFF5F3',
    borderColor: '#F0D0CA',
  },
  checkBox: {
    width: 23,
    height: 23,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A9B7C3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkBoxCompleted: {
    backgroundColor: '#39734D',
    borderColor: '#39734D',
  },
  checkText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  taskStatusBox: {
    minWidth: 47,
    borderRadius: 7,
    backgroundColor: '#E8F1FA',
    paddingHorizontal: 6,
    paddingVertical: 6,
    alignItems: 'center',
    marginRight: 9,
  },
  taskStatusDone: {
    backgroundColor: '#DDEFE2',
  },
  taskStatusMissed: {
    backgroundColor: '#F4D9D4',
  },
  taskStatusText: {
    color: '#39566E',
    fontSize: 7,
    fontWeight: '800',
  },
  turnInButton: {
    backgroundColor: '#153A63',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginLeft: 7,
  },
  turnInButtonText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '700',
  },
  undoButton: {
    backgroundColor: '#E8F1FA',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginLeft: 7,
  },
  undoButtonText: {
    color: '#235D91',
    fontSize: 8,
    fontWeight: '700',
  },
  missedButton: {
    backgroundColor: '#F3D9D4',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginLeft: 7,
  },
  missedButtonText: {
    color: '#9C4A3F',
    fontSize: 8,
    fontWeight: '700',
  },
  taskInfoBox: {
    flex: 1,
  },
  taskTitle: {
    color: '#2D4355',
    fontSize: 11,
    fontWeight: '700',
  },
  taskMeta: {
    color: '#7A8998',
    fontSize: 9,
    marginTop: 2,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#718077',
  },
  taskActionText: {
    color: '#2B6EA6',
    fontSize: 9,
    fontWeight: '700',
  },
});
