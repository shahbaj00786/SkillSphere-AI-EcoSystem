import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

import Navbar from '../components/common/Navbar.jsx';

import PaymentHeader from './payment/PaymentHeader.jsx';
import FreelancerStats from './payment/FreelancerStats.jsx';
import PaymentConfirm from './payment/PaymentConfirm.jsx';
import TransactionHistory from './payment/TransactionHistory.jsx';

import '../styles/payment.css';
import '../styles/payment.css';

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [payData, setPayData] = useState(null);

  const [searchParams] = useSearchParams();

  const token = localStorage.getItem('accessToken');
  const userRole =
    localStorage.getItem('userRole') || 'freelancer';

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const gigId = searchParams.get('gigId');
    const proposalId = searchParams.get('proposalId');
    const freelancerId = searchParams.get('freelancerId');
    const amount = searchParams.get('amount');

    if (gigId) {
      setPayData({
        gigId,
        proposalId,
        freelancerId,
        amount,
      });
    }

    fetchPayments();

    if (userRole === 'freelancer') {
      fetchStats();
    }
  }, []);

  const fetchPayments = async () => {
    setLoading(true);

    try {
      const endpoint =
        userRole === 'freelancer'
          ? 'freelancer/payments'
          : 'client/payments';

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/payments/${endpoint}`,
        { headers }
      );

      setPayments(response.data.data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/payments/freelancer/stats`,
        { headers }
      );

      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching payment stats:', error);
    }
  };

  const submitPayment = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/payments`,
        {
          ...payData,
          paymentMethod,
        },
        { headers }
      );

      setToast(
        '✅ Payment initiated successfully!'
      );

      setPayData(null);

      fetchPayments();
    } catch (error) {
      console.error('Payment error:', error);

      setToast(
        '❌ Payment failed. Please try again.'
      );
    } finally {
      setSubmitting(false);

      setTimeout(() => {
        setToast('');
      }, 3000);
    }
  };

  return (
    <div className="payments-page">
      <Navbar />

      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}

      <div className="payments-container">

        <PaymentHeader />

        {userRole === 'freelancer' && stats && (
          <FreelancerStats stats={stats} />
        )}

        {payData && (
          <PaymentConfirm
            payData={payData}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            submitting={submitting}
            submitPayment={submitPayment}
          />
        )}

        <TransactionHistory
          payments={payments}
          loading={loading}
        />

      </div>
    </div>
  );
};

export default PaymentPage;