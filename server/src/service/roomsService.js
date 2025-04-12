import { Room } from '../models/room.js';

const roomsContent = [];

export const roomsService = {
  async getById(roomId) {
    const foundRoom = await Room.findOne({ where: { id: roomId } });

    if (!foundRoom) {
      return undefined;
    }

    return foundRoom;
  },

  async create(userName, roomName, limit) {
    const created = await Room.create(
      { admin: userName, name: roomName, limit, users: [userName] },
      { returning: true },
    );

    if (!created) {
      return false;
    }

    const newRoom = { id: created.id, messages: [] };

    return created;
  },

  async join(roomId, userName) {
    const foundRoom = await this.getById(roomId);

    if (!foundRoom) {
      return undefined;
    }

    const currentCountOfUsers = foundRoom.users.length;
    const roomLimit = foundRoom.limit;

    if (Number(roomLimit) === Number(currentCountOfUsers)) {
      return false;
    }

    const joinedUsers = foundRoom.users.includes(userName)
      ? [...foundRoom.users]
      : [...foundRoom.users, userName];
    await foundRoom.update({ users: joinedUsers });

    return foundRoom;
  },

  async getMessages(roomId) {
    let currentRoom = roomsContent.find((room) => room.id === roomId);

    if (!currentRoom) {
      currentRoom = { id: roomId, messages: [] };
      roomsContent.push(currentRoom);
    }

    return currentRoom.messages;
  },

  async addMessage(roomId, user, content) {
    let currentRoom = roomsContent.find((room) => room.id === roomId);

    if (!currentRoom) {
      currentRoom = { id: roomId, messages: [] };
      roomsContent.push(currentRoom);
    }

    const newMessage = {
      name: user,
      text: content,
      date: new Date().toISOString(), // або new Date(), як зручніше
    };

    currentRoom.messages.push(newMessage);

    return newMessage;
  },

  async change(roomId, method) {
    const roomToChange = await this.getById(roomId);

    try {
      switch (method.type) {
        case 'rename':
          const [_, updatedRooms] = await Room.update(
            { name: method.payload },
            {
              where: { id: roomId },
              returning: true,
            },
          );
          return updatedRooms;
        case 'delete':
          await Room.destroy({ where: { id: method.payload } });
          return true;
        case 'deleteUser':
          roomToChange.users = roomToChange.users.filter(
            (user) => user !== method.payload,
          );
          await roomToChange.save();
          return roomToChange;
      }
    } catch (err) {
      console.error(`catch error change service: ${err.message}`);
      return false;
    }
  },

  async crear() {
    await Room.destroy({
      where: {},
      truncate: false,
    });

    return true;
  },
};
