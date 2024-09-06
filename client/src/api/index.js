import axios from "axios";


export const api = axios.create({
  baseURL: `${import.meta.env.API_URL}`
})

// User API
export const get_all_user = async () => {
  return api.get(`/api/v1/users`)
    .then((res) => res.data)
    .catch((err) => { throw err.response });
};

export const get_user_by_id = async (id) => {
  return api.get(`/api/v1/users/${id}`)
    .then((res) => res.data)
    .catch((err) => { throw err.response });
};

export const update_user_by_id = async (id) => {
  return api.put(`/api/v1/users/${id}`)
    .then((res) => res.data)
    .catch((err) => { throw err.response })
}

// Auth API
export const user_login = async (data) => {
  return api.post(`/api/v1/auth/login`, data)
    .then((res) => res.data)
    .catch((err) => { throw err.response });
};

export const user_register = async (data) => {
  return api.post(`/api/v1/auth/register`, data)
    .then((res) => res.data)
    .catch((err) => { throw err.response });
};

export const user_verify = async (id) => {
  return api.get(`/api/v1/auth/verify/${id}`)
  .then((res) => res.data)
  .catch((err) => { throw err.response });
}

export const forgot_password = async (email) => {
  return api.post(`/api/v1/auth/forgot-password`, { email })
    .then((res) => res.data)
    .catch((err) => { throw err.response });
};

export const reset_password = async (id, newPassword) => {
  return api.post(`/api/v1/auth/reset-password`, { id, newPassword })
    .then((res) => res.data)
    .catch((err) => { throw err.response });
};

// Message API
export const get_messages = async (sender_id, receiver_id) => {
  return api.get(`/api/v1/messages/${sender_id}/${receiver_id}`)
    .then((res) => res.data)
    .catch((err) => { throw err.response });
};

export const send_message = async (data) => {
  return api.post(`/api/v1/messages`, data)
    .then((res) => res.data)
    .catch((err) => { throw err.response });
};