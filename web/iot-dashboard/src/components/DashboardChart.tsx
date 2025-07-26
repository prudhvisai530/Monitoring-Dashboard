import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';
import { getSensorData } from '../api/dashboard';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';

interface DataPoint {
  temperature: number;
  humidity: number;
  powerUsage: number;
  createdAt: string;
}

const DashboardChart: React.FC = () => {
  const { token } = useAuth();
  const role = localStorage.getItem('role') ?? '';
  const [data, setData] = useState<DataPoint[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    temperature: "",
    humidity: "",
    powerUsage: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3000/iotMonitor/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          temperature: Number(formData.temperature),
          humidity: Number(formData.humidity),
          powerUsage: Number(formData.powerUsage),
        }),
      });

      if (!response.ok) throw new Error("Failed to add record");

      alert("Record added successfully");
      handleClose();
    } catch (error) {
      console.error(error);
      alert("Error adding record");
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (date?: string) => {
    try {
      // Make sure token is stored at login
      const response = await getSensorData(token, date)
      const fetchedData = selectedDate ? response.data.data.getDataByDate : response.data.data.getData;

      const processedData = [...fetchedData].map((item: any) => ({
        ...item,
        createdAt: new Date(Number(item.createdAt)).toLocaleString(), // Or use toISOString()
      })).sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      setData(processedData);
    } catch (error) {
      setData([])
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchData(selectedDate || undefined);
  }, [selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.value;
    setSelectedDate(selected || null);
  };


  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Historical Sensor Data</Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
          <Box display="flex" alignItems="center">
            <Typography variant="body1" component="label" sx={{ mr: 1 }}>
              Select Date:
            </Typography>
            <input
              type="date"
              onChange={handleDateChange}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </Box>

          {role === "admin" && (
            <Button variant="contained" onClick={handleOpen}>
              Add Record
            </Button>
          )}
        </Box>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Record</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Temperature"
            name="temperature"
            type="number"
            fullWidth
            value={formData.temperature}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Humidity"
            name="humidity"
            type="number"
            fullWidth
            value={formData.humidity}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Power Usage"
            name="powerUsage"
            type="number"
            fullWidth
            value={formData.powerUsage}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!formData.powerUsage || !formData.humidity || !formData.temperature}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {data.length === 0 ? (
        <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="subtitle1" color="textSecondary">
            No data available for the selected date.
          </Typography>
          {/* Or use this if you prefer alert:
        <Alert severity="info">No data available for the selected date.</Alert>
        */}
        </Box>
      ) : (
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="createdAt" tickFormatter={(tick) => new Date(tick).toLocaleTimeString()} />
            <YAxis />
            <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} />
            <Legend />
            <Line type="monotone" dataKey="temperature" stroke="#ff7300" name="Temperature (°C)" />
            <Line type="monotone" dataKey="humidity" stroke="#387908" name="Humidity (%)" />
            <Line type="monotone" dataKey="powerUsage" stroke="#8884d8" name="Power Usage (W)" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
}

export default DashboardChart;
