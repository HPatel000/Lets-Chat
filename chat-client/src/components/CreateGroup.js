import { Fab } from '@mui/material'
import React, { useEffect, useState } from 'react'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import SearchUsers from './SearchUsers'
import { createGroup } from '../services/chat'
import Alert from '../components/Alert'

const CreateGroup = ({ groupCreated }) => {
  const [groupName, setGroupName] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [groupImg, setGroupImg] = useState('')
  const [alertmsg, setAlertMsg] = useState(null)

  const onUserSelection = (users) => {
    setSelectedUsers(users)
  }

  const onCreateGroup = async () => {
    if (!groupName || selectedUsers.length === 0) {
      let msg = ''
      if (!groupName) msg = 'Please Enter Group Name'
      else if (selectedUsers.length === 0) msg = 'Please Select Group Members'
      setAlertMsg({ message: msg, type: 'danger' })
      setTimeout(() => {
        setAlertMsg(null)
      }, 10000)
      return
    }
    const selectedUsersJson = []
    selectedUsers.forEach((user) => selectedUsersJson.push(user._id))
    const json = {
      name: groupName,
      members: selectedUsersJson,
      profile: groupImg,
    }

    const res = await createGroup(json)
    if (res.status === 201) {
      groupCreated()
    }
  }

  return (
    <div className='create-group'>
      <h2>Create a New Group</h2>
      <div className='create-group-form'>
        <form>
          <label>Group Name</label>
          <input
            className='header-search-input'
            name='name'
            required
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </form>
        <div>
          <label>Add Members</label>
          <SearchUsers multiple={true} onUserSelection={onUserSelection} />
        </div>
      </div>
      <div className='floatingBtn'>
        <Fab aria-label='create group' size='medium' onClick={onCreateGroup}>
          <GroupAddIcon />
        </Fab>
      </div>
      {alertmsg && <Alert message={alertmsg.message} type={alertmsg.type} />}
    </div>
  )
}

export default CreateGroup
