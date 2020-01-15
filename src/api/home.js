import { stringify } from 'qs'
import request from '@/utils/request'

export async function fakeUser (params) {
  return request('/api1/user', {
    method: 'POST',
    body: params
  })
}

export async function queryUser (params) {
  return request(`/api1/user?${stringify(params)}`)
}
