import React, { useState } from 'react';

interface WorkoutCalendarProps {
    workoutDates: string[]; // Expecting ISO strings
}

const WorkoutCalendar: React.FC<WorkoutCalendarProps> = ({ workoutDates }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Use local timezone to create a Set of date strings (e.g., "YYYY-MM-DD") for quick lookups
    const workoutDays = new Set(workoutDates.map(isoString => {
        const d = new Date(isoString);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }));

    const changeMonth = (offset: number) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(1); // Set to first of the month to avoid date overflow issues
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-11
    const monthName = currentDate.toLocaleString('default', { month: 'long' });

    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const blanks = Array(firstDayOfMonth).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const calendarDays = [...blanks, ...days];

    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <div className="mt-2">
            <div className="flex justify-between items-center mb-2 px-2">
                <button onClick={() => changeMonth(-1)} className="p-1 rounded-full hover:bg-brand-surface-light text-xl">‹</button>
                <h3 className="font-semibold text-white text-sm">{monthName} {year}</h3>
                <button onClick={() => changeMonth(1)} className="p-1 rounded-full hover:bg-brand-surface-light text-xl">›</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-brand-text-secondary">
                {weekdays.map((day, index) => <div key={index}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-y-1 text-center text-sm mt-1">
                {calendarDays.map((day, index) => {
                    if (!day) return <div key={`blank-${index}`} className="h-7"></div>;

                    const dayString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isToday = dayString === todayString;
                    const hasWorkout = workoutDays.has(dayString);
                    
                    const dayClasses = [
                        "w-7 h-7 flex items-center justify-center rounded-full mx-auto text-xs",
                        isToday ? "bg-brand-primary text-white font-bold" : "text-brand-text",
                        hasWorkout && !isToday ? "border border-brand-primary-light" : "",
                    ].join(" ");
                    
                    return (
                        <div key={day} className={dayClasses}>
                            {day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WorkoutCalendar;