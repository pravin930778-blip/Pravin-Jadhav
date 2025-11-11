import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { v4 as uuidv4 } from 'uuid';
import { FoodItem } from '../types';

interface CameraModalProps {
    onClose: () => void;
    onAddFoods: (foods: FoodItem[]) => void;
}

const foodItemSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: 'Name of the food item' },
        calories: { type: Type.NUMBER, description: 'Estimated calories' },
        protein: { type: Type.NUMBER, description: 'Estimated protein in grams' },
        carbs: { type: Type.NUMBER, description: 'Estimated carbohydrates in grams' },
        fat: { type: Type.NUMBER, description: 'Estimated fat in grams' },
    },
    required: ['name', 'calories', 'protein', 'carbs', 'fat'],
};

const CameraModal: React.FC<CameraModalProps> = ({ onClose, onAddFoods }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<FoodItem[] | null>(null);

    const startCamera = useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Camera access denied:", err);
            setError("Camera access is required. Please enable it in your browser settings.");
        }
    }, []);

    useEffect(() => {
        startCamera();
        return () => {
            stream?.getTracks().forEach(track => track.stop());
        };
    }, [startCamera]);

    const analyzeImage = async (base64Data: string) => {
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: {
                    parts: [
                        { text: "Analyze this image of a meal. Identify the food items and estimate their nutritional information (calories, protein, carbs, fat). Return a JSON array of the identified food items. If no food is detected, return an empty array." },
                        { inlineData: { mimeType: 'image/jpeg', data: base64Data } }
                    ]
                },
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.ARRAY,
                        items: foodItemSchema,
                    },
                },
            });

            const parsedResult = JSON.parse(response.text);
            const foodItemsWithIds = parsedResult.map((item: Omit<FoodItem, 'id'>) => ({
                ...item,
                id: uuidv4(),
            }));

            setAnalysisResult(foodItemsWithIds);

        } catch (err) {
            console.error("Error analyzing image:", err);
            setError("Could not analyze image. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setCapturedImage(dataUrl);
            stream?.getTracks().forEach(track => track.stop()); // Stop camera after capture
            setStream(null);
            analyzeImage(dataUrl.split(',')[1]); // Send base64 data without prefix
        }
    };
    
    const handleAddSelected = () => {
        if(analysisResult) {
            onAddFoods(analysisResult);
        }
    }

    const renderContent = () => {
        if (error) {
            return (
                <div className="text-center p-4">
                    <p className="text-red-400 font-semibold mb-4">{error}</p>
                    <button onClick={onClose} className="w-full bg-brand-primary text-white font-bold py-2 rounded-lg">Close</button>
                </div>
            );
        }
        
        if (isLoading) {
             return (
                <div className="text-center p-8 flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mb-4"></div>
                    <p className="text-white font-semibold">Analyzing your meal...</p>
                    <p className="text-brand-text-secondary text-sm">This may take a moment.</p>
                </div>
            )
        }
        
        if (analysisResult) {
            return (
                <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2">Analysis Complete</h3>
                    {analysisResult.length > 0 ? (
                        <>
                            <p className="text-brand-text-secondary text-sm mb-4">We found the following items. Add them to your log.</p>
                            <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
                                {analysisResult.map(item => (
                                    <div key={item.id} className="bg-white/5 p-2 rounded-lg text-sm">
                                        <p className="font-semibold text-white">{item.name}</p>
                                        <p className="text-brand-text-secondary">{Math.round(item.calories)} kcal &bull; {Math.round(item.protein)}g Protein</p>
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleAddSelected} className="w-full bg-brand-primary text-white font-bold py-2 rounded-lg">Add to Meal</button>
                        </>
                    ) : (
                        <p className="text-brand-text-secondary text-center p-4">Could not identify any food items in the image. Please try again.</p>
                    )}
                    <button onClick={() => { setCapturedImage(null); setAnalysisResult(null); startCamera(); }} className="w-full text-center text-brand-text-secondary mt-2 py-2">
                        Retake Photo
                    </button>
                </div>
            )
        }

        return (
            <div className="relative">
                <video ref={videoRef} autoPlay playsInline className="w-full rounded-t-2xl" />
                <button
                    onClick={handleCapture}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-brand-primary/50"
                    aria-label="Capture photo"
                ></button>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-brand-surface w-full max-w-sm rounded-2xl flex flex-col relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-white bg-black/30 rounded-full w-8 h-8 flex items-center justify-center z-10">&times;</button>
                {renderContent()}
                <canvas ref={canvasRef} className="hidden"></canvas>
            </div>
        </div>
    );
};

export default CameraModal;
