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
                <a href="#" class="btn-block notifications" v-show="notif.tagged_socket_id == socket_id" v-scroll-to="`#${notif.notification_id}`" v-on:click="removeNotification(notif.notification_id)">{{ notif.sender }} mentioned you.</a>
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
                    <div class="messages-body" v-bind:id="msg.message_id">
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
      user_id: '',
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
        data.tagged_socket_id = match['1'];
        data.tagged_user = this.getUserFromSocketId(match['1']);
        data.sender = this.getUserFromSocketId(this.socket_id);
        data.sender_socket_id = this.socket_id;
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
      this.user_id =  Math.floor(100000 + Math.random() * 900000);
      let user_details = { user: this.user, user_id: this.user_id }
      
      this.socket.emit('SIGN_IN', user_details);
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
    },

    removeNotification(notification_id){
      this.$store.dispatch('removeNotification', notification_id)
    }
  },

  mounted() {
    this.socket.on('MESSAGE', (data) => {
      this.$store.dispatch('addMessage', data);

      var convo_container = document.getElementById('conversation');
      convo_container.scrollTop = convo_container.scrollHeight;
    });

    this.socket.on('ADD_TYPING', (data) => {
      this.$store.dispatch('addTyping', data);
    });

    this.socket.on('REMOVE_TYPING', (data) => {
      this.$store.dispatch('removeTyping', data);
    });

    this.socket.on('SIGNED_IN_USER', (data) => {
      if( this.user_id == data.user_id ) {
        this.socket_id = data.socket_id
      }
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
