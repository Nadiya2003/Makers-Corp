const Auction = require('../models/Auction');

const getAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find().sort({ date: 1 });
    res.json({ success: true, data: auctions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createAuction = async (req, res) => {
  try {
    const auction = await Auction.create(req.body);
    res.status(201).json({ success: true, data: auction });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateAuction = async (req, res) => {
  try {
    const auction = await Auction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!auction) {
      return res.status(404).json({ success: false, message: 'Auction not found' });
    }
    res.json({ success: true, data: auction });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteAuction = async (req, res) => {
  try {
    const auction = await Auction.findByIdAndDelete(req.params.id);
    if (!auction) {
      return res.status(404).json({ success: false, message: 'Auction not found' });
    }
    res.json({ success: true, message: 'Auction deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAuctions, createAuction, updateAuction, deleteAuction };
