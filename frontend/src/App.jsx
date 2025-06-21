import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from '../components/Layout/Navbar';
import Patients from '../pages/Patients';
import Prescriptions from '../pages/Prescriptions';
import PrescriptionForm from '../components/prescriptions/PrescriptionForm'; // 👈 thêm dòng này
import Invoices from '../pages/Invoices'
import InvoiceForm from '../components/invoices/InvoiceForm';
import Drugs from '../pages/Drugs';
import Stock from '../pages/StockEntryList';
import Reports from '../pages/Reports';
function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Patients />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/prescriptions" element={<Prescriptions />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/drugs" element={<Drugs />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/prescriptions/new/:patientId" element={<PrescriptionForm />} />
          <Route path="/prescriptions/create" element={<PrescriptionForm />} />
          <Route path="/prescriptions/create/:MaBenhNhan" element={<PrescriptionForm />} />
          <Route path="/invoices/create/:MaPhieuKham" element={<InvoiceForm />} />
          <Route path="/invoices/create" element={<InvoiceForm />} />
          <Route path="/prescriptions/edit/:MaPhieuKham" element={<PrescriptionForm />} />
          <Route path="/invoices/edit/:MaHoaDon" element={<InvoiceForm />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
