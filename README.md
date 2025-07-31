<<<<<<< HEAD
Perfect! Since your MongoDB version is installed at:

```
C:\Program Files\MongoDB\Server\8.0\bin
```

Let’s get Prisma working by running MongoDB in **replica set mode** using this path.

---

## ✅ Step-by-Step Fix (Using v8.0)

### ✅ 1. Create Data Folder

Open Command Prompt and run:

```bash
mkdir C:\data\db
```

This creates the folder MongoDB uses to store data.

---

### ✅ 2. Start MongoDB in Replica Set Mode

Now start the MongoDB server manually:

```bash
"C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath "C:\data\db" --replSet rs0
```

If successful, you’ll see logs like:

```
Waiting for connections...
```

**Keep this window open** – it runs your MongoDB server.

---

### ✅ 3. Open a New Terminal to Initialize Replica Set

In a second **Command Prompt**, run the shell:

```bash
"C:\Program Files\MongoDB\Server\8.0\bin\mongosh.exe"
```

Then run this command inside `mongosh`:

```js
rs.initiate()
```

You should see:

```json
{ ok: 1 }
```

✅ Your MongoDB is now running as a replica set!

---

### ✅ 4. Run Your Prisma App

Now Prisma will be able to run `create`, `update`, and `transaction` operations without error.

Make sure your `.env` has:

```env
DATABASE_URL="mongodb://127.0.0.1:27017/collabtube"
```

Then restart your Next.js dev server:

```bash
npm run dev
```

---

## ✅ Optional: Make This Persistent

If you want MongoDB to **always** start as a replica set on Windows boot, I can guide you to set up a Windows **Service** that starts `mongod.exe` with a config file. Let me know.

---

Let me know once you’ve completed this and I’ll help you with the next steps (e.g., test with `prisma.user.create()`, or setup seed script).

1. "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath "C:\data\db" --replSet rs0

2. docker run -p 2181:2181 zookeeper

3. docker run -p 9092:9092 -e KAFKA_ZOOKEEPER_CONNECT=192.168.29.126:2181 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://192.168.29.126:9092 -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 confluentinc/cp-kafka
=======
# ColabTube
>>>>>>> 82253dd03adeeff3e49994f7b2bc9080f43fd7ff
