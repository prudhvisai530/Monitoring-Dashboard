import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';
import { getSensorData } from '../api/dashboard';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import io, { Socket } from 'socket.io-client';

interface DataPoint {
  temperature: number;
  humidity: number;
  powerUsage: number;
  createdAt: string;
}

const socket: Socket = io('http://localhost:3000');

const DashboardChart: React.FC = () => {
  const role = sessionStorage.getItem('role')
  const { token } = useAuth();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      fetchData(selectedDate || undefined); // Refresh data
    } catch (error) {
      console.error(error);
      alert("Error adding record");
    }
  };

  const fetchData = async (date?: string) => {
    try {
      const response = await getSensorData(token, date);
      const fetchedData = selectedDate
        ? response.data.data.getDataByDate
        : response.data.data.getData;

      const processedData = [...fetchedData].map((item: any) => ({
        ...item,
        createdAt: isNaN(Number(item.createdAt))
          ? item.createdAt
          : new Date(Number(item.createdAt)).toISOString(),
      }));

      setData(processedData);
    } catch (error) {
      setData([]);
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchData(selectedDate || undefined);
  }, [selectedDate]);

  useEffect(() => {
    socket.on('iotData', (newData: DataPoint) => {
      setData(prev => [
        ...prev,
        {
          ...newData,
          createdAt: isNaN(Number(newData.createdAt))
            ? newData.createdAt
            : new Date(Number(newData.createdAt)).toISOString(),
        },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.value;
    setSelectedDate(selected || null);
  };

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Historical Sensor Data</Typography>
        <Box display="flex" alignItems="center" gap={2}>
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

      <Dialog open={open} onClose={(event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          handleClose();
        }
      }}>
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
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.temperature || !formData.humidity || !formData.powerUsage}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {data.length === 0 ? (
        <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="subtitle1" color="textSecondary">
            No data available for the selected date.
          </Typography>
        </Box>
      ) : (
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid stroke="#ccc" />
            <XAxis
              dataKey="createdAt"
              tickFormatter={(tick) => new Date(tick).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(label) =>
                new Date(label).toLocaleString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })
              }
            />
            <Legend />
            <Line type="monotone" dataKey="temperature" stroke="#ff7300" name="Temperature (°C)" />
            <Line type="monotone" dataKey="humidity" stroke="#387908" name="Humidity (%)" />
            <Line type="monotone" dataKey="powerUsage" stroke="#8884d8" name="Power Usage (W)" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default DashboardChart;
