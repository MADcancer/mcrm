import * as types from '../mutation-types'

const state = {
  id: 0,
  name: '',
  roleId: 0, // 角色类型 业务员还是管理员
  channel: '', // 用户渠道
  roleName: ''
}

const getters = {
}

const actions = {
}

const mutations = {
  [types.UPDATE_USER_ID] (state, { id }) {
    state.id = id
  },
  [types.UPDATE_USER_NAME] (state, { name }) {
    state.name = name
  },
  [types.UPDATE_USER_ROLE_ID] (state, { roleId }) {
    state.roleId = roleId
  },
  [types.UPDATE_USER_ROLE_NAME] (state, { roleName }) {
    state.roleName = roleName
  },
  [types.UPDATE_USER_CHANNEL] (state, { channel }) {
    state.channel = channel
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
