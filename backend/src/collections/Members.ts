import { CollectionConfig } from "payload/types";

const Members: CollectionConfig = {
  slug: "members",
  auth: true,
  admin: {
    useAsTitle: "username",
  },
  access: {
    create: () => true,
  },
  fields: [
    {
      name: "username",
      type: "text",
      label: "Username",
      required: true,
    }
  ],
};

export default Members;
