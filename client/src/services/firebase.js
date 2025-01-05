import { db } from '../config/firebase';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export const saveLayoutToFirebase = async (userId, layout) => {
  try {
    const layoutRef = doc(collection(db, 'layouts'));
    await setDoc(layoutRef, {
      userId,
      layout,
      createdAt: new Date().toISOString(),
      isActive: true
    });
    return layoutRef.id;
  } catch (error) {
    console.error('Error saving layout to Firebase:', error);
    throw new Error('Failed to save layout');
  }
};

export const getLayoutFromFirebase = async (userId) => {
  try {
    const layoutsRef = collection(db, 'layouts');
    const q = query(
      layoutsRef,
      where('userId', '==', userId),
      where('isActive', '==', true)
    );
    
    const snapshot = await getDocs(q);
    const layouts = [];
    
    snapshot.forEach((doc) => {
      layouts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return layouts.length > 0 ? layouts[0].layout : [];
  } catch (error) {
    console.error('Error getting layout from Firebase:', error);
    throw new Error('Failed to get layout');
  }
};