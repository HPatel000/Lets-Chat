const express = require('express')
const {
  getAllMembersOfGroup,
  getOwnerOfGroup,
  getAdminOfGroup,
  createGroup,
  addMemberToGroup,
  removeMemberFromGroup,
  makeMemberAdminOfGroup,
  removeMemberAsAdminOfGroup,
  updateGroupName,
  updateGroupImage,
  leaveGroup,
} = require('../controllers/groupchat')
const { isAdminofGroup } = require('../middlewares/auth')

const groupChatRouter = express.Router()

groupChatRouter
  .get('/members/:id', getAllMembersOfGroup)
  .get('/owner/:id', getOwnerOfGroup)
  .get('/admin/:id', getAdminOfGroup)
  .post('', createGroup)
  .put('/member/add/:id', isAdminofGroup, addMemberToGroup)
  .put('/member/remove/:id', isAdminofGroup, removeMemberFromGroup)
  .put('/member/leave/:id', leaveGroup)
  .put('/admin/add/:id', isAdminofGroup, makeMemberAdminOfGroup)
  .put('/admin/remove/:id', isAdminofGroup, removeMemberAsAdminOfGroup)
  .put('/updatename/:id', isAdminofGroup, updateGroupName)
  .put('/updateprofile/:id', isAdminofGroup, updateGroupImage)

module.exports = groupChatRouter
