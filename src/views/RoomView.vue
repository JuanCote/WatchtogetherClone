<template>
    <div class="main">
        <div class="header">
            <button @click="$router.push({ name: 'Home' })" class="arrow">
                <img class="arrow-logo" src="../images/arrow.png" alt="back">
            </button>
            <div class="search">
                <div class='logo-container'>
                    <img class='logo' src="../images/youtube.png" alt="youtube">
                </div>
                <input v-model="input" placeholder="Paste a link to a Youtube video" type="text" class="input">
                <div @click="CleanInput" :class="{ 'visibility': input === '' }" class="clean"><img class="cross"
                        src="../images/cross.png" alt="cross"></div>
                <button @click="addVideo" class="button"><img class="lupa" src="../images/lupa.png" alt=""></button>
            </div>
        </div>
        <div class="container">
            <div class="player">
                <YoutubeVue3 class="iframe" width="100%" height="100%" :autoplay="0" controls="1" ref="youtube"
                    :videoid="videoId" @ended="onEnded" @paused="onPaused" @played="onPlayed" />
            </div>
            <ul class="list-users">
                <li v-for="user in users" class="user">
                    <img :src="user[1]" class="avatar">
                    <div class="username">{{ user[0] }}</div>
                </li>
            </ul>
        </div>
    </div>
</template>


<script>
import { YoutubeVue3 } from 'youtube-vue3'
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js"
const socket = io('https://salty-castle-51319.herokuapp.com/', {transports: ['websocket']})

export default {
    data() {
        return {
            input: '',
            room_id: '',
            user: '',
            cross: true,
            player: null,
            videoId: 'Lw8TeLS4_IA',
            users: [],
            socketFlag: false,
            autoplay: 0,
            avatar: '',
            avatars: ["/Watchtogether-clone/images/sila.jpg", "/Watchtogether-clone/images/van.jpg", "/Watchtogether-clone/images/pes.jpg", "/Watchtogether-clone/images/gilter.jpg", "/Watchtogether-clone/images/daun.jpg"]
        }
    },
    components: {
        YoutubeVue3
    },
    ready() {

    },
    created() {
        this.avatar = this.avatars[Math.floor(Math.random()*this.avatars.length)]
    },
    mounted() {
        document.addEventListener('beforeunload', this.leaving)
        this.room_id = this.$route.params.room_id
        this.user = 'user' + String(Date.now() % 10000)
        socket.emit('join_room', {'username': this.user, 'room': this.room_id, 'avatar': this.avatar})
        socket.on('join_room', (data) => {
            this.users = data['users']
        }),
        socket.on('play_video', (data) => {
            if (data['username'] !== this.user) {
                this.socketFlag = true
                if (data['action'] === 'play') {
                    this.$refs.youtube.player.seekTo(data['seek_to'])
                    this.$refs.youtube.player.playVideo()
                }
                else {
                    this.$refs.youtube.player.pauseVideo()
                    this.$refs.youtube.player.seekTo(data['seek_to'])
                }
            }
        })
        socket.on('leave_room', (data) => {
            this.users = data['users']
        })
        socket.on('addVideo', (data) => {
            if(this.user !== data['username']) {
                this.videoId = data['url']
            }
        })
    },
    methods: {
        addVideo() {
            this.videoId = this.input.split('=')[1]
            this.input = ''
            socket.emit('add_video', {
                'username': this.user,
                'room': this.room_id,
                'url': this.videoId
            })
        },
        leaving() {
            socket.emit('client_disconnected', {
                'username': this.user,
                'room': this.room_id
            })
        },
        CleanInput() {
            this.input = ''
        },
        async onPlayed() {
            if (this.socketFlag === false) {
                let cur_time = 0
                await this.$refs.youtube.player.getCurrentTime().then(res => cur_time = res)
                socket.emit('play_video', {
                    'username': this.user,
                    'room': this.room_id,
                    'action': 'play',
                    'cur_time': cur_time
                })
            }

            this.socketFlag = false
        },
        async onPaused() {
            if (this.socketFlag === false) {
                let cur_time = 0
                await this.$refs.youtube.player.getCurrentTime().then(res => cur_time = res)
                socket.emit('play_video', {
                    'username': this.user,
                    'room': this.room_id,
                    'action': 'pause',
                    'cur_time': cur_time
                })
            }

            this.socketFlag = false
        },
    },
}
</script>

<style scoped>
.button-stop {
    height: 100px;
    width: 100px;
}

.controller {
    background: black;
    height: 50px;
}

.user {
    width: 110px;
    height: 100%;
    border-radius: 8px;
    margin-left: 3px;
}

.avatar {
    height: 110px;
    width: 110px;
}

.username {
    text-align: center;
    margin-top: -5px;
    height: 23px;
    background: limegreen;
}

.list-users {
    display: flex;
    list-style-type: none;
    margin-top: 2rem;
    background: #1f1d1c;
    height: calc(100% - 707px);

}

.container {
    width: 1250px;
    margin: 0 auto;
    background: transparent;
    height: 70%;
}

.main {
    height: 1200px;
    background-color: rgba(0, 0, 0, 0.87);
    background-repeat: no-repeat;
    background-position: center center;
    background-attachment: fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
}

.player {
    height: 707px;
    margin-top: 30px;
}

.header {
    display: flex;
    align-items: center;
    height: 45px;
    background: linear-gradient(to bottom, #4c4a47 1%, #353531 100%);
}

.search {
    display: flex;
    align-items: center;
    width: 500px;
    height: 30px;
    margin: 0 auto;
    background: #fff;
    border-radius: 5px;
}

.logo-container {
    height: 100%;
    display: flex;
    align-items: center;
    border-right: 0.5px solid gray;
    padding-right: 10px;
    margin-left: 8px;
}

.logo {
    height: 25px;
}

.input {
    border: none;
    outline: none;
    font-size: 15px;
    padding-left: 10px;
    height: 100%;
    width: 500px;
}

.button {
    cursor: pointer;
    height: 100%;
    border: none;
    border-radius: 0 5px 5px 0;
    background: #e0e1e2;
    width: 60px;
    display: flex;
    align-items: center;
}

.button:hover {
    background: #c7c8c9;
}

.arrow {
    height: 30px;
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-left: 20px;
    background: none;
    border: none;
}

.arrow-logo {
    height: 20px;
}

.lupa {
    height: 20px;
    margin: 0 auto;
}

.clean {
    display: flex;
    align-items: center;
    margin: 0 5px 0 5px
}

.clean.visibility {
    visibility: hidden;
}

.cross {
    margin: 0 auto;
    height: 13px;
}
</style>