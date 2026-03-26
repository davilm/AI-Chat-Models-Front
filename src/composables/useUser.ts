import { ref, computed } from 'vue'

const USER_KEY = 'monitor_user'

const userName = ref<string | null>(localStorage.getItem(USER_KEY))

const isIdentified = computed(() => !!userName.value)

function setUser(name: string): void {
  userName.value = name.trim()
  localStorage.setItem(USER_KEY, name.trim())
}

function clearUser(): void {
  userName.value = null
  localStorage.removeItem(USER_KEY)
}

export function useUser() {
  return { userName, isIdentified, setUser, clearUser }
}
