
<template>
<div class="main">
    <div class="modal">
        <div class='text'>
            <h1>
                <span class="typed-text">{{ typeValue }}</span>
                <span class='cursor' :class="{ 'typing': typeStatus }">&nbsp;</span>
                together
            </h1>
        </div>
        <div class="buttons">
            <button v-on:click="RedirectToRoom(1)" id="create_room" class="create-room">Room 1</button>
            <button v-on:click="RedirectToRoom(2)" id="create_roo" class="create-room">Room 2</button>
            <button v-on:click="RedirectToRoom(3)" id="create_room" class="create-room">Room 3</button>
            <button v-on:click="RedirectToRoom(4)" id="create_room" class="create-room">Room 4</button>
            <button v-on:click="RedirectToRoom(5)" id="create_room" class="create-room">Room 5</button>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            id: '',
            typeValue: '',
            typeArray: ['watch amv', 'listen to shit rap', 'watch cringe interview'],
            charIndex: 0,
            typeArrayIndex: 0,
            typeStatus: false
        }
    },
    methods: {
        RedirectToRoom(id) {
            this.id = id
            this.$router.push({ name: 'Rooms', params: { room_id: this.id } })
        },
        TypeText() {
            if (this.charIndex < this.typeArray[this.typeArrayIndex].length) {
                if (!this.typeStatus)
                    this.typeStatus = true;
                this.typeValue += this.typeArray[this.typeArrayIndex].charAt(this.charIndex)
                this.charIndex += 1

                setTimeout(this.TypeText, 100)
            }
            else {
                this.typeStatus = false;
                setTimeout(this.EraseText, 2000)
            }
        },
        EraseText() {
            if (this.charIndex > 0) {
                if (!this.typeStatus)
                    this.typeStatus = true;
                this.typeValue = this.typeArray[this.typeArrayIndex].substring(0, this.charIndex - 1)
                this.charIndex -= 1
                setTimeout(this.EraseText, 50)
            }
            else {
                this.typeStatus = false;
                this.typeArrayIndex += 1;
                if (this.typeArrayIndex >= this.typeArray.length)
                    this.typeArrayIndex = 0;
                setTimeout(this.TypeText, 200 + 1000);
            }
        }
    },
    created() {
        setTimeout(this.TypeText, 2200)
    }
} 
</script>
    
<style scoped>
* {
    margin: 0;
    padding: 0;
}

.buttons{
    display: flex;
    gap: 1rem;

}

.main {
    padding-top: 280px;
    height: 1000px;
    background-image: url(../images/3795806.jpg);
    background-repeat: no-repeat;
    background-position: center center;
    background-attachment: fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
}

.modal {
    margin-right: auto;
    margin-left: auto;
    margin-top: 0px;
    width: 30%;
    background: rgba(48, 48, 48, 0.64);
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: none;
    border-radius: 7px;
}

.create-room {
    margin-top: 20px;
    font-weight: bold;
    font-size: 16px;
    padding: 1rem;
    background: #facd3b;
    border: 0.5px solid black;
    border-radius: 5px;
    width: 100%;
    height: 50px;
    cursor: pointer;
}

.text {
    margin-top: 30px;
}

h1 {
    font-size: 2.5rem;
    font-weight: normal;
    color: white;
}

.typed-text {}

.cursor {
    display: inline-block;
    margin-left: 2px;
    width: 3px;
    background-color: #fff;
    animation: cursorBlink 1s infinite;
}

.cursor.typing {
    animation: none;
}

@keyframes cursorBlink {
    49% {
        background-color: #fff;
    }

    50% {
        background-color: transparent;
    }

    99% {
        background-color: transparent;
    }
}
</style>