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
              <li v-for="user in users">{{ user }}</li>
            </ul>
          </div>
          <div class="col-9">
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

            <div style="padding: 20px;">
              <hr>
              users: {{ users.join(', ') }}
              <br>
              typing: {{ typing.join(', ') }}
              <br>
              messages: {{ messages.join(', ') }}
            </div>

            <div class="card-footer">
              <form @submit.prevent="sendMessage">
                <div class="gorm-group pb-3">
                  <label for="message">Message:</label>
                  <input type="text" v-model="message" v-on:keypress="isTyping" class="form-control">
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
      
    });

    this.socket.on('REMOVE_TYPING', (data) => {
      
    });

    this.socket.on('SIGNED_IN_USER', (data) => {
      this.$store.state.users.push(data.user);
    });
  }
}
</script>

<style scoped>
  
</style>
