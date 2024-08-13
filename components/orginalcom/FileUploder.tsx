'use client'

import { useCallback, Dispatch, SetStateAction } from 'react'
// import type { FileWithPath } from '@uploadthing/react'
import { useDropzone } from '@uploadthing/react/hooks'
import { generateClientDropzoneAccept } from 'uploadthing/client'

import { Button } from '@/components/ui/button'
import { convertFileToUrl } from '@/lib/utils'
import { DocumentUpload } from 'iconsax-react'

type FileUploaderProps = {
  onFieldChange: (url: string) => void
  imageUrl: string
  setFiles: Dispatch<SetStateAction<File[]>>
}
type FileWithPath = File & {
  path?: string;
};


export function FileUploader({ onFieldChange , imageUrl , setFiles }: FileUploaderProps) {


  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
  setFiles(acceptedFiles)
  onFieldChange(convertFileToUrl(acceptedFiles[0]))
}, [setFiles, onFieldChange])


  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*' ? generateClientDropzoneAccept(['image/*']) : undefined,
  })

  return (
    <div
      {...getRootProps()}
      className=" justify-center items-center  flex h-72 cursor-pointer flex-col overflow-hidden border-[#4b4b4b92]  border-dashed border-[1.6px] rounded-xl ">
      <input {...getInputProps()} className="cursor-pointer" />

      {imageUrl ? (
        <div className="flex h-full w-full  flex-1 justify-center ">
          <img
            src={imageUrl}
            alt="image"
            width={250}
            height={250}
            className="w-full object-contain object-center"
          />
        </div>
      ) : (
        <div className="flex flex-col py-5 items-center justify-center  text-grey-500"> 
        <DocumentUpload size={34} color="#d9e3f0"/>
          <h3 className="mb-2  mt-2">Drag photo here</h3>
          <p className="p-medium-12 mb-4">SVG, PNG, JPG</p>
          <Button type="button" className=" hover:bg-pink-600 rounded-full bg-[#e41f7b] ">
            Select from computer
          </Button>
        </div>
      )}
    </div>
  )
}