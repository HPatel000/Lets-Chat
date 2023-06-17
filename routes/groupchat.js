const express = require('express')
const {
  getAllGroupsForUser,
  getAllMessagesForGroup,
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
  deleteGroup,
  leaveGroup,
} = require('../controllers/groupchat')
const {
  authenticate,
  isAdminofGroup,
  isOwnerofGroup,
} = require('../middlewares/auth')

const groupChatRouter = express.Router()

groupChatRouter
  .get('', authenticate, getAllGroupsForUser)
  .get('/messages/:id', authenticate, getAllMessagesForGroup)
  .get('/members/:id', authenticate, getAllMembersOfGroup)
  .get('/owner/:id', authenticate, getOwnerOfGroup)
  .get('/admin/:id', authenticate, getAdminOfGroup)
  .post('', authenticate, createGroup)
  .put('/member/add/:id', authenticate, isAdminofGroup, addMemberToGroup)
  .put(
    '/member/remove/:id',
    authenticate,
    isAdminofGroup,
    removeMemberFromGroup
  )
  .put('/member/leave/:id', authenticate, leaveGroup)
  .put('/admin/add/:id', authenticate, isAdminofGroup, makeMemberAdminOfGroup)
  .put(
    '/admin/remove/:id',
    authenticate,
    isAdminofGroup,
    removeMemberAsAdminOfGroup
  )
  .put('/updatename/:id', authenticate, isAdminofGroup, updateGroupName)
  .put('/updateprofile/:id', authenticate, isAdminofGroup, updateGroupImage)
  .delete('/:id', authenticate, isOwnerofGroup, deleteGroup)

module.exports = groupChatRouter
