import { Button } from '@renderer/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@renderer/components/ui/dialog'
import { Field, FieldGroup } from '@renderer/components/ui/field'
import { Input } from '@renderer/components/ui/input'
import { useRepoStore } from '@renderer/stores/repo'
import { Repository } from '@shared/types'
import { Plus, Upload } from 'lucide-react'
import { useRef, useState, type ChangeEvent } from 'react'
import { toast } from 'sonner'
import { z, ZodError } from 'zod'
import { v4 } from 'uuid'

export default function ImportRepoDialog() {
  const repoIsExists = useRepoStore((s) => s.repoIsExists)
  const setRepo = useRepoStore((s) => s.setRepo)
  const pushRepo = useRepoStore((s) => s.pushRepo)

  const [repoUrl, setRepoUrl] = useState<string>('')
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const inputUploadRef = useRef<HTMLInputElement>(null)
  const inputURLRef = useRef<HTMLInputElement>(null)

  const RepositoryItemSchema = z.object({
    title: z.string().min(1, 'Title cannot be empty'),
    magnetURI: z.string().min(1, 'Magnet URI cannot be empty'),
    poster: z.string().min(1, 'Poster cannot be empty'),
    size: z.number().min(1, 'Size cannot be empty'),
    published_date: z.number().min(1, 'Publication date cannot be empty')
  })

  const RepositorySchema = z.object({
    name: z.string().min(1, 'Name cannot be empty'),
    version: z.string().min(1, 'Version cannot be empty'),
    description: z.string().min(1, 'Description cannot be empty'),
    author: z.string().min(1, 'Author cannot be empty'),
    items: z.array(RepositoryItemSchema).min(1, 'Items list cannot be empty')
  })

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handlerUploadByURL = async () => {
    if (!repoUrl.trim()) {
      toast.error('Enter repository URL')
      inputURLRef.current?.focus()
      setRepoUrl('')
      return
    }

    if (!validateUrl(repoUrl)) {
      toast.error('Incorrect URL address')
      inputURLRef.current?.focus()
      setRepoUrl('')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(repoUrl, {
        headers: {
          Accept: 'application/json'
        }
      })

      if (!response.ok) {
        toast.error(`HTTP error! Status: ${response.status}`)
        inputURLRef.current?.focus()
        setRepoUrl('')
        setIsLoading(false)
        return
      }

      const rawData = await response.json()

      const raw_repository = RepositorySchema.parse(rawData)
      const repository: Repository = {
        ...raw_repository,
        id: v4(),
        type: 'remote',
        url: repoUrl
      }

      if (repoIsExists(repository)) {
        toast.info('Repository already exists')
        setIsLoading(false)
        return
      }

      setRepo(repository.id)
      pushRepo(repository)

      toast.success('Repository imported')
      setDialogIsOpen(false)
      inputURLRef.current?.focus()
      setRepoUrl('')
    } catch (error) {
      if (error instanceof ZodError) {
        if (error.issues.length > 3) {
          toast.error('Validation Error', {
            description: 'Incorrect remote repository',
            duration: 10000
          })
        } else {
          const errors = error.issues
            .map((err) => `${err.path.join('.')}: ${err.message}`)
            .join(', ')
          toast.error('Validation Error', {
            description: errors,
            duration: 10000
          })
        }
      } else if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          toast.error('Connection error', {
            description: 'Server returned invalid CORS headers',
            duration: 10000
          })
        } else {
          toast.error('Request error', {
            description: error.message,
            duration: 10000
          })
        }
      } else {
        toast.error('JSON Parsing Error', {
          duration: 10000
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handlerUploadButtonClicked = () => {
    inputUploadRef.current?.click()
  }

  const handlerUploadByFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const rawData = JSON.parse(e.target?.result as string)

        const raw_repository = RepositorySchema.parse(rawData)
        const repository: Repository = {
          ...raw_repository,
          id: v4(),
          type: 'local',
          url: undefined
        }

        if (repoIsExists(repository)) {
          toast.info('Repository already exists')
          setIsLoading(false)
          return
        }

        setRepo(repository.id)
        pushRepo(repository)

        toast.success('Repository imported')
      } catch (error) {
        if (error instanceof ZodError) {
          const errors = error.issues
            .map((err) => `${err.path.join('.')}: ${err.message}`)
            .join(', ')
          toast.error('Validation Error', {
            description: errors,
            duration: 10000
          })
        } else {
          toast.error('JSON Parsing Error', {
            duration: 10000
          })
        }
      }
    }
    reader.readAsText(file)
    setDialogIsOpen(false)
    setRepoUrl('')
  }
  return (
    <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
      <Button variant="outline" size="sm" onClick={() => setDialogIsOpen(true)}>
        <Plus /> Import
      </Button>
      <DialogContent className="min-w-xl">
        <DialogHeader>
          <DialogTitle>Import Repository</DialogTitle>
          <DialogDescription>
            Import the repository by uploading a JSON file or specifying a link to a remote
            repository.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup className="mt-2">
          <Field orientation="horizontal">
            <Input
              type="text"
              placeholder="Repository URL (JSON)"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              ref={inputURLRef}
              disabled={isLoading}
            />
            <Button onClick={handlerUploadByURL} variant="outline" disabled={isLoading}>
              Import
            </Button>
          </Field>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
          </div>
          <Input
            type="file"
            className="sr-only"
            ref={inputUploadRef}
            accept=".json"
            onChange={handlerUploadByFile}
          ></Input>
          <Button variant="outline" onClick={handlerUploadButtonClicked} disabled={isLoading}>
            <Upload /> Upload JSON file
          </Button>
        </FieldGroup>
      </DialogContent>
    </Dialog>
  )
}
