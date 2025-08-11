import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ErrorLog {
  err: Error
  vm: any
  info: string
  url: string
  time: number
}

export const useErrorLogStore = defineStore('errorLog', () => {
  const logs = ref<ErrorLog[]>([])

  const addErrorLog = (log: ErrorLog) => {
    logs.value.push(log)
  }

  const clearErrorLog = () => {
    logs.value.splice(0)
  }

  return {
    logs,
    addErrorLog,
    clearErrorLog
  }
})