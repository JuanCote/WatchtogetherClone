<template>
  <div class="main">
    <v_modalForm
      @sendInput="sendUsername"
      @closeModal="closeModal"
      v-if="modalActive"
    ></v_modalForm>
    <div class="header">
      <button @click="$router.push({ name: 'Home' })" class="arrow">
        <img class="arrow-logo" src="../../images/arrow.png" alt="back" />
      </button>
      <div class="search">
        <div class="logo-container">
          <img class="logo" src="../../images/youtube.png" alt="youtube" />
        </div>
        <input
          v-on:keyup.enter="addVideo"
          v-model="input"
          placeholder="Paste a link to a Youtube video"
          type="text"
          class="input"
        />
        <div
          @click="CleanInput"
          :class="{ visibility: input === '' }"
          class="clean"
        >
          <img class="cross" src="../../images/cross.png" alt="cross" />
        </div>
        <button @click="addVideo" class="button">
          <img class="lupa" src="../../images/lupa.png" alt="" />
        </button>
      </div>
    </div>
    <div class="container">
      <div class="player">
        <YoutubeVue3
          class="iframe"
          width="100%"
          height="100%"
          :autoplay="0"
          controls="1"
          ref="youtube"
          :videoid="videoId"
          @paused="onPaused"
          @played="onPlayed"
        />
      </div>
      <ul class="list-users">
        <li v-for="username in users" class="user">
          <img :src="username[1]" class="avatar" />
          <div
            @click="showModal($event)"
            class="username"
            v-bind:class="{ active: username[0] == user }"
          >
            {{ username[0] }}
          </div>
        </li>
      </ul>
      <div v-if="users.length === 0" class="loader">
        <div class="half-circle-spinner">
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { YoutubeVue3 } from "youtube-vue3";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import v_modalForm from "../../components/modalForm.vue";

const socket = io("https://w2g.bondarenkonikita.pp.ua/");

export default {
  data() {
    return {
      input: "",
      room_id: "",
      user: "",
      cross: true,
      player: null,
      videoId: "Lw8TeLS4_IA",
      users: [],
      socketFlag: false,
      autoplay: 0,
      avatar: "",
      avatars: [
        "/Watchtogether-clone/sila.jpg",
        "/Watchtogether-clone/van.jpg",
        "/Watchtogether-clone/pes.jpg",
        "/Watchtogether-clone/gilter.jpg",
        "/Watchtogether-clone/daun.jpg",
      ],
      modalActive: false,
    };
  },
  components: {
    YoutubeVue3,
    v_modalForm,
  },
  ready() {},
  created() {
    this.avatar = this.avatars[Math.floor(Math.random() * this.avatars.length)];
  },
  mounted() {
    document.addEventListener("beforeunload", this.leaving);
    this.room_id = this.$route.params.room_id;
    this.user = "user" + String(Date.now() % 10000);
    socket.emit("join_room", {
      username: this.user,
      room: this.room_id,
      avatar: this.avatar,
    });
    socket.on("join_room", (data) => {
      this.users = data["users"];
    }),
      socket.on("play_video", (data) => {
        if (data["username"] !== this.user) {
          this.socketFlag = true;
          if (data["action"] === "play") {
            this.$refs.youtube.player.seekTo(data["seek_to"]);
            this.$refs.youtube.player.playVideo();
          } else {
            this.$refs.youtube.player.pauseVideo();
            this.$refs.youtube.player.seekTo(data["seek_to"]);
          }
        }
      });
    socket.on("leave_room", (data) => {
      this.users = data["users"];
    });
    socket.on("addVideo", (data) => {
      if (this.user !== data["username"]) {
        this.videoId = data["url"];
      }
    });
    socket.on("new_list", (data) => {
      this.users = data;
    });
  },
  methods: {
    addVideo() {
      const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      this.videoId = this.input.match(regExp)[2];
      this.input = "";
      socket.emit("add_video", {
        username: this.user,
        room: this.room_id,
        url: this.videoId,
      });
    },
    leaving() {
      socket.emit("client_disconnected", {
        username: this.user,
        room: this.room_id,
      });
    },
    CleanInput() {
      this.input = "";
    },
    async onPlayed() {
      if (this.socketFlag === false) {
        let cur_time = 0;
        await this.$refs.youtube.player
          .getCurrentTime()
          .then((res) => (cur_time = res));
        socket.emit("play_video", {
          username: this.user,
          room: this.room_id,
          action: "play",
          cur_time: cur_time,
        });
      }
      this.socketFlag = false;
    },
    async onPaused() {
      if (this.socketFlag === false) {
        let cur_time = 0;
        await this.$refs.youtube.player
          .getCurrentTime()
          .then((res) => (cur_time = res));
        socket.emit("play_video", {
          username: this.user,
          room: this.room_id,
          action: "pause",
          cur_time: cur_time,
        });
      }
      this.socketFlag = false;
    },
    showModal(event) {
      if (event.target.getAttribute("class") === "username active") {
        this.modalActive = true;
      }
    },
    closeModal() {
      this.modalActive = false;
    },
    sendUsername(value) {
      this.user = value;
      socket.emit("change_username", {
        room: this.room_id,
        new_username: value,
      });
    },
  },
};
</script>

<style scoped>
@import "./style.css";
</style>
