// services/room.service.js
const admin = require("firebase-admin");
const EnterpriseService = require("./enterprise.service");

class RoomService {
  /**
   * Create a Room
   * Triggers billing event
   */
  async createRoom(uid, roomData) {
    const db = admin.firestore();

    // 1. Verify User belongs to an Enterprise
    const userDoc = await db.collection("USER").doc(uid).get();
    const enterpriseId = userDoc.data().enterpriseId;

    if (!enterpriseId) {
      throw new Error("You must belong to an Enterprise to create Rooms.");
    }

    // 2. Create Room
    const roomRef = db.collection("ROOM").doc();
    const newRoom = {
      roomId: roomRef.id,
      enterpriseId: enterpriseId,
      name: roomData.name,
      type: roomData.type || "private", // public/private
      aiModelProvider: roomData.aiModelProvider || "openai", // 'openai', 'gemini'
      aiConfig: roomData.aiConfig || {}, // { temperature: 0.7 }
      status: "active",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      closedAt: null,
    };

    await roomRef.set(newRoom);

    // 3. Add Creator as First Member
    await this.addMember(roomRef.id, uid);

    // 4. BILLING: Charge the Enterprise
    await EnterpriseService.logBillableEvent(enterpriseId, "ROOM_CREATED");

    return newRoom;
  }

  /**
   * Add Member to Room
   */
  async addMember(roomId, userId) {
    const db = admin.firestore();

    // Check if room exists
    const roomDoc = await db.collection("ROOM").doc(roomId).get();
    if (!roomDoc.exists) throw new Error("Room not found");

    // Add Member
    const memberRef = db.collection("ROOM_MEMBER").doc();
    await memberRef.set({
      id: memberRef.id,
      roomId: roomId,
      userId: userId,
      joinedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
  }

  /**
   * Get Room Details & Members
   */
  async getRoomDetails(roomId) {
    const db = admin.firestore();
    const roomDoc = await db.collection("ROOM").doc(roomId).get();
    if (!roomDoc.exists) return null;

    const membersSnapshot = await db
      .collection("ROOM_MEMBER")
      .where("roomId", "==", roomId)
      .get();

    return {
      room: roomDoc.data(),
      members: membersSnapshot.docs.map((d) => d.data()),
    };
  }
}

module.exports = new RoomService();
