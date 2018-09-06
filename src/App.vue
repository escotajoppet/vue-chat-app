<template>
  <div class="card mt-3">
    <div class="card-body">
      <div class="card-title">
        <h3>Chat Group</h3>
        <hr>
      </div>
      <div class="card-body">
        <div class="messages" v-for="(msg, index) in messages" :key="index">
          <p><span class="font-weight-bold">{{ msg.user }}: </span>{{ msg.message }}</p>
        </div>

        <p v-show="typing.length > 0">{{ typing.join(', ') }} is typing...</p>
      </div>
    </div>
    <div class="card-footer">
      <form @submit.prevent="sendMessage">
        <div class="gorm-group">
          <label for="user">User:</label>
          <input type="text" v-model="user" class="form-control">
        </div>
        <div class="gorm-group pb-3">
          <label for="message">Message:</label>
          <input type="text" v-model="message" v-on:keyup="isTyping" class="form-control">
        </div>
        <button type="submit" class="btn btn-success">Send</button>
      </form>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  data() {
    return {
      user: '',
      users: [],
      message: '',
      messages: [],
      typing: [],
      socket : io('localhost:3001')
    }
  },
  methods: {
    sendMessage(e) {
      e.preventDefault();
      
      this.socket.emit('SEND_MESSAGE', {
        user: this.user,
        message: this.message
      });
      
      this.socket.emit('IS_NOT_TYPING', {
        user: this.user
      });

      this.message = ''
    },

    isTyping(e){
      this.socket.emit('IS_TYPING', {
        user: this.user
      });
    },

    isNotTyping(e){
      this.socket.emit('IS_NOT_TYPING', {
        user: this.user
      });
    },
  },
  mounted() {
    this.socket.on('MESSAGE', (data) => {
      this.messages.push(data)
    });

    this.socket.on('ADD_TYPING', (data) => {
      if(!this.typing.includes(data.user)){
        this.typing.push(data.user);
      }
    });

    this.socket.on('REMOVE_TYPING', (data) => {
      
    });
  }
}
</script>

<style scoped>
  
</style>
