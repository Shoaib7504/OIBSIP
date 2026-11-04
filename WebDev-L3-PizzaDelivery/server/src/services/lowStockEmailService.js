import Inventory from "../models/Inventory.js";
import User from "../models/User.js";
import transporter from "../config/email.js";

export const sendLowStockAlerts = async () => {
  // Reset alert status when stock goes above threshold
  await Inventory.updateMany(
    {
      lowStockAlertSent: true,
      $expr: {
        $gt: ["$stock", "$threshold"],
      },
    },
    {
      $set: { lowStockAlertSent: false },
    }
  );

  // Find items that need a new alert
  const lowStockItems = await Inventory.find({
    lowStockAlertSent: false,
    $expr: {
      $lte: ["$stock", "$threshold"],
    },
  });

  if (lowStockItems.length === 0) {
    console.log("No new low-stock alerts.");
    return;
  }

  const admins = await User.find({
    role: "admin",
  }).select("email");

  if (admins.length === 0) {
    console.log("No admin accounts found.");
    return;
  }

  const itemList = lowStockItems
    .map(
      (item) =>
        `<li>
          <strong>${item.name}</strong> (${item.category}) -
          Stock: ${item.stock} ${item.unit},
          Threshold: ${item.threshold} ${item.unit}
        </li>`
    )
    .join("");

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: admins.map((admin) => admin.email).join(","),
    subject: `Low Stock Alert - ${lowStockItems.length} Item(s)`,
    html: `
      <h2>Low Stock Inventory Alert</h2>
      <p>The following items need restocking:</p>
      <ul>${itemList}</ul>
    `,
  });

  // Mark items only after successful email delivery request
  await Inventory.updateMany(
    {
      _id: {
        $in: lowStockItems.map((item) => item._id),
      },
    },
    {
      $set: { lowStockAlertSent: true },
    }
  );

  console.log(
    `Low-stock alert sent for ${lowStockItems.length} item(s).`
  );
};