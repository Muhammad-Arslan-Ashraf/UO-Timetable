import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, collectionGroup, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp, query } from 'firebase/firestore';

const TimetableContext = createContext(null);

export const TimetableProvider = ({ children }) => {
  const [timetables, setTimetables] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Listen to Firestore for timetables across all department subcollections
  useEffect(() => {
    const q = query(collectionGroup(db, 'timetables'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTimetables = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        _deptId: doc.ref.parent.parent?.id || 'general' // Safe check for legacy root collections
      }));
      setTimetables(fetchedTimetables);
    }, (error) => {
      console.error("Error fetching timetables from Firestore:", error);
    });

    return () => unsubscribe();
  }, []);

  // Listen to Firestore for notifications
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'notifications'), (snapshot) => {
      const fetchedNotifications = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      // Sort by createdAt descending
      const sortedNotifs = fetchedNotifications.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
      setNotifications(sortedNotifs);
    }, (error) => {
      console.error("Error fetching notifications from Firestore:", error);
    });

    return () => unsubscribe();
  }, []);

  const getDeptId = (departmentName) => {
    if (!departmentName) return 'general';
    return departmentName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  };

  const addTimetable = async (timetable) => {
    try {
      const deptId = getDeptId(timetable.department);
      
      // 1. Ensure department document exists
      await setDoc(doc(db, 'departments', deptId), {
        name: timetable.department || 'General',
        updatedAt: serverTimestamp()
      }, { merge: true });

      // 2. Add timetable to subcollection
      await setDoc(doc(db, 'departments', deptId, 'timetables', timetable.id), {
        ...timetable,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error adding timetable:", error);
    }
  };

  const updateTimetable = async (id, newTimetable) => {
    try {
      const existing = timetables.find(t => t.id === id);
      const oldDeptId = existing ? (existing._deptId || getDeptId(existing.department)) : null;
      const newDeptId = getDeptId(newTimetable.department);

      // If department changed, remove from old department's subcollection
      if (oldDeptId && oldDeptId !== newDeptId) {
        await deleteDoc(doc(db, 'departments', oldDeptId, 'timetables', id));
      }

      // Ensure new department document exists
      await setDoc(doc(db, 'departments', newDeptId), {
        name: newTimetable.department || 'General',
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Update/Add timetable in subcollection
      await setDoc(doc(db, 'departments', newDeptId, 'timetables', id), {
        ...newTimetable,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error("Error updating timetable:", error);
    }
  };

  const deleteTimetable = async (id) => {
    try {
      const existing = timetables.find(t => t.id === id);
      const deptId = existing ? (existing._deptId || getDeptId(existing.department)) : 'general';
      
      await deleteDoc(doc(db, 'departments', deptId, 'timetables', id));
    } catch (error) {
      console.error("Error deleting timetable:", error);
    }
  };

  const findTimetable = (dept, prog, semester, section, shift) => {
    return timetables.find(t => {
      const safeCompare = (a, b) => String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();
      
      const matchDept = safeCompare(t.department, dept);
      const matchProg = safeCompare(t.program, prog);
      const matchSem = safeCompare(t.semester, semester);
      const matchShift = safeCompare(t.shift, shift);
      
      // Section is tricky: if user didn't pick one, or db has None/Empty, we match.
      const matchSec = !section || safeCompare(t.section, section) || safeCompare(t.section, 'None') || !t.section;

      return matchDept && matchProg && matchSem && matchShift && matchSec;
    });
  };

  const addNotification = async (notif) => {
    try {
      await setDoc(doc(db, 'notifications', String(notif.id)), notif);
    } catch (error) {
      console.error("Error adding notification:", error);
      throw error;
    }
  };

  const updateNotification = async (id, data) => {
    try {
      await setDoc(doc(db, 'notifications', String(id)), data, { merge: true });
    } catch (error) {
      console.error("Error updating notification:", error);
      throw error;
    }
  };

  const deleteNotification = async (id) => {
    try {
      await deleteDoc(doc(db, 'notifications', String(id)));
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  };

  return (
    <TimetableContext.Provider value={{
      timetables,
      addTimetable,
      updateTimetable,
      deleteTimetable,
      findTimetable,
      notifications,
      addNotification,
      updateNotification,
      deleteNotification,
    }}>
      {children}
    </TimetableContext.Provider>
  );
};

export const useTimetable = () => useContext(TimetableContext);
