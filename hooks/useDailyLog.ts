import { useState, useEffect, useCallback } from 'react';
import { type DailyLog, type FoodItem, type MealType } from '../types';
import { MOCK_DAILY_LOG } from '../constants';
import { auth, db } from '../firebase';
// Fix: Firestore calls updated to v8/compat syntax. No modular imports needed.


export const useDailyLog = () => {
  const [dailyLog, setDailyLog] = useState<DailyLog>({ ...MOCK_DAILY_LOG, date: new Date().toISOString().split('T')[0] });
  const user = auth.currentUser;
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!user) {
      setDailyLog({ ...MOCK_DAILY_LOG, date: today });
      return;
    }

    // Fix: Use v8/compat syntax for Firestore doc reference
    const docRef = db.collection('users').doc(user.uid).collection('dailyLogs').doc(today);
    // Fix: Use v8/compat syntax for onSnapshot
    const unsubscribe = docRef.onSnapshot((docSnap) => {
        if (docSnap.exists) {
            setDailyLog(docSnap.data() as DailyLog);
        } else {
            const initialLog = { ...MOCK_DAILY_LOG, date: today };
            setDailyLog(initialLog);
            // Create the document for today if it doesn't exist
            // Fix: Use v8/compat syntax for setDoc
            docRef.set(initialLog);
        }
    }, (error) => {
        console.error("Error fetching daily log: ", error);
    });

    return () => unsubscribe();
  }, [user, today]);

  const updateMealInFirestore = useCallback(async (updatedLog: DailyLog) => {
      if (!user) return;
      // Fix: Use v8/compat syntax for Firestore doc reference
      const docRef = db.collection('users').doc(user.uid).collection('dailyLogs').doc(today);
      try {
          // Fix: Use v8/compat syntax for setDoc
          await docRef.set(updatedLog);
      } catch (error) {
          console.error("Error updating daily log: ", error);
      }
  }, [user, today]);
  
  const addFoodItem = useCallback((mealType: MealType, foodItem: FoodItem) => {
    setDailyLog(prevLog => {
      const newLog = JSON.parse(JSON.stringify(prevLog));
      const meal = newLog.meals.find((m: { type: MealType; }) => m.type === mealType);
      if (meal) {
        meal.items.push(foodItem);
      }
      updateMealInFirestore(newLog); // Persist change to Firestore
      return newLog;
    });
  }, [updateMealInFirestore]);

  const addMultipleFoodItems = useCallback((mealType: MealType, foodItems: FoodItem[]) => {
    setDailyLog(prevLog => {
      const newLog = JSON.parse(JSON.stringify(prevLog));
      const meal = newLog.meals.find((m: { type: MealType; }) => m.type === mealType);
      if (meal) {
        meal.items.push(...foodItems);
      }
      updateMealInFirestore(newLog); // Persist change to Firestore
      return newLog;
    });
  }, [updateMealInFirestore]);
  
  const getMacros = useCallback(() => {
    return dailyLog.meals.reduce((acc, meal) => {
      meal.items.forEach(item => {
        acc.calories += item.calories;
        acc.protein += item.protein;
        acc.carbs += item.carbs;
        acc.fat += item.fat;
      });
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [dailyLog]);

  return { dailyLog, addFoodItem, addMultipleFoodItems, getMacros };
};