<template>
  <title>Dashboard</title>
  <div>
    <h1>Dashboard</h1>
    <p>Welcome to your dashboard, {{ username }}</p>
  </div>
  <div>
    <form @submit="addChannels">
      <div>
        <label for="channel">Channel:</label>
        <input id="channel" v-model="channel" type="text" required />
      </div>
      <button type="submit">Create Channel</button>
    </form>
  </div>
  <div>
    <button type="submit" @click="userLogout">Logout</button>
  </div>
  <div>
    <h2>Channels List :</h2>
    <div v-for="item in channels" :key="item.id">
      <p>{{ item.channel }}</p>
      <button type="submit" @click="openChannel(item.id)">Open</button>
      <br>
      <input type="text" v-model="sendChat[item.id]" required />
      <button type="submit" @click="sendMessage(item.id)">Send Chat</button>
    </div>
    <div>
      <br>
      <textarea v-model="formattedChatText" cols="30" rows="10" readonly></textarea>
      <br>
    </div>
  </div>
  <div>
    <h3>Join Channel</h3>
    <input type="text" v-model="namaChannel" required />
    <button type="submit" @click="joinChannel">Join</button>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  name: "DashboardView",
  data() {
    return {
      channels: [], // for get channels
      channel: "", // for create new channel
      username: "", // for get username (welcoming)
      namaChannel: "", // for join channel
      chatText: [], // for show chat
      sendChat: {}, // for send chat
    };
  },
  computed: {
    formattedChatText() {
      return this.chatText.map((chat) => `${chat.sender}: ${chat.message}`).join("\n");
    },
  },
  mounted() {
    this.getChannels();
    this.getIdName();
    this.joinChannel();
  },
  methods: {
    // get channels
    async getChannels() {
      try {
        const req = await fetch("http://localhost:1335/api/channels", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await req.json();
        console.log(data.docs);
        this.channels = data.docs;

        if (req.status === 403) {
          this.$router.replace("/login");
        }

      } catch (err) {
        console.log(err);
      }
    },

    // add channels
    async addChannels() {
      try {
        const req = await fetch("http://localhost:1335/api/channels", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            channel: this.channel,
          }),
        });

        const data = await req.json();
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    },

    // get user id and name
    async getIdName() {
      try {
        const req = await fetch("http://localhost:1335/api/members/me", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await req.json();
        console.log(data.user);
        this.username = data.user.username;
        this.user_id = data.user.id;
      } catch (err) {
        console.log(err);
      }
    },

    // logout
    async userLogout() {
      try {
        const req = await fetch("http://localhost:1335/api/members/logout", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await req.json();
        if (req.status !== 200) {
          alert("Error logging out");
        } else {
          alert("Logged out");
          this.$router.replace("/login");
        }
      } catch (err) {
        console.log(err);
      }
    },

    // join channel
    async joinChannel() {
      var user_id = "";
      var user_name = "";
      var channel_id = "";

      try {
        // get user_id and user_name
        const user = await fetch("http://localhost:1335/api/members/me", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const userData = await user.json();
        console.log(userData.user);
        user_id = userData.user.id;
        user_name = userData.user.username;
        // console.log(user_id, user_name)

        const fetchChannel = await fetch(
          `http://localhost:1335/api/channels?where[channel][equals]=${this.namaChannel}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const channelData = await fetchChannel.json();
        channel_id = channelData.docs[0].id;
        // console.log(channel_id);

        const existingJoins = channelData.docs[0].joins || []; // get existing joins
        const req = await fetch(
          `http://localhost:1335/api/channels/${channel_id}`,
          {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              joins: [
                ...existingJoins,
                {
                  id: user_id,
                  username: user_name,
                },
              ],
            }),
          }
        );
        const data = await req.json();
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    },

    // open channel
    async openChannel(channelID) {
      // berdasarkan id channel
      var fill = "";
      try {
        const req = await fetch(
          `http://localhost:1335/api/channels/${channelID}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const dataChannel = await req.json();
        fill = dataChannel;
        // console.log(channelID);
        this.chatText = dataChannel.chats.map((chat) => ({
          sender: chat.sender,
          message: chat.message,
          // text: `${chat.sender}: ${chat.message}`,
        }));
        console.log(this.chatText);
      } catch (err) {
        console.log(err);
      }
    },

    // send message
    async sendMessage(channelID) {
      var pesan = this.sendChat[channelID];

      const fetchChannel = await fetch( // ambil pesan yang sudah dalam bentuk array
          `http://localhost:1335/api/channels/${channelID}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      const channelData = await fetchChannel.json();
      const existingChats = channelData.chats || []; // get existing chats

      try {
        const req = await fetch(
          `http://localhost:1335/api/channels/${channelID}`,
          {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chats: [
                ...existingChats,
                {
                  sender: this.username,
                  message: pesan,
                },
              ],
            }),
          }
        );
        const data = await req.json();
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
