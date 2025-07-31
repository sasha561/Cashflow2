export interface BudgetState {
  // Personal Info
  name: string;
  profession: string;
  startingCashflow: string;
  goal: string;
  maritalStatus: string;
  childrenInfo: string;

  // Income
  salary: string;
  businessIntellectual: string[];
  businessClassic: string[];
  businessFranchise: string[];
  rentIncome: string[];
  dividends: string[];

  // Expenses
  utilities: string;
  food: string;
  wardrobe: string;
  transport: string;
  mobile: string;
  trainings: string;
  leasing: string;
  mortgage: string;
  education: string;
  childrenExpense: string;
  love: string;
  otherExpense: string;

  // Credit
  creditLimit: string;
  creditTaken: string;
  creditPayment: string;

  // Notes
  smallNotes: string;
  carBuyout: string;
  mortgagePayments: string;
}