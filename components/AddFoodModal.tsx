import React, { useState } from 'react';
import { MOCK_FOOD_DATABASE } from '../constants';
import { FoodItem } from '../types';

interface AddFoodModalProps {
    onClose: () => void;
    onAddFood: (food: FoodItem) => void;
}

const AddFoodModal: React.FC<AddFoodModalProps> = ({ onClose, onAddFood }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredFood = MOCK_FOOD_DATABASE.filter(food => 
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-brand-surface w-full max-w-sm m-4 p-4 rounded-2xl flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Add Food</h2>
                    <button onClick={onClose} className="text-brand-text-secondary text-2xl font-bold">&times;</button>
                </div>
                <input 
                    type="text"
                    placeholder="Search for food..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black/50 p-2 rounded-lg mb-4 text-white"
                />
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {filteredFood.map(food => (
                        <div key={food.id} onClick={() => onAddFood(food)} className="flex justify-between items-center p-2 rounded-lg hover:bg-white/10 cursor-pointer">
                           <div>
                                <p className="text-white">{food.name}</p>
                                <p className="text-xs text-brand-text-secondary">{food.calories} kcal</p>
                           </div>
                           <button className="text-brand-primary text-xl">+</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AddFoodModal;
