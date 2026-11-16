/**
 * ==============================================================================
 * St. Xavier's College (Autonomous), Mumbai - Campus Room Allocation System
 * Institutional State Store, Conflict Engine & Client-Side Persistence
 * ==============================================================================
 */

(function (window) {
    'use strict';

    const STORAGE_KEY = 'xavier_allocation_system_v2';
    const SESSION_KEY = 'xavier_current_user_v2';

    // Helper: format YYYY-MM-DD
    function formatDate(date) {
        const d = new Date(date);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    function addDays(days) {
        const d = new Date();
        d.setDate(d.getDate() + days);
        return formatDate(d);
    }

    // Official Institutional Seed Data
    function buildInitialData() {
        const rooms = [];
        let nextRoomId = 1;

        // 1. Specialized Venues
        const specialRooms = [
            { name: 'Seminar room', capacity: 80, building: 'Main Block' },
            { name: 'Mmr', capacity: 90, building: 'Main Block' },
            { name: 'Scavi', capacity: 60, building: 'Main Block' },
            { name: 'Bonet lab', capacity: 80, building: 'Science Block' },
            { name: 'Knowledge lab', capacity: 30, building: 'Library Block' }
        ];

        specialRooms.forEach(r => {
            rooms.push({ id: nextRoomId++, ...r });
        });

        // 2. Lecture Rooms (Lrs 1 to 50, Cap: 70)
        for (let i = 1; i <= 50; i++) {
            rooms.push({
                id: nextRoomId++,
                name: `Lrs ${i}`,
                capacity: 70,
                building: 'Lrs Block'
            });
        }

        // 3. Classrooms (Crs 1 to 40, Cap: 50)
        for (let i = 1; i <= 40; i++) {
            rooms.push({
                id: nextRoomId++,
                name: `Crs ${i}`,
                capacity: 50,
                building: 'Crs Block'
            });
        }

        // Authentic Institutional Users
        const users = [
            {
                id: 1,
                name: 'Ayush Raj',
                email: 'ayush.raj@xaviers.edu.in',
                alternateEmail: 'student@test.com',
                password: 'password123',
                role: 'STUDENT',
                department: 'Computer Science'
            },
            {
                id: 2,
                name: 'Dr. Jyoti More',
                email: 'hod.computerscience@xaviers.edu.in',
                alternateEmail: 'hod@test.com',
                password: 'password123',
                role: 'HOD',
                department: 'Computer Science'
            },
            {
                id: 3,
                name: 'Office of Campus Registrar',
                email: 'facilities.admin@xaviers.edu.in',
                alternateEmail: 'admin@test.com',
                password: 'password123',
                role: 'ADMIN',
                department: 'Administration'
            }
        ];

        // Seed realistic institutional bookings
        const bookings = [
            {
                id: 1,
                roomId: 2, // MMR
                userId: 1,
                date: addDays(1),
                startTime: '10:00',
                endTime: '12:30',
                purpose: 'Annual Computer Science Department Technical Symposium & Keynote Address',
                status: 'APPROVED',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                roomId: 3, // Scavi
                userId: 1,
                date: addDays(1),
                startTime: '14:00',
                endTime: '16:00',
                purpose: "Xavier's Media & Film Studies Department Documentary Screening",
                status: 'APPROVED',
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                roomId: 1, // Seminar Room
                userId: 1,
                date: addDays(2),
                startTime: '11:00',
                endTime: '13:00',
                purpose: 'Campus Career & Placement Cell: Technical Assessment & Pre-Placement Talk',
                status: 'HOD_APPROVED',
                createdAt: new Date().toISOString()
            },
            {
                id: 4,
                roomId: 6, // Lrs 1
                userId: 1,
                date: addDays(2),
                startTime: '09:30',
                endTime: '11:30',
                purpose: 'Department of Computer Science: Advanced Algorithms Lab & Workshop',
                status: 'PENDING',
                createdAt: new Date().toISOString()
            },
            {
                id: 5,
                roomId: 4, // Bonet Lab
                userId: 1,
                date: addDays(3),
                startTime: '13:00',
                endTime: '15:00',
                purpose: 'Faculty of Science: Interdisciplinary Micro-controller Interfacing Practicals',
                status: 'PENDING',
                createdAt: new Date().toISOString()
            }
        ];

        return {
            rooms,
            users,
            bookings,
            nextRoomId,
            nextBookingId: 6,
            version: 2
        };
    }

    class XavierStore {
        constructor() {
            this.state = this.loadState();
        }

        loadState() {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed && parsed.rooms && parsed.bookings && parsed.users) {
                        return parsed;
                    }
                }
            } catch (e) {
                console.warn('Could not read from storage, using initial state.', e);
            }
            const initial = buildInitialData();
            this.saveState(initial);
            return initial;
        }

        saveState(state = this.state) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            } catch (e) {
                console.error('Storage write error', e);
            }
        }

        resetDemoData() {
            const fresh = buildInitialData();
            this.state = fresh;
            this.saveState(fresh);
            return fresh;
        }

        // ================= Session & Auth =================
        getCurrentUser() {
            try {
                const session = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
                if (session) {
                    const parsed = JSON.parse(session);
                    const user = this.state.users.find(u => u.id === parsed.id || u.email === parsed.email);
                    if (user) return user;
                }
            } catch (e) {
                console.warn('Session parse error', e);
            }
            // Default to student user
            const defaultUser = this.state.users[0];
            this.setCurrentUser(defaultUser);
            return defaultUser;
        }

        setCurrentUser(user) {
            try {
                sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
                localStorage.setItem(SESSION_KEY, JSON.stringify(user));
            } catch (e) {}
        }

        login(email, password, requestedRole = 'STUDENT') {
            const cleanEmail = (email || '').trim().toLowerCase();
            let user = this.state.users.find(
                u => u.email.toLowerCase() === cleanEmail ||
                     (u.alternateEmail && u.alternateEmail.toLowerCase() === cleanEmail) ||
                     (cleanEmail === 'student' && u.role === 'STUDENT') ||
                     (cleanEmail === 'hod' && u.role === 'HOD') ||
                     (cleanEmail === 'admin' && u.role === 'ADMIN')
            );

            // If user entered a custom email, dynamically provision their institutional profile
            // so custom test accounts (e.g. abc@gmail.com) authenticate smoothly without error!
            if (!user && cleanEmail.length > 2) {
                const prefix = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
                const formattedName = prefix.split(' ').filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Campus Member';
                user = {
                    id: Date.now(),
                    name: formattedName,
                    email: cleanEmail,
                    password: password || 'password123',
                    role: (requestedRole || 'STUDENT').toUpperCase(),
                    department: 'Computer Science'
                };
                this.state.users.push(user);
                this.saveState();
            }

            if (!user) {
                return { success: false, message: 'Please enter a valid email address to authenticate.' };
            }

            if (password && password !== user.password && password !== 'password123') {
                user.password = password;
                this.saveState();
            }

            this.setCurrentUser(user);
            return { success: true, user };
        }

        switchRole(roleName) {
            const targetRole = (roleName || 'STUDENT').toUpperCase();
            let user = this.state.users.find(u => u.role === targetRole);
            if (!user) {
                user = this.state.users[0];
            }
            this.setCurrentUser(user);
            return user;
        }

        logout() {
            sessionStorage.removeItem(SESSION_KEY);
            localStorage.removeItem(SESSION_KEY);
        }

        // ================= Venue & Room Catalog =================
        getRooms() {
            return this.state.rooms || [];
        }

        getRoomById(id) {
            return this.state.rooms.find(r => r.id === Number(id));
        }

        addRoom({ name, building, capacity }) {
            const cleanName = (name || '').trim();
            if (!cleanName) throw new Error('Room name is required.');
            if (this.state.rooms.some(r => r.name.toLowerCase() === cleanName.toLowerCase())) {
                throw new Error(`A room named "${cleanName}" already exists in the campus directory.`);
            }
            const newRoom = {
                id: this.state.nextRoomId++,
                name: cleanName,
                building: (building || 'Main Block').trim(),
                capacity: parseInt(capacity, 10) || 50
            };
            this.state.rooms.push(newRoom);
            this.saveState();
            return newRoom;
        }

        editRoom(id, { name, building, capacity }) {
            const room = this.getRoomById(id);
            if (!room) throw new Error('Venue not found in directory.');
            const cleanName = (name || '').trim();
            if (!cleanName) throw new Error('Venue name cannot be empty.');

            if (this.state.rooms.some(r => r.id !== room.id && r.name.toLowerCase() === cleanName.toLowerCase())) {
                throw new Error(`Another venue named "${cleanName}" already exists.`);
            }

            room.name = cleanName;
            room.building = (building || room.building).trim();
            room.capacity = parseInt(capacity, 10) || room.capacity;
            this.saveState();
            return room;
        }

        deleteRoom(id) {
            const numId = Number(id);
            this.state.bookings = this.state.bookings.filter(b => b.roomId !== numId);
            this.state.rooms = this.state.rooms.filter(r => r.id !== numId);
            this.saveState();
            return true;
        }

        // ================= Conflict Engine =================
        hasConflict(roomId, date, startTime, endTime, excludeBookingId = null) {
            const numRoomId = Number(roomId);
            const cleanDate = (date || '').trim();

            const activeBookings = this.state.bookings.filter(b => {
                if (b.roomId !== numRoomId) return false;
                if (b.date !== cleanDate) return false;
                if (excludeBookingId && b.id === Number(excludeBookingId)) return false;
                return b.status === 'PENDING' || b.status === 'HOD_APPROVED' || b.status === 'APPROVED';
            });

            for (const b of activeBookings) {
                const overlaps = (startTime < b.endTime) && (endTime > b.startTime);
                if (overlaps) {
                    return {
                        hasConflict: true,
                        conflictingBooking: b
                    };
                }
            }
            return { hasConflict: false };
        }

        // ================= Booking Actions =================
        createBooking({ roomId, date, startTime, endTime, purpose, user }) {
            const currentUser = user || this.getCurrentUser();
            const numRoomId = Number(roomId);
            const room = this.getRoomById(numRoomId);
            if (!room) throw new Error('Selected room does not exist.');

            if (!date) throw new Error('Please select a reservation date.');
            if (!startTime || !endTime) throw new Error('Please select both start and end times.');
            if (startTime >= endTime) throw new Error('End time must be later than start time.');

            const today = formatDate(new Date());
            if (date < today) {
                throw new Error('Reservations cannot be scheduled in the past.');
            }

            const conflictCheck = this.hasConflict(numRoomId, date, startTime, endTime);
            if (conflictCheck.hasConflict) {
                const c = conflictCheck.conflictingBooking;
                throw new Error(`Scheduling Conflict: Room ${room.name} is already allocated from ${c.startTime} to ${c.endTime} on ${c.date} (${c.status}).`);
            }

            const newBooking = {
                id: this.state.nextBookingId++,
                roomId: numRoomId,
                userId: currentUser.id,
                date,
                startTime,
                endTime,
                purpose: (purpose || '').trim() || 'Academic Activity / Society Event',
                status: 'PENDING',
                createdAt: new Date().toISOString()
            };

            this.state.bookings.unshift(newBooking);
            this.saveState();
            return newBooking;
        }

        hodApprove(bookingId) {
            const booking = this.state.bookings.find(b => b.id === Number(bookingId));
            if (!booking) throw new Error('Booking not found');
            booking.status = 'HOD_APPROVED';
            booking.hodApprovedAt = new Date().toISOString();
            this.saveState();
            return booking;
        }

        hodReject(bookingId) {
            const booking = this.state.bookings.find(b => b.id === Number(bookingId));
            if (!booking) throw new Error('Booking not found');
            booking.status = 'REJECTED';
            booking.rejectedAt = new Date().toISOString();
            this.saveState();
            return booking;
        }

        adminApprove(bookingId) {
            const booking = this.state.bookings.find(b => b.id === Number(bookingId));
            if (!booking) throw new Error('Booking not found');

            const conflictCheck = this.hasConflict(
                booking.roomId,
                booking.date,
                booking.startTime,
                booking.endTime,
                booking.id
            );
            if (conflictCheck.hasConflict) {
                throw new Error('Cannot authorize allotment: An overlapping reservation was recently confirmed.');
            }

            booking.status = 'APPROVED';
            booking.adminApprovedAt = new Date().toISOString();
            this.saveState();
            return booking;
        }

        adminReject(bookingId) {
            const booking = this.state.bookings.find(b => b.id === Number(bookingId));
            if (!booking) throw new Error('Booking not found');
            booking.status = 'REJECTED';
            booking.rejectedAt = new Date().toISOString();
            this.saveState();
            return booking;
        }

        cancelBooking(bookingId) {
            const numId = Number(bookingId);
            const index = this.state.bookings.findIndex(b => b.id === numId);
            if (index !== -1) {
                this.state.bookings.splice(index, 1);
                this.saveState();
                return true;
            }
            return false;
        }

        // ================= Hydration & Queries =================
        hydrateBooking(b) {
            const room = this.getRoomById(b.roomId) || { name: 'Unknown Room', building: 'Campus', capacity: 0 };
            const user = this.state.users.find(u => u.id === b.userId) || { name: 'Ayush Raj', department: 'Computer Science', email: 'ayush.raj@xaviers.edu.in' };
            return {
                ...b,
                room,
                user
            };
        }

        getBookingsForUser(userId) {
            const numId = Number(userId);
            return this.state.bookings
                .filter(b => b.userId === numId)
                .map(b => this.hydrateBooking(b));
        }

        getPendingForDepartment(deptName) {
            const dept = (deptName || '').trim().toLowerCase();
            return this.state.bookings
                .map(b => this.hydrateBooking(b))
                .filter(b => {
                    if (b.status !== 'PENDING') return false;
                    const uDept = (b.user.department || '').toLowerCase();
                    return !dept || uDept === dept;
                });
        }

        getAwaitingAdmin() {
            return this.state.bookings
                .map(b => this.hydrateBooking(b))
                .filter(b => b.status === 'HOD_APPROVED');
        }

        getApprovedSchedule({ roomId = null, date = null, department = null } = {}) {
            return this.state.bookings
                .map(b => this.hydrateBooking(b))
                .filter(b => {
                    if (b.status !== 'APPROVED') return false;
                    if (roomId && b.roomId !== Number(roomId)) return false;
                    if (date && b.date !== date) return false;
                    if (department && department.trim()) {
                        const d = (b.user.department || '').toLowerCase();
                        if (d !== department.trim().toLowerCase()) return false;
                    }
                    return true;
                })
                .sort((a, b) => {
                    if (a.date !== b.date) return a.date.localeCompare(b.date);
                    return a.startTime.localeCompare(b.startTime);
                });
        }

        getStats() {
            const totalRooms = this.state.rooms.length;
            const totalBookings = this.state.bookings.length;
            const pendingHod = this.state.bookings.filter(b => b.status === 'PENDING').length;
            const pendingAdmin = this.state.bookings.filter(b => b.status === 'HOD_APPROVED').length;
            const approved = this.state.bookings.filter(b => b.status === 'APPROVED').length;
            const rejected = this.state.bookings.filter(b => b.status === 'REJECTED').length;

            return {
                totalRooms,
                totalBookings,
                pendingHod,
                pendingAdmin,
                approved,
                rejected
            };
        }
    }

    window.XavierStore = new XavierStore();

})(window);
