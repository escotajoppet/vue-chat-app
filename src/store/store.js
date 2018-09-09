import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
	state: {
		users: [],
		messages: [],
		typing: [],
		notifications: []
	},

	mutations: {
		addUser: (state, data) => {
			state.users.push(data);
		},

		removeUser: (state, data) => {
			for (var i = 0; i < state.users.length; i++){
        if (state.users[i].socket_id === data) {
          state.users.splice(i, 1);
          break;
        }
      }
		},

		addTyping: (state, data) => {
			if(!state.typing.includes(data)) state.typing.push(data);
		},

		removeTyping: (state, data) => {
			if(state.typing.includes(data)){
        var i = state.typing.indexOf(data);
        state.typing.splice(i, 1);
      }
		},

		addMessage: (state, data) => {
			state.messages.push(data);
		},

		addNotification: (state, data) => {
			state.notifications.push(data);
		}
	},

	actions: {
		addUser: (context, data) => {
			context.commit('addUser', data);
		},

		removeUser: (context, data) => {
			context.commit('removeUser', data);
		},

		addTyping: (context, data) => {
			context.commit('addTyping', data);			
		},

		removeTyping: (context, data) => {
			context.commit('removeTyping', data);
		},

		addMessage: (context, data) => {
			context.commit('addMessage', data);
		},

		addNotification: (context, data) => {
			context.commit('addNotification', data);
		}
	}
})