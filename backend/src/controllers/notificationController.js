const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const supabaseAdmin = require("../config/supabaseAdmin");

// Data fallback store directory
const DATA_DIR = path.join(__dirname, "../../data");
const NOTIFS_FILE = path.join(DATA_DIR, "notifications.json");

function ensureStore() {
    if (!fs.existsSync(DATA_DIR)) {
        try {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        } catch (e) {
            console.error("Could not create data dir:", e);
        }
    }
    if (!fs.existsSync(NOTIFS_FILE)) {
        try {
            fs.writeFileSync(NOTIFS_FILE, JSON.stringify([]), "utf8");
        } catch (e) {
            console.error("Could not initialize notifications file:", e);
        }
    }
}

function readLocalNotifications() {
    ensureStore();
    try {
        const raw = fs.readFileSync(NOTIFS_FILE, "utf8");
        return JSON.parse(raw || "[]");
    } catch {
        return [];
    }
}

function writeLocalNotifications(notifs) {
    ensureStore();
    try {
        fs.writeFileSync(NOTIFS_FILE, JSON.stringify(notifs, null, 2), "utf8");
    } catch (e) {
        console.error("Failed to write notifications file:", e);
    }
}

function formatLoginTimestamp(date) {
    const d = date ? new Date(date) : new Date();
    try {
        const formatter = new Intl.DateTimeFormat("en-GB", {
            timeZone: "Asia/Kolkata",
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
        const parts = formatter.formatToParts(d);
        const m = {};
        parts.forEach((p) => { m[p.type] = p.value; });
        const hour = m.hour;
        const minute = m.minute;
        const dayPeriod = (m.dayPeriod || "").toUpperCase();
        return `${m.day} ${m.month} ${m.year}, ${hour}:${minute} ${dayPeriod}`;
    } catch {
        return d.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    }
}

async function createLoginNotification({ userId, userName, role, timestamp }) {
    // Deduplication check: if a login notification for this user was created in the last 5 seconds, return it
    const nowMs = Date.now();
    const localNotifs = readLocalNotifications();
    const recent = localNotifs.find(
        (n) => n.user_id === userId && n.type === "login" && Math.abs(nowMs - new Date(n.created_at).getTime()) < 5000
    );
    if (recent) {
        return recent;
    }
    const cleanName = (userName || (role === "teacher" ? "Teacher" : "Student")).trim();
    const isTeacher = role && role.toLowerCase() === "teacher";
    const formattedTime = formatLoginTimestamp(timestamp || new Date());
    
    const message = isTeacher
        ? `Teacher ${cleanName} logged in at ${formattedTime}`
        : `Student ${cleanName} logged in at ${formattedTime}`;

    const newNotification = {
        id: crypto.randomUUID ? crypto.randomUUID() : `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        user_id: userId,
        user_name: cleanName,
        role: isTeacher ? "teacher" : "student",
        title: "Login Successful",
        message,
        type: "login",
        read: false,
        created_at: (timestamp ? new Date(timestamp) : new Date()).toISOString()
    };

    // 1. Attempt Supabase insert if table exists
    let savedInDb = false;
    try {
        const { data, error } = await supabaseAdmin
            .from("notifications")
            .insert([newNotification])
            .select();

        if (!error && data && data.length > 0) {
            savedInDb = true;
            return data[0];
        }
    } catch {
        // Table may not exist yet or connection blocked
    }

    // 2. Persist in fallback cross-session store
    const local = readLocalNotifications();
    local.unshift(newNotification);
    // Keep last 100 notifications
    if (local.length > 100) local.length = 100;
    writeLocalNotifications(local);

    return newNotification;
}

const getNotifications = async (req, res) => {
    try {
        const { user_id, role } = req.query;

        // 1. Try Supabase
        try {
            let query = supabaseAdmin
                .from("notifications")
                .select("*")
                .order("created_at", { ascending: false });

            if (user_id) {
                query = query.eq("user_id", user_id);
            }
            if (role) {
                query = query.eq("role", role);
            }

            const { data, error } = await query;
            if (!error && data) {
                return res.status(200).json({
                    success: true,
                    notifications: data
                });
            }
        } catch {
            // fallback
        }

        // 2. Fallback to local store
        const all = readLocalNotifications();
        const filtered = all.filter((n) => {
            if (user_id && n.user_id !== user_id) return false;
            if (role && n.role !== role) return false;
            return true;
        });

        return res.status(200).json({
            success: true,
            notifications: filtered
        });
    } catch (err) {
        console.error("Get notifications error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch notifications"
        });
    }
};

const addNotification = async (req, res) => {
    try {
        const { user_id, user_name, role, message, type, timestamp } = req.body;

        if (type === "login") {
            const notif = await createLoginNotification({
                userId: user_id,
                userName: user_name,
                role: role,
                timestamp: timestamp || new Date()
            });
            return res.status(201).json({
                success: true,
                notification: notif
            });
        }

        const newNotification = {
            id: crypto.randomUUID ? crypto.randomUUID() : `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            user_id,
            user_name,
            role,
            title: req.body.title || "Notification",
            message: message || "You have a new alert",
            type: type || "info",
            read: false,
            created_at: new Date().toISOString()
        };

        // Try Supabase
        try {
            const { data, error } = await supabaseAdmin
                .from("notifications")
                .insert([newNotification])
                .select();
            if (!error && data && data.length > 0) {
                return res.status(201).json({ success: true, notification: data[0] });
            }
        } catch {}

        // Fallback store
        const local = readLocalNotifications();
        local.unshift(newNotification);
        writeLocalNotifications(local);

        res.status(201).json({
            success: true,
            notification: newNotification
        });
    } catch (err) {
        console.error("Add notification error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to create notification"
        });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        // Try Supabase
        try {
            await supabaseAdmin
                .from("notifications")
                .update({ read: true })
                .eq("id", id);
        } catch {}

        // Local store
        const local = readLocalNotifications();
        const item = local.find((n) => n.id === id);
        if (item) {
            item.read = true;
            writeLocalNotifications(local);
        }

        res.status(200).json({ success: true });
    } catch (err) {
        console.error("Mark read error:", err);
        res.status(500).json({ success: false, message: "Failed to mark as read" });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const { user_id } = req.body;

        // Try Supabase
        try {
            let q = supabaseAdmin.from("notifications").update({ read: true });
            if (user_id) q = q.eq("user_id", user_id);
            await q;
        } catch {}

        // Local store
        const local = readLocalNotifications();
        local.forEach((n) => {
            if (!user_id || n.user_id === user_id) {
                n.read = true;
            }
        });
        writeLocalNotifications(local);

        res.status(200).json({ success: true });
    } catch (err) {
        console.error("Mark all read error:", err);
        res.status(500).json({ success: false, message: "Failed to mark all as read" });
    }
};

module.exports = {
    createLoginNotification,
    formatLoginTimestamp,
    getNotifications,
    addNotification,
    markAsRead,
    markAllAsRead
};
