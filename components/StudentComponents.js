import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function Header({ studentName, registrationNo, semester, campus }) {
  return (
    <View style={styles.header}>
      <View style={styles.logoBox}>
        <Text style={styles.logoText}>FLEX</Text>
      </View>

      <View style={styles.headerTextBox}>
        <Text style={styles.portalText}>Student Companion</Text>
        <Text style={styles.welcomeText}>{studentName}</Text>
        <Text style={styles.studentMeta}>{registrationNo}  |  {campus}</Text>
      </View>

      <View style={styles.semesterBox}>
        <Text style={styles.semesterText}>{semester}</Text>
      </View>
    </View>
  );
}

export function ViewButton({ title, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.viewButton, active ? styles.activeViewButton : null]}
    >
      <Text style={[styles.viewButtonText, active ? styles.activeViewButtonText : null]}>
        {title}
      </Text>
    </Pressable>
  );
}

export function SectionTitle({ title, subtitle, actionText, onAction }) {
  return (
    <View style={styles.sectionTitleRow}>
      <View style={styles.sectionTitleBox}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {actionText ? (
        <Pressable onPress={onAction} style={styles.smallActionButton}>
          <Text style={styles.smallActionText}>{actionText}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function SummaryCard({ label, value, note, status }) {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={[styles.summaryNote, status === 'good' ? styles.goodText : null]}>{note}</Text>
    </View>
  );
}

export function QuickAction({ title, subtitle, onPress }) {
  return (
    <Pressable style={styles.quickAction} onPress={onPress}>
      <Text style={styles.quickActionTitle}>{title}</Text>
      <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
    </Pressable>
  );
}

export function ProgressBar({ value, warning }) {
  return (
    <View style={styles.progressTrack}>
      <View
        style={[
          styles.progressFill,
          { width: `${value}%` },
          warning ? styles.progressWarning : null,
        ]}
      />
    </View>
  );
}

export function CourseCard({ course, onSelect }) {
  const lowAttendance = course.attendance < 80;

  return (
    <View style={styles.courseCard}>
      <View style={styles.courseTopRow}>
        <View style={styles.courseCodeBox}>
          <Text style={styles.courseCode}>{course.code}</Text>
        </View>
        <View style={styles.courseNameBox}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <Text style={styles.teacherText}>{course.teacher}</Text>
          <Text style={styles.classText}>{course.classTime}  |  {course.room}</Text>
        </View>
      </View>

      <View style={styles.attendanceRow}>
        <Text style={styles.smallLabel}>Attendance</Text>
        <Text style={[styles.statText, lowAttendance ? styles.warningText : null]}>
          {course.attendance}%
        </Text>
      </View>
      <ProgressBar value={course.attendance} warning={lowAttendance} />

      <View style={styles.courseStatsRow}>
        <View>
          <Text style={styles.smallLabel}>Marks</Text>
          <Text style={styles.statText}>{course.marks}%</Text>
        </View>
        <View>
          <Text style={styles.smallLabel}>Credits</Text>
          <Text style={styles.statText}>{course.creditHours}</Text>
        </View>
        <View>
          <Text style={styles.smallLabel}>Next Due</Text>
          <Text style={styles.statText}>{course.deadline}</Text>
        </View>
      </View>

      <View style={styles.taskBox}>
        <View style={styles.taskTextBox}>
          <Text style={styles.smallLabel}>Next task</Text>
          <Text style={styles.taskText}>{course.nextTask}</Text>
        </View>
        <Pressable style={styles.detailsButton} onPress={() => onSelect(course.code)}>
          <Text style={styles.detailsButtonText}>View details</Text>
        </Pressable>
      </View>

      {lowAttendance ? <Text style={styles.alertBadge}>Attendance needs attention</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#153A63',
    paddingTop: 18,
    paddingBottom: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  logoText: {
    color: '#153A63',
    fontSize: 14,
    fontWeight: '800',
  },
  headerTextBox: {
    flex: 1,
  },
  portalText: {
    color: '#B9D8F4',
    fontSize: 11,
    fontWeight: '600',
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 1,
  },
  studentMeta: {
    color: '#DCE8F3',
    fontSize: 9,
    marginTop: 3,
  },
  semesterBox: {
    backgroundColor: '#214D79',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 7,
    marginLeft: 6,
  },
  semesterText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  viewButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 2,
    backgroundColor: '#E9EEF4',
  },
  activeViewButton: {
    backgroundColor: '#153A63',
  },
  viewButtonText: {
    color: '#536273',
    fontSize: 10,
    fontWeight: '600',
  },
  activeViewButtonText: {
    color: '#FFFFFF',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 9,
  },
  sectionTitleBox: {
    flex: 1,
  },
  sectionTitle: {
    color: '#172B3A',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: '#66788A',
    fontSize: 11,
    marginTop: 2,
  },
  smallActionButton: {
    backgroundColor: '#E8F1FA',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  smallActionText: {
    color: '#235D91',
    fontSize: 10,
    fontWeight: '700',
  },
  summaryCard: {
    flex: 1,
    minWidth: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    margin: 4,
    borderWidth: 1,
    borderColor: '#E2E8EF',
  },
  summaryLabel: {
    color: '#6C7A89',
    fontSize: 10,
  },
  summaryValue: {
    color: '#153A63',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 3,
  },
  summaryNote: {
    color: '#7A8998',
    fontSize: 9,
    marginTop: 3,
  },
  goodText: {
    color: '#3C7048',
  },
  quickAction: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#DDE6EE',
    padding: 12,
    marginBottom: 8,
  },
  quickActionTitle: {
    color: '#153A63',
    fontSize: 12,
    fontWeight: '700',
  },
  quickActionSubtitle: {
    color: '#748596',
    fontSize: 9,
    marginTop: 3,
  },
  progressTrack: {
    height: 7,
    backgroundColor: '#EDF1F5',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 5,
  },
  progressFill: {
    height: 7,
    backgroundColor: '#2B6EA6',
    borderRadius: 8,
  },
  progressWarning: {
    backgroundColor: '#C46A4A',
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8EF',
  },
  courseTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseCodeBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#E8F1FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  courseCode: {
    color: '#153A63',
    fontWeight: '800',
    fontSize: 13,
  },
  courseNameBox: {
    flex: 1,
  },
  courseTitle: {
    color: '#172B3A',
    fontSize: 14,
    fontWeight: '700',
  },
  teacherText: {
    color: '#7A8998',
    fontSize: 10,
    marginTop: 2,
  },
  classText: {
    color: '#52687A',
    fontSize: 9,
    marginTop: 3,
  },
  attendanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 13,
  },
  courseStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 13,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EDF1F5',
  },
  smallLabel: {
    color: '#7A8998',
    fontSize: 9,
  },
  statText: {
    color: '#263849',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  warningText: {
    color: '#B64A3A',
  },
  taskBox: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTextBox: {
    flex: 1,
  },
  taskText: {
    color: '#40586B',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  detailsButton: {
    backgroundColor: '#153A63',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  detailsButtonText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  alertBadge: {
    color: '#9E3E32',
    backgroundColor: '#FBEAE7',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 7,
    fontSize: 9,
    fontWeight: '700',
    alignSelf: 'flex-start',
    marginTop: 10,
  },
});
