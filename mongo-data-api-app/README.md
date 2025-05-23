# 🛠️ Project Configuration Guide

Follow these steps to get the application up and running with MongoDB and Next.js.

---

## 1. 📦 Set Up The MongoDB Database

You have two options for setting up MongoDB:

- **Locally**: Install MongoDB on your machine from the [official website](https://www.mongodb.com/try/download/community).
- **Cloud**: Use [MongoDB Atlas](https://mongodb.com/atlas) for a free, cloud-hosted database.

> 💡 For MongoDB Atlas, after creating a cluster, click the **"Connect"** button to obtain the connection string.

---

## 2. 🗃️ Populate the Database

Once the database is set up:

1. Create **three collections**:
   - `users`
   - `patient`
   - `medical_staff`

2. Import the corresponding `.json` files located in the `fake_data/` folder into each collection. You can use [MongoDB Compass](https://www.mongodb.com/products/compass) or CLI tools like `mongoimport`.

   **Example with `mongoimport` (Be sure to use the connection string `uri` from step 1):**
   ```bash
   mongoimport --uri "your-mongodb-uri" --collection users --type json --file ./fake_data/users.json
   ```

   Repeat this for `patients.json` and `medicalStaff.json`, ensuring they go in the correct collections.

---

## 2.5. ⚡ Create Indexes for Optimal Performance

After importing your data, you can manually add indexes to optimise query performance. You can do this using **MongoDB Compass** or the **MongoDB shell**.

### 👉 Run the following index creation commands:

```js
// 📁 patient collection
db.patient.createIndex({ user_id: 1 }, { unique: true });
db.patient.createIndex({ "appointments.doctor_id": 1, "appointments.date": 1 });
db.patient.createIndex({ "medical_records.record_date": -1 });
db.patient.createIndex({ email: 1 });

// 📁 medical_staff collection
db.medical_staff.createIndex({ user_id: 1 }, { unique: true });
db.medical_staff.createIndex({ specialisation: 1 });
db.medical_staff.createIndex({ availability_start_time: 1 });
db.medical_staff.createIndex({ availability_start_time: 1, availability_end_time: 1 });

// 📁 users collection
db.users.createIndex({ role: 1 });
```

---

## 3. 🔐 Set Up Environment Variables

1. Ensure that `mongo-data-api-app` is your working directory
2. Copy the example environment file:

   ```bash
   cp .env.local.example .env.local
   ```

3. Edit `.env.local` and set the following variable:

- `MONGODB_URI`: Your MongoDB connection string (from step 1).

> 🛑 **Important**: Do not share this file or commit it to version control, since it contains sensitive data.

---

## 4. 🚀 Start the Development Server

1. Ensure that `mongo-data-api-app` is your working directory

2. Install dependencies and start the app using your preferred package manager:

   ```bash
   # Using npm
   npm install
   npm run dev

   # Using yarn
   yarn install
   yarn dev

   # Using pnpm
   pnpm install
   pnpm dev
   ```

---

## 5. ✅ Verify the Setup

Visit [http://localhost:3000](http://localhost:3000) in your browser.

In the top left corner, you should see a connection indicator with either a red or green circle. If it is green, the connection is successful.

---
