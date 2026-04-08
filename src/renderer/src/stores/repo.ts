import { Repository } from '@shared/types'
import { ipc } from '@shared/vars'
import { create } from 'zustand'

type RepoStore = {
  repository: string | null
  repositories: Repository[]
  repoIsExists: (repository: Repository) => boolean
  setRepo: (id: string) => void
  pushRepo: (repository: Repository) => Promise<void>
  removeRepo: (name: string, version: string) => void
  init: () => Promise<void>
}

export const useRepoStore = create<RepoStore>((set, get) => ({
  repository: null,
  repositories: [],
  repoIsExists: (repository: Repository) => {
    const state = get()
    return state.repositories.some(
      (repo) => repo.name === repository.name && repo.version === repository.version
    )
  },
  setRepo: (id: string) => {
    set({ repository: id })
    window.electron.ipcRenderer.send(ipc.storageSetRepo, id)
  },
  pushRepo: async (repository: Repository) => {
    set((state) => ({
      repositories: [...state.repositories, repository]
    }))
    window.electron.ipcRenderer.send(ipc.storagePushRepo, repository)
  },
  removeRepo: (name: string, version: string) =>
    set((state) => {
      const filteredRepositories = state.repositories.filter(
        (repository) => repository.name !== name && repository.version !== version
      )
      return {
        repositories: filteredRepositories,
        repository: filteredRepositories.length === 0 ? null : filteredRepositories[0].id
      }
    }),
  init: async () => {
    const repos: Repository[] = await window.electron.ipcRenderer.invoke(ipc.storageGetRepos)
    const repoId: string | null = await window.electron.ipcRenderer.invoke(ipc.storageGetRepo)
    set({
      repositories: repos,
      repository: repoId
    })
  }
}))
