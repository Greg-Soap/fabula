import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'

export interface SeriesFetchPayload {
  title?: string
  shortDescription?: string
  longDescription?: string
  rating?: number
  numberOfSeasons?: number
  trailerUrl?: string
  coverImageUrl?: string
  tmdbId?: number
  backdropUrl?: string
  genre?: string
  releaseYear?: number
}

function fetchSeriesInfo(query: string): Promise<SeriesFetchPayload> {
  return axios
    .post<SeriesFetchPayload>('/dashboard/series/fetch-info', { query }, { withCredentials: true })
    .then((res) => res.data)
}

export function useFetchSeriesInfo(
  options: { onSuccess?: (data: SeriesFetchPayload) => void; successMessage?: string } = {},
) {
  const mutation = useMutation({
    mutationFn: ({ query }: { query: string }) => {
      const trimmed = query.trim()
      if (!trimmed) return Promise.reject(new Error('Query is required'))
      return fetchSeriesInfo(trimmed)
    },
    onSuccess: (data) => {
      options.onSuccess?.(data)
      toast.success(
        options.successMessage ??
          'Series info filled. Add your rating and personal review, then save.',
      )
    },
    onError: (err: unknown) => {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) toast.error('No series found.')
        else if (err.response?.data?.message) toast.error(String(err.response.data.message))
        else toast.error('Failed to fetch series info.')
      } else {
        toast.error('Failed to fetch series info.')
      }
    },
  })

  return {
    mutate: (query: string) => mutation.mutate({ query }),
    isPending: mutation.isPending,
    data: mutation.data,
  }
}
