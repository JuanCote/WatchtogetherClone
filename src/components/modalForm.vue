<template>
    <div class="modalForm">
        <div class="header">
            <span class="header-text">Pick a nickname</span>
            <img @click="closeModal" class="header-cross" src="../images/close.png" />
        </div>
        <div class="content">
            <input @keyup.enter="sendInput" v-model="input" placeholder="Enter a nickname..." type="text" class="input">
            <button @click="sendInput" class="button-submit">OK</button>
        </div>
        <div class="footer">

        </div>
    </div>
</template>

<script>
    export default {
        name: 'v-modalForm',
        data() {
            return {
                input: ''
            }
        },
        methods: {
            closeModal() {
                this.$emit('closeModal')
            },
            sendInput() {
                this.$emit('sendInput', this.input)
                this.input = ''
                this.$emit('closeModal')
            }
        }
    }
</script>

<style scoped>
.modalForm {
    width: 400px;
    height: 200px;
    background: white;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -100px;
    margin-left: -200px;
    border-radius: 5px;
}
.header {
    display: flex;
    align-items: center;
    height: 20%;
    padding: 10px;
    border-bottom: 0.5px solid rgba(53, 50, 50, 0.651);
}
.header-text {
    font-size: 18px;
    font-weight: 600;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
.header-cross {
    cursor: pointer;
    margin-left: auto;
    height: 20px;
}
.content {
    display: flex;
}
.input {
    margin-left: 0.5rem;
    width: 80%;
    height: 2rem;
    margin-top: 15%;
    outline: none;
    padding-left: 10px;
    font-size: 15px;
    border: 1px solid rgb(63, 62, 62);
    border-radius: 5px 0 0 5px;
    border-right: none;
}
.button-submit {
    margin-left: -3px;
    width: 15%;
    height: 2rem;
    margin-top: 15%;
    border: none;
    background: #facd3b;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0 5px 5px 0;
}
</style>