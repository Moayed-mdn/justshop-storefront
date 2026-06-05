/**
 * Generic Media Upload API
 * 
 * Unified image upload system for all entities (products, brands, categories, etc.)
 */

const API_BASE = '/api/v1/merchant'

export type MediaContext = 'products' | 'variants' | 'brands' | 'categories' | 'hero' | 'tags' | 'stores'

export interface UploadResponse {
  success: boolean
  data: {
    path: string
    url: string
    full_url: string
  }
  message: string
}

/**
 * Upload an image to a specific context
 */
export async function uploadImage(
  storeId: number,
  context: MediaContext,
  file: File
): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('context', context)
  formData.append('image', file)

  try {
    const response = await $fetch<UploadResponse>(
      `${API_BASE}/stores/${storeId}/media/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    return response
  } catch (error: any) {
    // Extract specific error message from Laravel validation errors
    if (error.data?.errors && typeof error.data.errors === 'object') {
      const firstErrorArray = Object.values(error.data.errors)[0]
      if (Array.isArray(firstErrorArray) && firstErrorArray.length > 0) {
        throw new Error(firstErrorArray[0] as string)
      }
    }
    
    // Fall back to generic message
    if (error.data?.message && error.data.message !== 'Validation failed.') {
      throw new Error(error.data.message)
    }
    
    throw new Error('Upload failed. Please try again.')
  }
}

/**
 * Delete an image from a specific context
 */
export async function deleteImage(
  storeId: number,
  context: MediaContext,
  path: string
): Promise<void> {
  try {
    await $fetch(
      `${API_BASE}/stores/${storeId}/media/delete`,
      {
        method: 'DELETE',
        body: {
          context,
          path,
        },
      }
    )
  } catch (error: any) {
    // Extract specific error message from Laravel validation errors
    if (error.data?.errors && typeof error.data.errors === 'object') {
      const firstErrorArray = Object.values(error.data.errors)[0]
      if (Array.isArray(firstErrorArray) && firstErrorArray.length > 0) {
        throw new Error(firstErrorArray[0] as string)
      }
    }
    
    // Fall back to generic message
    if (error.data?.message && error.data.message !== 'Validation failed.') {
      throw new Error(error.data.message)
    }
    
    throw new Error('Delete failed. Please try again.')
  }
}
