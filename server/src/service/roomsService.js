import { promises as fs } from 'fs';
import { Room } from '../models/room.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MESSAGES_URL = path.join(__dirname, 'messages.json');

const readMessages = async () => {
  try {
    const data = await fs.readFile(MESSAGES_URL, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.writeFile(MESSAGES_URL, '[]');
      return [];
    }
    throw err;
  }
};

const writeMessages = async (data) => {
  await fs.writeFile(MESSAGES_URL, JSON.stringify(data, null, 2));
};

export const roomsService = {
  async getById(roomId) {
    return await Room.findOne({ where: { id: roomId } });
  },

  async create(userName, roomName, limit) {
    const created = await Room.create(
      { admin: userName, name: roomName, limit, users: [userName] },
      { returning: true }
    );

    if (!created) return false;

    const allMessages = await readMessages();
    allMessages.push({ id: created.id, messages: [] });
    await writeMessages(allMessages);

    return created;
  },

  async join(roomId, userName) {
    const foundRoom = await this.getById(roomId);
    if (!foundRoom) return undefined;

    const currentUsers = foundRoom.users;
    const roomLimit = foundRoom.limit;

    if (Number(currentUsers.length) >= Number(roomLimit)) return false;

    const updatedUsers = currentUsers.includes(userName)
      ? currentUsers
      : [...currentUsers, userName];

    await foundRoom.update({ users: updatedUsers });
    return foundRoom;
  },

  async getMessages(roomId) {
    const allMessages = await readMessages();
    let room = allMessages.find((r) => r.id === roomId);

    if (!room) {
      room = { id: roomId, messages: [] };
      allMessages.push(room);
      await writeMessages(allMessages);
    }

    return room.messages;
  },

  async addMessage(roomId, user, content) {
    const allMessages = await readMessages();
    let room = allMessages.find((r) => r.id === roomId);

    if (!room) {
      room = { id: roomId, messages: [] };
      allMessages.push(room);
    }

    const newMessage = {
      name: user,
      text: content,
      date: new Date().toISOString(),
    };

    room.messages.push(newMessage);
    await writeMessages(allMessages);

    return newMessage;
  }
};
