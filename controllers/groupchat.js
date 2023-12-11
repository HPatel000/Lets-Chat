const Chat = require('../models/Chat')

exports.getAllGroupsForUser = async (req, res) => {
  try {
    const user = req.user._id
    const grps = await Chat.find({}).where('members').all([user]).populate({
      path: 'members admin owner',
      select: 'name',
    })
    return res.status(200).json(grps)
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'something went wrong!' })
  }
}

exports.getAllMembersOfGroup = async (req, res) => {
  try {
    const { id } = req.params
    const allMembers = await Chat.findById(id)
      .select('members')
      .populate('members')
    return res.status(200).json(allMembers)
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'something went wrong!' })
  }
}

exports.getOwnerOfGroup = async (req, res) => {
  try {
    const { id } = req.params
    const owner = await Chat.findById(id).select('owner').populate('owner')
    return res.status(200).json(owner)
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'something went wrong!' })
  }
}

exports.getAdminOfGroup = async (req, res) => {
  try {
    const { id } = req.params
    const allAdmin = await Chat.findById(id).select('admin').populate('admin')
    return res.status(200).json(allAdmin)
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'something went wrong!' })
  }
}

// person making the group will be owner and admin of the group
exports.createGroup = async (req, res) => {
  try {
    const user = req.user._id
    let { name, profile, members } = req.body
    if (!members) members = []
    const grp = await Chat.create({
      isGroup: true,
      name: name,
      grpImg: profile,
      members: [user, ...members],
      admin: [user],
      owner: user,
    })

    return res.status(201).json({ message: `Group ${name} created` })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'something went wrong!' })
  }
}

// only admin
exports.addMemberToGroup = async (req, res) => {
  try {
    const { members } = req.body
    const { id } = req.params
    const group = await Chat.findById(id)
    for (let i = 0; i < members.length; i++) {
      const memberIndex = group.members.indexOf(members[i])
      if (memberIndex == -1) {
        group.members.push(members)
      }
    }
    await group.save()
    return res.status(200).json({ message: 'user added successfully' })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'something went wrong!' })
  }
}

// only admin
// multiple members can be removed at once (members is array of ids)
exports.removeMemberFromGroup = async (req, res) => {
  try {
    const { id } = req.params
    const { members } = req.body
    const group = await Chat.findById(id)

    for (let i = 0; i < members.length; i++) {
      const removeId = group.members.indexOf(members[i])
      if (removeId != -1) {
        group.members.splice(removeId, 1)
      }
    }

    await group.save()

    return res.status(200).json({
      success: true,
      message: `${members.length} members are removed from ${group.name} group`,
    })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'something went wrong!' })
  }
}

exports.leaveGroup = async (req, res) => {
  try {
    const user = req.user._id
    const { id } = req.params
    const group = await Chat.findById(id)
    if (!group) {
      return res.status(404).json({ error: 'No group found' })
    }

    if (group.owner.equals(user)) {
      await Chat.findByIdAndDelete(id)
      return res.status(200).json({
        success: true,
        message: `you left ${group.name} group and Group deleted`,
      })
    }
    const userIndex = group.members.indexOf(user)
    if (userIndex != -1) {
      group.members.splice(userIndex, 1)
    }
    const adminIndex = group.admin.indexOf(user)
    if (adminIndex != -1) {
      group.admin.splice(adminIndex, 1)
    }
    await group.save()

    return res
      .status(200)
      .json({ success: true, message: `you left ${group.name} group` })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'something went wrong!' })
  }
}

// only admin
exports.makeMemberAdminOfGroup = async (req, res) => {
  try {
    const { id } = req.params
    const { makeAdmin } = req.body
    const group = await Chat.findById(id)
    const memberIndex = group.members.indexOf(makeAdmin)
    if (memberIndex == -1) {
      return res
        .status(400)
        .json({ error: 'member should be in the group to make admin' })
    }
    group.admin.push(makeAdmin)
    await group.save()

    return res
      .status(200)
      .json({ success: true, message: 'new admin added to group' })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'something went wrong!' })
  }
}

// only owner
// person can remove itself from admin
exports.removeMemberAsAdminOfGroup = async (req, res) => {
  try {
    const { id } = req.params
    const { removeAdmin } = req.body
    const user = req.user._id

    const group = await Chat.findById(id)
    const adminIndex = group.admin.indexOf(user)
    if (adminIndex == -1) {
      return res
        .status(400)
        .json({ error: 'only admin can remove other member from admin' })
    }
    const removeId = group.admin.indexOf(removeAdmin)
    if (removeId != -1) {
      group.admin.splice(removeId, 1)
    }
    await group.save()

    return res
      .status(200)
      .json({ success: true, message: 'member removed from admin' })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'something went wrong!' })
  }
}

// only admin
exports.updateGroupName = async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body
    const user = req.user._id

    const group = await Chat.findByIdAndUpdate(
      id,
      { name: name },
      { new: true, runValidators: true }
    )

    const adminIndex = group.admin.indexOf(user)
    if (adminIndex == -1) {
      return res.status(400).json({ error: 'only admin can change group name' })
    }

    return res
      .status(200)
      .json({ success: true, message: `group name changed to ${group.name}` })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'something went wrong!' })
  }
}

// only admin
exports.updateGroupImage = async (req, res) => {
  try {
    const { id } = req.params
    const { profile } = req.body
    const user = req.user._id

    const group = await Chat.findByIdAndUpdate(
      id,
      { grpImg: profile },
      { new: true, runValidators: true }
    )

    const adminIndex = group.admin.indexOf(user)
    if (adminIndex == -1) {
      return res
        .status(400)
        .json({ error: 'only admin can change group profile image' })
    }
    return res
      .status(200)
      .json({ success: true, message: `group profile changed` })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'something went wrong!' })
  }
}

// only owner
exports.deleteGroup = async (req, res) => {
  try {
    const user = req.user._id
    const { id } = req.params
    const group = await Chat.findById(id)
    if (!group.owner.equals(user)) {
      return res.status(400).json({ error: 'only owner can delete a group' })
    }
    await Chat.findByIdAndDelete(id)
    return res
      .status(200)
      .json({ success: true, message: `${group.name} deleted` })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'something went wrong!' })
  }
}
