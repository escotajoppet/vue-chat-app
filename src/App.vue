<template>
  <div>
    <div class="row" id="chat-container">
      <div class="col-sm-3" id="app-users">
        <ul>
          <li v-for="user in users" v-bind:class="user.status">
            <a class="btn-block" href="#">{{ user.name }} : {{ user.status }}</a>
          </li>
        </ul>
      </div>

      <div class="col-sm-9" id="app-chatbox">
        <div class="card">
          <div class="card-body">
            <p v-for="message in messages">{{ message.sender }}: {{ message.message }}</p>
          </div>
          <div class="card-footer">
            <input type="text" v-on:keyup.enter="sendMessage" ref="message" id="chat-text" placeholder="Type your message here...">
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade bd-example-modal-sm" v-bind:class="status" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" v-bind:style="modal_style">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title h4" id="mySmallModalLabel">Enter your name</h4>
          </div>
          <div class="modal-body">
            <input type="text" ref="name" v-on:keyup.enter="logName" class="form-control form-block" id="name" placeholder="Enter your name...">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [
        { name: 'Positive Resilient', status: 'online' },
        { name: 'IP Port', status: 'offline' },
        { name: 'Forbes', status: 'offline' },
        { name: 'AoC', status: 'online' },
        { name: 'Mrs. Fields', status: 'offline' }
      ],

      messages: [

      ],

      status: 'show',
      sender: 'Anonymous',
      modal_style: 'display: block;'
    }
  },

  methods:{
    logName(){
      this.status = '';
      this.modal_style = 'display: none;';
      this.sender = this.$refs.name.value;
      this.users.push({ name: this.sender, status: 'online' })
    },

    sendMessage(){
      this.messages.push({ sender: this.sender, message: this.$refs.message.value })
      this.scrollBottom();
      this.$refs.message.value = '';
    },

    scrollBottom(){
      var container = document.querySelector('.card-body');
      var scrollHeight = container.scrollHeight;
      container.scrollTop = scrollHeight;
    }
  }
}
</script>

<style scoped>
  .row{
    margin: 0;
  }

  .status{
    height: 10px;
    width: 10px;
  }

  #app-users{
    padding: 0;
    border: 1px solid #aaa;
    border-radius: 5px;
    overflow-y: scroll;
  }

  ul{
    list-style: none;
    padding: 0;
    margin-bottom: 0;
  }

  li{
    margin-top: 0 !important;
    padding: 10px 0;
    border-bottom: 1px solid #888;
    text-align: center;
  }

  li:last-child{
    border-bottom: none; 
  }

  a:hover{
    text-decoration: none;
  }

  .online{
    background: lightgreen;
  }

  .offline{
    background: pink;
  }

  .card-footer{
    padding: 0;
    height: 100%;
  }

  #chat-text{
    width: 100%;
    height: 40px;
    border: none;
    padding: 15px;
    text-align: right;
  }

  #name{
    text-align: right;
  }

  .card{
    padding: 0;
  }

  #app-chatbox{
    padding: 0;
    height: 393;
  }

  #chat-container{
    height: 393;
    max-height: 393;
  }

  .card-body{
    height: 350px;
    max-height: 350px;
    overflow-y: scroll;
  }
</style>
