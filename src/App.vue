<template>
  <div class="row">
    <div class="container">
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
          <div class="col-3" id="users-list">
            <ul>
              <li v-for="user_data in users" v-show="user != user_data.user.user">
                <a href="#" class="btn-block users" v-on:click="tagUser(user_data.user.user)">{{ user_data.user.user }}</a>
              </li>
            </ul>
          </div>
          <div class="col-9" style="padding-left: 0;">
            <div class="card-body" id="group-chat-container">
              <div class="card-title">
                <h6>Vue JS Chat App</h6>
                <hr>
              </div>

              <div class="card-body" id="messages">
                <div class="messages" v-for="(msg, index) in messages" :key="index">
                  <p><span class="font-weight-bold">{{ msg.user }}: </span>{{ msg.message }}</p>
                </div>
              </div>

              <p v-if="typing.length">{{ typing.join(', ') }} is typing...</p>
            </div>

            <div class="card-footer">
              <form @submit.prevent="sendMessage">
                <input type="text" v-model="message" v-on:keyup="isTyping" class="form-control">
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
      socket_id: '',
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
      
      if(this.message !== ''){
        this.socket.emit('SEND_MESSAGE', {
          user: this.user,
          message: this.message
        });

        this.message = ''
      }
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
    },

    logOutUser(){
      this.socket.emit('DISCONNECT', {
        user: this.user
      });
    },

    tagUser(user){
      this.message += `<span v-html class="user-tag">@${user}</span>`;
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
      this.socket_id = data.socket_id
      this.$store.state.users.push(data);
    });

    this.socket.on('DISCONNECTED_USER', (data) => {
      for (var i = 0; i < this.$store.state.users.length; i++){
        if (this.$store.state.users[i].socket_id === data) {
          this.$store.state.users.splice(i, 1);
          break;
        }
      }
    });
  }
}
</script>

<style scoped>
  li{
    padding: 0;
    border-bottom: 1px solid #eee;
  }

  ul{
    padding-left: 15px;
    text-align: center;
    list-style: none;
  }

  container{
    padding: 0;
  }

  #users-list{
    border-right: 1px solid #eee; 
    padding: 0;
  }

  .group-chat-container{
    height: 320px;
  }

  #messages{
    overflow-y: scroll;
    height: 215px;
  }

  .users{
    padding: 10px;
    text-decoration: none;
  }

  [type=text]{
    text-align: right;
  }

  .user-tag{
    color: lightgreen;
  }
</style>
