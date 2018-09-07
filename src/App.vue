<template>
 <div class="row">
    <div class="container" style="padding: 0;">
      <div v-if="user.length <= 0">
        <div class="card mt-3">
          <div class="card-body">
            <div class="card-title">
              <h3>Log in</h3>
              <hr>
            </div>
            <div class="card-body">
              <div class="form-group">
                <input type="text" ref="user" @keypress.enter="logInUser" class="form-control">
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-show="user" class="card mt-3">
        <div class="row">
          <div class="col-3" style="border-right: 1px solid #eee; padding: 0;">
            <ul>
              <li v-for="user in users" style="list-style: none;">{{ user }}</li>
            </ul>
          </div>
          <div class="col-9" style="padding-left: 0;">
            <div class="card-body">
              <div class="card-title">
                <h3>Chat Group</h3>
                <hr>
              </div>

              <div class="card-body">
                <div class="messages" v-for="(msg, index) in messages" :key="index">
                  <p><span class="font-weight-bold">{{ msg.user }}: </span>{{ msg.message }}</p>
                </div>

                <p v-if="typing.length">{{ typing.join(', ') }} is typing...</p>
              </div>
            </div>

            <div class="card-footer">
              <form @submit.prevent="sendMessage">
                <div class="gorm-group pb-3">
                  <label for="message">Message:</label>
                  <input type="text" v-model="message" v-on:keyup="isTyping" class="form-control">
                </div>
                
                <button type="submit" class="btn btn-success">Send</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
 </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  data() {
    return {
      user: '',
      message: '',
      socket : io('localhost:3001')
    }
  },
  computed: {
    users(){
      return this.$store.state.users
    },
    messages(){
      return this.$store.state.messages
    },
    typing(){
      return this.$store.state.typing
    }
  },
  methods: {
    sendMessage(e) {
      e.preventDefault();
      
      this.socket.emit('SEND_MESSAGE', {
        user: this.user,
        message: this.message
      });

      this.message = ''
    },

    isTyping(e){
      if(e.key != 'Enter'){
        this.socket.emit('IS_TYPING', this.user);
      }
    },

    isNotTyping(e){
      this.socket.emit('IS_NOT_TYPING', this.user);
    },

    logInUser(){
      this.user = this.$refs.user.value;

      this.socket.emit('SIGN_IN', {
        user: this.user
      });
    }
  },
  mounted() {
    this.socket.on('MESSAGE', (data) => {
      this.$store.state.messages.push(data)
    });

    this.socket.on('ADD_TYPING', (data) => {
      if(!this.$store.state.typing.includes(data)){
        this.$store.state.typing.push(data);
      }
    });

    this.socket.on('REMOVE_TYPING', (data) => {
      if(this.$store.state.typing.includes(data.user)){
        var i = this.$store.state.typing.indexOf(data.user);
        this.$store.state.typing.splice(i, 1);
      }
    });

    this.socket.on('SIGNED_IN_USER', (data) => {
      this.$store.state.users.push(data.user);
    });
  }
}
</script>

<style scoped>
  
</style>
