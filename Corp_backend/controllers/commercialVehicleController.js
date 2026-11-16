const CommercialVehicle = require('../models/CommercialVehicle');

// Get all vehicles
const getVehicles = async (req, res) => {
  try {
    const { featured } = req.query;
    const query = featured === 'true' ? { isFeatured: true } : {};
    
    const vehicles = await CommercialVehicle.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single vehicle
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await CommercialVehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create vehicle (Admin)
const createVehicle = async (req, res) => {
  try {
    const vehicle = await CommercialVehicle.create(req.body);
    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update vehicle (Admin)
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await CommercialVehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.json({ success: true, data: vehicle });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete vehicle (Admin)
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await CommercialVehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.json({ success: true, message: 'Vehicle deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
};
