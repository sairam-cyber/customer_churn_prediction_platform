import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardData, getChurnFactors, getSegmentationData } from '../services/api';
import KPICard from '../components/dashboard/KPICard';
import HighRiskTable from '../components/dashboard/HighRiskTable';
import Loader from '../components/common/Loader';
import ErrorDisplay from '../components/common/ErrorDisplay';
import ChurnFactorsChart from '../components/dashboard/ChurnFactorsChart';
import CustomerSegmentationChart from '../components/dashboard/CustomerSegmentationChart';
import './Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [churnFactors, setChurnFactors] = useState([]);
  const [segmentationData, setSegmentationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [dashboardResponse, factorsResponse, segmentationResponse] = await Promise.all([
            getDashboardData(),
            getChurnFactors(),
            getSegmentationData()
        ]);
        
        if (dashboardResponse && dashboardResponse.data && typeof dashboardResponse.data === 'object') {
          setData(dashboardResponse.data);
        } else {
          throw new Error("Received invalid dashboard data format from server.");
        }
        
        if (factorsResponse && factorsResponse.data) {
            const factors = Object.entries(factorsResponse.data.churnFactors).map(([name, value]) => ({ name, value }));
            setChurnFactors(factors);
        }

        if(segmentationResponse && segmentationResponse.data){
            const segments = Object.entries(segmentationResponse.data.segmentation).map(([name, value]) => ({ name, value }));
            setSegmentationData(segments);
        }

      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Failed to fetch dashboard data. Please try again later.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewDetails = (customer) => {
    navigate('/predictor', { state: { customer } });
  };

  if (loading) return <Loader />;
  if (error) return <ErrorDisplay message={error} />;
  
  if (!data || !data.highRiskCustomers) {
    return <ErrorDisplay message="Dashboard data is missing or incomplete." />;
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="kpi-grid">
        <KPICard title="Total Customers" value={data.totalCustomers} />
        <KPICard title="Churned Customers" value={data.churnedCustomers} />
        <KPICard title="Churn Rate" value={`${data.churnRate}%`} />
      </div>
      <div className="dashboard-content-grid">
        <div className="dashboard-section">
            <HighRiskTable 
              customers={data.highRiskCustomers} 
              onViewDetails={handleViewDetails} 
            />
        </div>
        <div className="dashboard-section">
            <ChurnFactorsChart data={churnFactors} />
            <CustomerSegmentationChart data={segmentationData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;