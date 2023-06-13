import React, { Component } from 'react'

class User extends Component {
  state = {
    allUsers: [],
    name: '',
    role: '',
    password: '',
    email: '',
    isUpdate: null,
  }

  async componentDidMount() {
    await this.getAllUsers()
  }

  getAllUsers = async () => {
    const res = await fetch('http://localhost:5000/user')
    const data = await res.json()
    this.setState({ allUsers: data.data })
  }

  createUser = async (e) => {
    e.preventDefault()
    if (this.state.isUpdate) {
      await this.updateUser(this.state.isUpdate)
      return
    }
    const json = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      role: this.state.role,
    }
    const res = await fetch('http://localhost:5000/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(json),
    })

    if (res.status === 201) {
      this.setState({
        name: '',
        email: '',
        password: '',
        role: '',
        isUpdate: null,
      })
      await this.getAllUsers()
    } else {
      console.log(res)
    }
  }

  updateUser = async (id) => {
    const json = {
      name: this.state.name,
      email: this.state.email,
      role: this.state.role,
    }
    const res = await fetch(`http://localhost:5000/user/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(json),
    })

    if (res.status === 200) {
      this.setState({
        name: '',
        email: '',
        password: '',
        role: '',
        isUpdate: null,
      })
      await this.getAllUsers()
    } else {
      console.log(res)
    }
  }

  deleteUser = async (id) => {
    const res = await fetch(`http://localhost:5000/user/${id}`, {
      method: 'DELETE',
    })

    if (res.status === 200) {
      await this.getAllUsers()
    } else {
      console.log(res)
    }
  }

  onUserEdit = (user) => {
    this.setState({
      name: user.name,
      email: user.email,
      role: user.role,
      isUpdate: user._id,
    })
  }

  inputChanged = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    return (
      <div>
        <h1>CREATE USER</h1>
        <div className='form'>
          <label htmlFor='name'>Name</label>
          <input
            onChange={this.inputChanged}
            type='text'
            value={this.state.name}
            name='name'
          />
          <br />
          <label htmlFor='email'>Email</label>
          <input
            onChange={this.inputChanged}
            type='email'
            value={this.state.email}
            name='email'
          />
          <br />
          <label htmlFor='password'>Password</label>
          <input
            onChange={this.inputChanged}
            type='password'
            value={this.state.password}
            name='password'
          />
          <br />
          <label htmlFor='role'>Role</label>
          <input
            onChange={this.inputChanged}
            type='text'
            value={this.state.role}
            name='role'
          />
          <br />
          <button onClick={this.createUser}>
            {this.state.isUpdate ? 'Update User' : 'Create User'}
          </button>
        </div>

        <h1>ALL USERS</h1>
        <div className='allUsers'>
          {this.state.allUsers.map((user) => (
            <div key={user._id}>
              <ul>
                <li>Name: {user.name}</li>
                <li>Email: {user.email}</li>
                <li>Role: {user.role}</li>
              </ul>
              <button onClick={() => this.onUserEdit(user)}>Edit User</button>
              <button onClick={() => this.deleteUser(user._id)}>
                Delete User
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default User
