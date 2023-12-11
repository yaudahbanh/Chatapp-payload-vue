import { CollectionConfig } from "payload/types";

const Channels: CollectionConfig = {
  slug: "channels",
  auth: {
    disableLocalStrategy: true,
  },
  access: {
    create: ({ req }) => !!req.user,
    read: ({ req }) => !!req.user,
  },
  admin: {
    useAsTitle: "channel",
  },
  fields: [
    {
      name: "channel",
      type: "text",
      label: "Nama Channel",
      required: true,
    },
    {
      name: "chats",
      type: "array",
      minRows: 1,
      maxRows: 10,
      label: "Chats",
      required: false,
      fields: [
        {
          name: "sender",
          type: "text",
          label: "Sender",
          required: true,
        },
        {
          name: "message",
          type: "textarea",
          label: "Message",
          required: true,
        },
      ],
    },
    {
      name: "joins",
      type: "array",
      minRows: 1,
      maxRows: 10,
      label: "User Joined",
      required: false,
      fields: [
        {
          name: "id",
          type: "text",
          label: "Id",
          required: true,
        },
        {
          name: "username",
          type: "text",
          label: "Username",
          required: true,
        },
      ],
    },
  ],
};

export default Channels;
