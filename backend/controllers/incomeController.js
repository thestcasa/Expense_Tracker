const User = require('../models/User');
const xlsx = require('xlsx');
const Income = require('../models/Income');


exports.addIncome = async (req, res) => {
    const userId = req.user.id;
    
    try{
        const { icon, source, amount, date } = req.body;
        
        if (!source || !amount || !date) {
            return res.status(400).json({ message: "Please provide all fields" });
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date : new Date(date),
        })

        await newIncome.save();
        res.status(201).json(newIncome);
    }catch(error){
        res.status(500).json({ message: "Server error", error: error.message
        });
    }
}

exports.getAllIncome = async (req, res) => {
    const userId = req.user.id;
    try{
        const income = await Income.find({ userId }).sort({ date: -1 });
        res.status(200).json(income);
    }catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

exports.deleteIncome = async (req, res) => {
    const userId = req.user.id;
    
    try{
        await Income.findOneAndDelete(req.params.id);
        res.json({ message: "Income deleted" });

    }catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;
    try{
        const income = await Income.find({ userId }).sort({ date: -1 });
        
        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date.toDateString(),
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");
        xlsx.writeFile(wb, "income_details.xlsx");
        res.download("income_details.xlsx");
    
    }catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
    
};