const Vehicle = require('../models/Vehicle');

// Get all vehicles with filtering
const getVehicles = async (req, res) => {
  try {
    const { featured, search, make, bodyType, status, limit, category, fuel, fuelType, transmission, year, body, type } = req.query;
    const query = {};

    if (featured === 'true') {
      query.isFeatured = true;
    }
    if (make && make !== 'All Makes') {
      query.$or = [
        { make: { $regex: make, $options: 'i' } },
        { name: { $regex: make, $options: 'i' } }
      ];
    }
    // body / bodyType (accept both param names from different frontend callers)
    const resolvedBodyType = bodyType || body;
    if (resolvedBodyType && resolvedBodyType !== 'All Body Types') {
      query.bodyType = { $regex: resolvedBodyType, $options: 'i' };
    }
    // category
    if (category && category !== 'All') {
      query.category = { $regex: category, $options: 'i' };
    }
    // fuel / fuelType
    const resolvedFuel = fuelType || fuel;
    if (resolvedFuel && resolvedFuel !== 'All') {
      query.fuel = { $regex: resolvedFuel, $options: 'i' };
    }
    // transmission
    if (transmission && transmission !== 'All') {
      query.transmission = { $regex: transmission, $options: 'i' };
    }
    // year
    if (year) {
      query.year = parseInt(year);
    }
    // type maps to category for commercial vehicle filtering
    if (type && type !== 'All') {
      query.$or = query.$or || [];
      query.$or.push(
        { category: { $regex: type, $options: 'i' } },
        { bodyType: { $regex: type, $options: 'i' } }
      );
    }
    if (status) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { stockId: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { modelCode: { $regex: search, $options: 'i' } },
        { make: { $regex: search, $options: 'i' } }
      ];
    }
    
    let dbQuery = Vehicle.find(query).sort({ createdAt: -1 });
    if (limit) {
      dbQuery = dbQuery.limit(parseInt(limit));
    }
    const vehicles = await dbQuery;
    res.json({ success: true, count: vehicles.length, data: vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single vehicle by ID, slug or stockId
const getVehicleById = async (req, res) => {
  try {
    const rawId = req.params.id;
    const id = decodeURIComponent(rawId);
    let vehicle = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      vehicle = await Vehicle.findById(id);
    }
    if (!vehicle) {
      const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      vehicle = await Vehicle.findOne({
        $or: [
          { slug: id },
          { slug: { $regex: `^${escaped}$`, $options: 'i' } },
          { stockId: { $regex: `^${escaped}$`, $options: 'i' } }
        ]
      });
    }

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
    const data = { ...req.body };

    // Auto-compose name from make + model + year if not explicitly provided
    if (!data.name || !data.name.trim()) {
      const parts = [
        data.year,
        data.make,
        data.model,
        data.grade
      ].filter(Boolean);
      data.name = parts.join(' ').trim() || 'Unnamed Vehicle';
    }

    // Map alternate field names from frontend form
    if (data.fobPriceUSD !== undefined && data.priceUSD === undefined) {
      data.priceUSD = data.fobPriceUSD;
    }
    if (data.fuelType && !data.fuel) {
      data.fuel = data.fuelType;
    }

    const vehicle = await Vehicle.create(data);
    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update vehicle (Admin)
const updateVehicle = async (req, res) => {
  try {
    const rawId = req.params.id;
    const id = decodeURIComponent(rawId);
    let vehicle = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      vehicle = await Vehicle.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
      });
    }

    if (!vehicle) {
      const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      vehicle = await Vehicle.findOneAndUpdate(
        {
          $or: [
            { slug: id },
            { slug: { $regex: `^${escaped}$`, $options: 'i' } },
            { stockId: { $regex: `^${escaped}$`, $options: 'i' } }
          ]
        },
        req.body,
        { new: true, runValidators: true }
      );
    }

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
    const rawId = req.params.id;
    const id = decodeURIComponent(rawId);
    let vehicle = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      vehicle = await Vehicle.findByIdAndDelete(id);
    }

    if (!vehicle) {
      const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      vehicle = await Vehicle.findOneAndDelete({
        $or: [
          { slug: id },
          { slug: { $regex: `^${escaped}$`, $options: 'i' } },
          { stockId: { $regex: `^${escaped}$`, $options: 'i' } }
        ]
      });
    }

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
