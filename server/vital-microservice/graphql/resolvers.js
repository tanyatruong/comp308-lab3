const VitalSign = require('../models/VitalSign');

const resolvers = {
  Query: {
    vitalSigns: async (_, __, { user }) => {
      // Check if user is authenticated
      if (!user) throw new Error('Authentication required');
      
      try {
        // Fetch all vital signs for the authenticated user
        return await VitalSign.find({ userId: user.id })
          .sort({ createdAt: -1 });
      } catch (error) {
        throw new Error(`Failed to fetch vital signs: ${error.message}`);
      }
    },
    
    vitalSign: async (_, { id }, { user }) => {
      // Check if user is authenticated
      if (!user) throw new Error('Authentication required');
      
      try {
        // Find a specific vital sign record by ID
        const vitalSign = await VitalSign.findById(id);
        
        // Check if record exists and belongs to the authenticated user
        if (!vitalSign) throw new Error('Vital sign record not found');
        if (vitalSign.userId.toString() !== user.id) throw new Error('Not authorized');
        
        return vitalSign;
      } catch (error) {
        throw new Error(`Failed to fetch vital sign: ${error.message}`);
      }
    },
    
    myLatestVitalSigns: async (_, __, { user }) => {
      // Check if user is authenticated
      if (!user) throw new Error('Authentication required');
      
      try {
        // Fetch the latest vital signs for the authenticated user (limited to 5)
        return await VitalSign.find({ userId: user.id })
          .sort({ createdAt: -1 })
          .limit(5);
      } catch (error) {
        throw new Error(`Failed to fetch latest vital signs: ${error.message}`);
      }
    }
  },
  
  Mutation: {
    createVitalSign: async (_, { input }, { user }) => {
      // Check if user is authenticated
      if (!user) throw new Error('Authentication required');
      
      try {
        // Create new vital sign record
        const newVitalSign = new VitalSign({
          userId: user.id,
          ...input
        });
        
        // Save to database
        await newVitalSign.save();
        return newVitalSign;
      } catch (error) {
        throw new Error(`Failed to create vital sign: ${error.message}`);
      }
    },
    
    updateVitalSign: async (_, { id, input }, { user }) => {
      // Check if user is authenticated
      if (!user) throw new Error('Authentication required');
      
      try {
        // Find the vital sign record
        const vitalSign = await VitalSign.findById(id);
        
        // Check if record exists and belongs to the authenticated user
        if (!vitalSign) throw new Error('Vital sign record not found');
        if (vitalSign.userId.toString() !== user.id) throw new Error('Not authorized');
        
        // Update the record
        Object.keys(input).forEach(key => {
          vitalSign[key] = input[key];
        });
        
        // Save changes
        await vitalSign.save();
        return vitalSign;
      } catch (error) {
        throw new Error(`Failed to update vital sign: ${error.message}`);
      }
    },
    
    deleteVitalSign: async (_, { id }, { user }) => {
      // Check if user is authenticated
      if (!user) throw new Error('Authentication required');
      
      try {
        // Find the vital sign record
        const vitalSign = await VitalSign.findById(id);
        
        // Check if record exists and belongs to the authenticated user
        if (!vitalSign) throw new Error('Vital sign record not found');
        if (vitalSign.userId.toString() !== user.id) throw new Error('Not authorized');
        
        // Delete the record
        await VitalSign.findByIdAndDelete(id);
        return true;
      } catch (error) {
        throw new Error(`Failed to delete vital sign: ${error.message}`);
      }
    }
  }
};

module.exports = resolvers;