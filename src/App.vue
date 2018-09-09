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
          <div class="col-3" id="users-notifications-list">
            <ul id="users-list">
              <li class="header">Users</li>
              <li v-for="user_data in users" v-show="user != user_data.user">
                <a href="#" class="btn-block users" v-on:click="tagUser(user_data.socket_id, user_data.user)">{{ user_data.user }}</a>
              </li>
            </ul>

            <ul id="notifications-list">
              <li class="header">Notifications</li>
              <li v-for="notif in notifications">
                {{ notif }} - ---{{socket_id}}---
                <a href="#" class="btn-block notifications" v-show="notif.tagged_socket_id == socket_id">{{ getUserFromSocketId(notif.sender) }} mentioned you.</a>
              </li>
            </ul>
          </div>

          <div class="col-9" id="group-chat-container">
            <div class="card-body" id="group-chat">
              <div class="card-title">
                <h6>Vue JS Chat App</h6>
                <hr>
              </div>

              <div class="card-body" id="conversation">
                <div v-for="(msg, index) in messages" :key="index" class="messages">
                  <div v-show="msg.user == user">
                    <div class="messages-body my-messages">
                      <div class="message">
                        <span v-html="msg.message"></span>
                      </div>
                    </div>
                  </div>

                  <div v-show="msg.user != user">
                    <div class="messages-body">
                      <div class="sender">
                        {{ msg.user }}
                      </div>

                      <div class="message">
                        <span v-html="msg.message"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p v-if="typing.length">{{ typing.join(', ') }} {{ typing.length > 1 ? 'are' : 'is' }} typing...</p>
            </div>

            <div class="card-footer">
              <form @submit.prevent="sendMessage">
                <input type="text" ref="message_field" v-model="message" v-on:keyup="isTyping" class="form-control">
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
import { mapActions } from 'vue';
import { mapGetters } from 'vue';

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
      return this.$store.state.users;
    },

    messages(){
      return this.$store.state.messages;
    },

    typing(){
      return this.$store.state.typing;
    },
    
    notifications(){
      return this.$store.state.notifications;
    }
  },

  methods: {
    sendMessage(e) {
      e.preventDefault();
      
      if(this.message == '') return;

      let data = { 
        user: this.user, 
        message: this.message, 
        socket_id: this.socket_id 
      };

      const REGEX = /:::(.*?):::/;
      const match = REGEX.exec(this.message);

      if(match) {
        data.tagged_user = this.getUserFromSocketId(match['1']);

        var notif_data = {
          tagged_user: data.tagged_user,
          tagged_socket_id: match['1']
        }

        this.socket.emit('NOTIFY_USER', notif_data);
      }

      this.socket.emit('SEND_MESSAGE', data);

      this.message = '';
    },

    isTyping(e){
      if(e.key != 'Enter') this.socket.emit('IS_TYPING', this.user);
    },

    isNotTyping(e){
      this.socket.emit('IS_NOT_TYPING', this.user);
    },

    logInUser(){
      this.user = this.$refs.user.value;

      this.socket.emit('SIGN_IN', this.user);
    },

    logOutUser(){
      this.socket.emit('DISCONNECT', this.user);
    },

    tagUser(socket_id, user){
      this.message += `:::${socket_id}:::`;

      this.$refs.message_field.focus();
    },

    getUserFromSocketId(socket_id){
      for (var user of this.users) {
        if(user.socket_id == socket_id) return user.user
      }
    }
  },

  mounted() {
    this.socket.on('MESSAGE', (data) => {
      this.$store.dispatch('addMessage', data);
    });

    this.socket.on('ADD_TYPING', (data) => {
      this.$store.dispatch('addTyping', data);
    });

    this.socket.on('REMOVE_TYPING', (data) => {
      this.$store.dispatch('removeTyping', data);
    });

    this.socket.on('SIGNED_IN_USER', (data) => {
      this.socket_id = data.socket_id
      this.$store.dispatch('addUser', data);
    });

    this.socket.on('DISCONNECTED_USER', (data) => {
      this.$store.dispatch('removeUser', data);
    });

    this.socket.on('NOTIFY', (data) => {
      this.$store.dispatch('addNotification', data);
    });
  }
}
</script>

<style lang="scss" scoped>
  $border-style: 1px solid #eee;

  .container{
    padding: 0;

    #users-notifications-list{
      border-right: $border-style; 
      padding: 0;

      .header{
        border-bottom: $border-style;
      }

      #users-list{
        height: 50%;
        max-height: 50%
      }

      #notifications-list{
        height: 50%;
        max-height: 50%;

        .header{
          border-top: $border-style;
        }
      }

      a.users, a.notifications{
        padding: 10px;
        text-decoration: none;
      }

      ul{
        list-style: none;
        text-align: center;
        padding-left: 15px;
        overflow-y: scroll;

        li{
          border-bottom: $border-style;
        }
      }
    }

    #group-chat-container{
      padding-left: 0;

      #group-chat{
        height: 320px;
      }

      #conversation{
        overflow-y: scroll;
        height: 215px;
        padding: 10px;

        .messages{
          margin-bottom: 5px;

          .messages-body{
            width: fit-content;
            max-width: 250px;

            .sender{
              font-weight: bold;
            }

            .message{
              background: #ededed;
              border-radius: 5px;
              padding: 10px;
              margin-top: 7px;
            }
          }

          .my-messages{
            margin: 0 0 0 auto;
            text-align: right;
          }
        }
      }

      [type=text]{
        text-align: right;
      }
    }
  }
</style>
