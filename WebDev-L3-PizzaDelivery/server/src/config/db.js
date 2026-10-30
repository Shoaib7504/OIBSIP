// import mongoose from "mongoose";
// import dns from "dns";

// // use google dns to fix SRV lookup issues on some networks
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI, {
//       serverSelectionTimeoutMS: 10000,
//     });
//     console.log(`MongoDB connected: ${conn.connection.host}`);
//   } catch (err) {
//     console.error("MongoDB connection failed:", err.message);
//     process.exit(1);
//   }
// };

// export default connectDB;


import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected");
    }catch(error){
        console.error(error);
        process.exit(1);
    }
}

export default connectDB;