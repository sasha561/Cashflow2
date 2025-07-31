import React, { useState } from 'react';
import { PersonalInfo } from '../App';
import Input from './Input';

interface SetupProps {
    onComplete: (data: PersonalInfo) => void;
}

interface FormField {
    id: keyof PersonalInfo;
    label: string;
    type: 'text' | 'number';
    required: boolean;
}

const formFields: FormField[] = [
    { id: 'name', label: 'Ім\'я', type: 'text', required: true },
    { id: 'profession', label: 'Початкова Професія', type: 'text', required: true },
    { id: 'goal', label: 'Ціль', type: 'text', required: false },
    { id: 'maritalStatus', label: 'Сімейний Стан', type: 'text', required: false },
    { id: 'childrenInfo', label: 'Діти', type: 'text', required: false },
];

const Setup: React.FC<SetupProps> = ({ onComplete }) => {
    const [data, setData] = useState<PersonalInfo>({
        name: '',
        profession: '',
        goal: '',
        maritalStatus: '',
        childrenInfo: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onComplete(data);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8 space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-center text-slate-800 tracking-widest uppercase">Більше ніж Cashflow</h1>
            <p className="text-center text-gray-600 pb-2">Для початку, введіть вашу особисту інформацію.</p>

            <div className="space-y-4">
                {formFields.map(field => (
                    <div key={field.id} className="flex flex-col space-y-1">
                        <label htmlFor={field.id} className="font-semibold text-gray-700">{field.label}</label>
                        <Input
                            id={field.id}
                            name={field.id}
                            value={data[field.id]}
                            onChange={handleChange}
                            type={field.type}
                            required={field.required}
                        />
                    </div>
                ))}
            </div>

            <button
                type="submit"
                className="w-full bg-yellow-400 text-slate-800 font-bold py-3 px-4 rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-300 text-lg uppercase shadow-lg hover:shadow-xl"
            >
                Почати
            </button>
        </form>
    );
};

export default Setup;