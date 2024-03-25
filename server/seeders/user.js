import { Chat } from "../models/chatModel.js";
import { User } from "../models/userModel.js";
import { Message } from "../models/messageModel.js";
import { faker, simpleFaker } from "@faker-js/faker";



export const createUser = async (numUsers) => {
    try {

        const Userpromise = [];

        for (let i = 0; i < numUsers; i++) {
            const tempUser = User.create({
                name: faker.person.fullName(),
                username: faker.internet.userName(),
                bio: faker.lorem.sentence(10),
                password: "password",
                avatar: {
                    url: faker.image.avatar(),
                    public_id: faker.system.fileName()
                }
            })
            Userpromise.push(tempUser);
        }

        await Promise.all(Userpromise);
        console.log("user created", numUsers);
        process.exit(1)

    } catch (error) {
        console.error(error);
        process.exit(1)
    }
};


