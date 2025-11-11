import React, { useState } from 'react';
import { useDailyLog } from '../hooks/useDailyLog';
import CalorieSummary from './CalorieSummary';
import MacroSummary from './MacroSummary';
import MealCard from './MealCard';
import AddFoodModal from './AddFoodModal';
import CameraModal from './CameraModal';
import { FoodItem, MealType } from '../types';

const DietScreen: React.FC = () => {
    const { dailyLog, addFoodItem, addMultipleFoodItems, getMacros } = useDailyLog();
    const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false);
    const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState<MealType | null>(null);
    const [scannedFoods, setScannedFoods] = useState<FoodItem[] | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<'gain' | 'loss' | null>(null);

    const macros = getMacros();
    const calorieGoal = 2500;

    const handleAddFoodClick = (mealType: MealType) => {
        setSelectedMeal(mealType);
        setIsAddFoodModalOpen(true);
    };

    const handleScanMealClick = (mealType: MealType) => {
        setSelectedMeal(mealType);
        setIsCameraModalOpen(true);
    };
    
    const handleGeneralScanClick = () => {
        setSelectedMeal(null); // Set to null for the general scanner flow
        setIsCameraModalOpen(true);
    };

    const handleAddFood = (food: FoodItem) => {
        if (selectedMeal) {
            addFoodItem(selectedMeal, food);
        }
        setIsAddFoodModalOpen(false);
        setSelectedMeal(null);
    }
    
    const handleAddMultipleFoods = (foods: FoodItem[]) => {
        setIsCameraModalOpen(false);
        if (selectedMeal) {
            // Flow initiated from a specific meal card
            addMultipleFoodItems(selectedMeal, foods);
            setSelectedMeal(null);
        } else {
            // Flow initiated from the general header button
            setScannedFoods(foods);
        }
    }
    
    const handleMealSelection = (mealType: MealType) => {
        if (scannedFoods) {
            addMultipleFoodItems(mealType, scannedFoods);
        }
        setScannedFoods(null);
    };
    
    const weightGainPlan = `
        <h4 class="font-bold text-lg text-white mb-3">Weight Gain Plan</h4>
        <div class="space-y-3">
            <div>
                <p class="font-semibold text-brand-primary-light">Breakfast:</p>
                <p>2 parathas, 3 eggs, 1 banana, 1 glass milk + whey protein, 1 tbsp peanut butter<br/>(~700 cal, 40g protein, 65g carbs, 25g fat)</p>
            </div>
            <div>
                <p class="font-semibold text-brand-primary-light">Snack:</p>
                <p>Banana shake with nuts<br/>(~400 cal, 15g protein, 50g carbs, 15g fat)</p>
            </div>
            <div>
                <p class="font-semibold text-brand-primary-light">Lunch:</p>
                <p>Rice/chapati, dal, paneer or chicken, salad<br/>(~750 cal, 45g protein, 90g carbs, 20g fat)</p>
            </div>
            <div>
                <p class="font-semibold text-brand-primary-light">Evening:</p>
                <p>Peanut butter sandwich + whey protein<br/>(~400 cal, 30g protein, 40g carbs, 10g fat)</p>
            </div>
            <div>
                <p class="font-semibold text-brand-primary-light">Dinner:</p>
                <p>Rice/chapati, sabzi, paneer or chicken, curd<br/>(~500 cal, 35g protein, 50g carbs, 15g fat)</p>
            </div>
            <div>
                <p class="font-semibold text-brand-primary-light">Before Bed:</p>
                <p>Milk + honey + almonds<br/>(~250 cal, 10g protein, 20g carbs, 10g fat)</p>
            </div>
        </div>
        <p class="font-bold text-white mt-4 pt-3 border-t border-white/10">👉 Total: ~3000 kcal, 175g protein, 315g carbs, 95g fat</p>
    `;

    const weightLossPlan = `
        <h4 class="font-bold text-lg text-white mb-3">Weight Loss Plan</h4>
        <div class="space-y-3">
            <div>
                <p class="font-semibold text-brand-primary-light">Breakfast:</p>
                <p>3 egg omelet, 2 brown breads, green tea, whey protein<br/>(~350 cal, 30g protein, 25g carbs, 10g fat)</p>
            </div>
            <div>
                <p class="font-semibold text-brand-primary-light">Snack:</p>
                <p>1 fruit + 5 almonds<br/>(~150 cal, 5g protein, 20g carbs, 5g fat)</p>
            </div>
            <div>
                <p class="font-semibold text-brand-primary-light">Lunch:</p>
                <p>2 chapati, dal/paneer/chicken, salad<br/>(~450 cal, 35g protein, 40g carbs, 10g fat)</p>
            </div>
            <div>
                <p class="font-semibold text-brand-primary-light">Evening:</p>
                <p>Black coffee + roasted chana/sprouts<br/>(~200 cal, 15g protein, 20g carbs, 5g fat)</p>
            </div>
            <div>
                <p class="font-semibold text-brand-primary-light">Dinner:</p>
                <p>Soup + grilled paneer/tofu/fish + veggies<br/>(~300 cal, 30g protein, 20g carbs, 8g fat)</p>
            </div>
            <div>
                <p class="font-semibold text-brand-primary-light">Before Bed:</p>
                <p>Skimmed milk or herbal tea<br/>(~100 cal, 8g protein, 8g carbs, 2g fat)</p>
            </div>
        </div>
        <p class="font-bold text-white mt-4 pt-3 border-t border-white/10">👉 Total: ~1550 kcal, 123g protein, 133g carbs, 40g fat</p>
    `;


    return (
        <div className="p-4 space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Today's Diet</h1>
                    <p className="text-brand-text-secondary">Your nutrition log for today.</p>
                </div>
                <button 
                    onClick={handleGeneralScanClick} 
                    className="bg-brand-surface p-3 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="Scan food with camera"
                >
                    <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </button>
            </header>

            <CalorieSummary calories={macros.calories} goal={calorieGoal} />

            {/* AI Food Plan Section */}
            <div className="bg-brand-surface p-4 rounded-2xl">
                <h3 className="text-lg font-bold text-white text-center mb-3 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                    AI Food Plan
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setSelectedPlan('gain')} className="bg-brand-surface-light font-semibold p-3 rounded-lg hover:bg-brand-primary/40 transition-colors flex flex-col items-center gap-1 text-white">
                         <span>💪</span>
                         <span>Weight Gain</span>
                    </button>
                    <button onClick={() => setSelectedPlan('loss')} className="bg-brand-surface-light font-semibold p-3 rounded-lg hover:bg-brand-primary/40 transition-colors flex flex-col items-center gap-1 text-white">
                        <span>🥗</span>
                        <span>Weight Loss</span>
                    </button>
                </div>
            </div>

            <MacroSummary protein={macros.protein} carbs={macros.carbs} fat={macros.fat} />

            <div className="space-y-4">
                {dailyLog.meals.map(meal => (
                    <MealCard 
                        key={meal.type} 
                        meal={meal} 
                        onAddFood={() => handleAddFoodClick(meal.type)}
                        onScanMeal={() => handleScanMealClick(meal.type)}
                    />
                ))}
            </div>

            {isAddFoodModalOpen && (
                <AddFoodModal 
                    onClose={() => setIsAddFoodModalOpen(false)}
                    onAddFood={handleAddFood}
                />
            )}
            {isCameraModalOpen && (
                <CameraModal
                    onClose={() => setIsCameraModalOpen(false)}
                    onAddFoods={handleAddMultipleFoods}
                />
            )}
            {scannedFoods && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-brand-surface w-full max-w-sm p-4 rounded-2xl shadow-glass border border-white/10">
                        <h3 className="text-lg font-bold text-white mb-4 text-center">Add to Which Meal?</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {dailyLog.meals.map(meal => (
                                <button 
                                    key={meal.type} 
                                    onClick={() => handleMealSelection(meal.type)}
                                    className="p-4 bg-white/5 rounded-lg text-white font-semibold hover:bg-brand-primary transition-colors"
                                >
                                    {meal.type}
                                </button>
                            ))}
                        </div>
                        <button 
                            onClick={() => setScannedFoods(null)} 
                            className="w-full text-center text-brand-text-secondary mt-4 py-2"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
             {/* AI Food Plan Modal */}
            {selectedPlan && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fadeInUp">
                    <div className="bg-brand-surface w-full max-w-sm rounded-2xl flex flex-col relative shadow-glass border border-white/10">
                         <button onClick={() => setSelectedPlan(null)} className="absolute top-2 right-2 text-white bg-black/30 rounded-full w-8 h-8 flex items-center justify-center z-10">&times;</button>
                         <div className="p-6 text-sm text-brand-text-secondary max-h-[80vh] overflow-y-auto">
                            <div dangerouslySetInnerHTML={{ __html: selectedPlan === 'gain' ? weightGainPlan : weightLossPlan }} />
                         </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DietScreen;