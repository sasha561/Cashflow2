import React, { useState, useMemo, useCallback } from 'react';
import { BudgetState } from './types';
import Input from './components/Input';
import SectionTitle from './components/SectionTitle';
import Setup from './components/Setup';

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

const LabeledInputRow: React.FC<{
    label: string;
    id: keyof BudgetState;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: 'text' | 'number';
}> = ({ label, id, value, onChange, type = 'text' }) => (
    <div className="flex items-center">
        <label htmlFor={id} className={`bg-slate-800 text-white text-sm font-semibold p-2 rounded-l-md flex-grow`}>
            {label}
        </label>
        <div>
            <Input id={id} name={id} value={value} onChange={onChange} type={type} className="rounded-l-none" />
        </div>
    </div>
);

const ExpenseRow: React.FC<{
    num: string;
    label: string;
    id: keyof BudgetState;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ num, label, id, value, onChange }) => (
    <div className="flex items-center space-x-2">
        <div className="bg-slate-700 text-white font-bold rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">{num}</div>
        <label htmlFor={id} className="bg-slate-600 text-white text-sm font-semibold p-2 rounded-md flex-grow">{label}</label>
        <div className="w-24 flex-shrink-0">
            <Input id={id} name={id} value={value} onChange={onChange} type="number" />
        </div>
    </div>
);

export type PersonalInfo = Pick<BudgetState, 'name' | 'profession' | 'goal' | 'maritalStatus' | 'childrenInfo'>;

const App: React.FC = () => {
    const [view, setView] = useState<'setup' | 'calculator'>('setup');
    const [state, setState] = useState<BudgetState>({
        name: '', profession: '', startingCashflow: '', goal: '', maritalStatus: '', childrenInfo: '',
        salary: '',
        businessIntellectual: ['', '', ''],
        businessClassic: ['', '', ''],
        businessFranchise: ['', '', ''],
        rentIncome: ['', '', ''],
        dividends: ['', '', ''],
        utilities: '', food: '', wardrobe: '', transport: '', mobile: '', trainings: '', leasing: '', mortgage: '', education: '', childrenExpense: '', love: '', otherExpense: '',
        creditLimit: '', creditTaken: '', creditPayment: '',
        smallNotes: '', carBuyout: '', mortgagePayments: '',
    });

    const handleSetupComplete = (data: PersonalInfo) => {
        setState(prevState => ({
            ...prevState,
            ...data,
        }));
        setView('calculator');
    };

    const parseNum = (val: string) => parseFloat(val) || 0;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'creditTaken') {
            const payment = parseNum(value) * 0.10;
            setState(prevState => ({
                ...prevState,
                creditTaken: value,
                creditPayment: String(Math.round(payment)),
            }));
        } else {
            setState(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleIncomeArrayChange = useCallback((field: keyof BudgetState, index: number, value: string) => {
        setState(prevState => {
            const currentField = prevState[field];
            if (Array.isArray(currentField)) {
                const newValues = [...currentField];
                newValues[index] = value;
                return {
                    ...prevState,
                    [field]: newValues,
                };
            }
            return prevState;
        });
    }, []);

    const totalIncome = useMemo(() => {
        const singleIncomes = parseNum(state.salary);
        const arrayIncomes = ['businessIntellectual', 'businessClassic', 'businessFranchise', 'rentIncome', 'dividends']
            .reduce((total, key) => {
                const fieldValues = state[key as keyof BudgetState];
                if(Array.isArray(fieldValues)) {
                    return total + fieldValues.reduce((sum, val) => sum + parseNum(val), 0);
                }
                return total;
            }, 0);
        return singleIncomes + arrayIncomes;
    }, [state]);

    const baseExpenses = useMemo(() => {
        return Object.entries(state)
            .filter(([key]) => ['utilities', 'food', 'wardrobe', 'transport', 'mobile', 'trainings', 'leasing', 'mortgage', 'education', 'childrenExpense', 'love', 'otherExpense'].includes(key))
            .reduce((sum, [, value]) => sum + parseNum(value as string), 0);
    }, [state]);

    const totalExpenses = useMemo(() => baseExpenses + parseNum(state.creditPayment), [baseExpenses, state.creditPayment]);

    const cashflow = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);

    return (
        <div className="bg-[#e2e8f0] min-h-screen p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            {view === 'setup' ? (
                <Setup onComplete={handleSetupComplete} />
            ) : (
                <main className="w-full max-w-5xl bg-white shadow-2xl rounded-2xl p-6 lg:p-8 mx-auto flex flex-col space-y-6">
                    <h1 className="text-3xl font-bold text-center text-slate-800 tracking-widest uppercase">Більше ніж Cashflow</h1>

                    {/* Personal Info */}
                    <div className="bg-yellow-50 p-4 rounded-lg shadow-inner border border-yellow-200">
                        <div className="flex items-center space-x-4">
                           <div className="flex-shrink-0 p-2 bg-white rounded-full shadow"><UserIcon/></div>
                           <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-2">
                             <LabeledInputRow label="Ім'я" id="name" value={state.name} onChange={handleInputChange} />
                             <LabeledInputRow label="Початкова Професія" id="profession" value={state.profession} onChange={handleInputChange}/>
                             <LabeledInputRow label="Стартовий Кешфлоу" id="startingCashflow" value={state.startingCashflow} onChange={handleInputChange} type="number" />
                           </div>
                        </div>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <LabeledInputRow label="Ціль" id="goal" value={state.goal} onChange={handleInputChange}/>
                            <LabeledInputRow label="Сімейний Стан" id="maritalStatus" value={state.maritalStatus} onChange={handleInputChange} />
                            <LabeledInputRow label="Діти" id="childrenInfo" value={state.childrenInfo} onChange={handleInputChange} />
                        </div>
                    </div>
                    
                    {/* Income */}
                    <div className="space-y-2">
                       <SectionTitle title="Доходи" total={totalIncome} />
                       <div className="flex items-center">
                            <label htmlFor="salary" className="bg-slate-700 text-white text-sm font-semibold p-2 rounded-l-md w-1/2">Заробітна плата</label>
                            <div className="w-1/2">
                               <Input id="salary" name="salary" value={state.salary} onChange={handleInputChange} type="number" className="rounded-l-none" />
                            </div>
                       </div>
                        {([
                            {label: 'Бізнес - інтелектуальна власність', field: 'businessIntellectual'},
                            {label: 'Бізнес - класичний', field: 'businessClassic'},
                            {label: 'Бізнес - франшиза', field: 'businessFranchise'},
                            {label: 'Оренда', field: 'rentIncome'},
                            {label: 'Дивіденди від акцій', field: 'dividends'},
                        ] as const).map(({label, field}) => (
                            <div key={field} className="flex items-center">
                                <label className="bg-slate-700 text-white text-sm font-semibold p-2 rounded-l-md w-1/2 flex items-center h-full">{label}</label>
                                <div className="w-1/2 flex space-x-1 p-[2px] rounded-r-md border border-l-0 border-gray-300">
                                    {state[field].map((val, index) => (
                                        <Input
                                            key={index}
                                            id={`${field}-${index}`}
                                            name={`${field}-${index}`}
                                            value={val}
                                            onChange={(e) => handleIncomeArrayChange(field, index, e.target.value)}
                                            type="number"
                                            className="w-1/3"
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Expenses */}
                        <div className="space-y-2">
                            <SectionTitle title="Витрати" total={baseExpenses} />
                            <ExpenseRow num="01" label="оплата комунальних / оренда квартири" id="utilities" value={state.utilities} onChange={handleInputChange} />
                            <ExpenseRow num="02" label="харчування" id="food" value={state.food} onChange={handleInputChange} />
                            <ExpenseRow num="03" label="оновлення гардероба" id="wardrobe" value={state.wardrobe} onChange={handleInputChange} />
                            <ExpenseRow num="04" label="на громадський транспорт / на бензин" id="transport" value={state.transport} onChange={handleInputChange} />
                            <ExpenseRow num="05" label="на поповнення мобільного" id="mobile" value={state.mobile} onChange={handleInputChange} />
                            <ExpenseRow num="06" label="тренінги" id="trainings" value={state.trainings} onChange={handleInputChange} />
                            <ExpenseRow num="07" label="ЛІЗИНГ (оренда машини) %" id="leasing" value={state.leasing} onChange={handleInputChange} />
                            <ExpenseRow num="08" label="ІПОТЕКА (кредит на квартиру) %" id="mortgage" value={state.mortgage} onChange={handleInputChange} />
                            <ExpenseRow num="09" label="навчання" id="education" value={state.education} onChange={handleInputChange} />
                            <ExpenseRow num="10" label="діти" id="childrenExpense" value={state.childrenExpense} onChange={handleInputChange} />
                            <ExpenseRow num="11" label="любов/ шлюб" id="love" value={state.love} onChange={handleInputChange} />
                            <ExpenseRow num="12" label="інше" id="otherExpense" value={state.otherExpense} onChange={handleInputChange} />
                        </div>

                        {/* Credit & Notes */}
                        <div className="flex flex-col space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg shadow-inner space-y-4 flex-grow flex flex-col">
                               <div className="flex items-center space-x-2">
                                    <label htmlFor="creditLimit" className="w-1/2 text-sm font-semibold text-gray-600 uppercase">Кредитний ліміт</label>
                                    <Input id="creditLimit" name="creditLimit" value={state.creditLimit} onChange={handleInputChange} type="number" />
                               </div>
                               <div className="flex items-center space-x-2">
                                    <label htmlFor="creditTaken" className="w-1/2 bg-slate-700 text-white text-sm font-semibold p-2 rounded-l-md">кредит, що взято</label>
                                    <Input id="creditTaken" name="creditTaken" value={state.creditTaken} onChange={handleInputChange} type="number" className="rounded-l-none rounded-r-none" />
                                    <div className="flex items-center bg-gray-200 border border-gray-300 rounded-r-md">
                                       <span className="px-3 text-gray-600">10%</span>
                                       <Input id="creditPayment" name="creditPayment" value={state.creditPayment} onChange={handleInputChange} type="number" className="w-24 rounded-none rounded-r-md border-l-0" />
                                    </div>
                               </div>
                               <div className="flex-grow flex flex-col">
                                    <label htmlFor="smallNotes" className="text-sm font-semibold text-gray-600 mb-1 block">місце для дрібних записів</label>
                                    <textarea id="smallNotes" name="smallNotes" value={state.smallNotes} onChange={handleInputChange} className="w-full bg-white border border-gray-300 rounded-md p-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none flex-grow"></textarea>
                               </div>
                               <div className="flex items-center space-x-2">
                                   <label htmlFor="carBuyout" className="text-sm font-semibold text-gray-600 flex-grow">машину, згідно з договором, можна викупити за</label>
                                   <div className="w-1/3">
                                       <Input id="carBuyout" name="carBuyout" value={state.carBuyout} onChange={handleInputChange} type="number"/>
                                   </div>
                               </div>
                               <div className="flex items-center space-x-2">
                                   <label htmlFor="mortgagePayments" className="text-sm font-semibold text-gray-600 flex-grow">кількість платежів, згідно з договором іпотеки</label>
                                   <div className="w-1/3">
                                        <Input id="mortgagePayments" name="mortgagePayments" value={state.mortgagePayments} onChange={handleInputChange} type="number"/>
                                   </div>
                               </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                     <div className="space-y-2 pt-4 border-t-2 border-gray-300">
                        <div className="flex justify-between items-center border border-gray-400 p-3 rounded-lg">
                            <span className="text-xl font-bold text-slate-700">ДОХОДИ</span>
                            <span className="text-2xl font-mono font-extrabold text-green-600">{totalIncome.toLocaleString('uk-UA')}</span>
                        </div>
                        <div className="flex justify-between items-center border border-gray-400 p-3 rounded-lg">
                            <span className="text-xl font-bold text-slate-700">ВИТРАТИ</span>
                            <span className="text-2xl font-mono font-extrabold text-red-600">{totalExpenses.toLocaleString('uk-UA')}</span>
                        </div>
                         <div className="flex justify-between items-center border-2 border-yellow-500 text-slate-800 p-4 rounded-lg">
                            <span className="text-xl font-bold">КЕШФЛОУ</span>
                            <span className="text-2xl font-mono font-extrabold">{cashflow.toLocaleString('uk-UA')}</span>
                        </div>
                    </div>
                </main>
            )}
        </div>
    );
};

export default App;