
"use client"
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button'
import { formUrlQuery } from '@/lib/utils'

function Pagination({urlParamName, page, totalPages}: {urlParamName?: string, page: number | string, totalPages: number}) {  
 const router = useRouter()
 const searchParams = useSearchParams()
 const onClick = (btnType: string) => {
        const newPage = btnType === 'next' ? Number(page) + 1 : Number(page) - 1
       
        
    const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: urlParamName || 'page',
        value: newPage.toString(),
      })
  
      router.push(newUrl, {scroll: false})
 }

    return (
   <div className="flex justify-between gap-2">
      <Button
        size="lg"
        variant="outline"
        className="w-28 bg-pink-600 rounded-xl"
        onClick={() => onClick('prev')}
        disabled={Number(page) <= 1}
      >
        Previous
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="w-28 bg-pink-600 rounded-xl"
        onClick={() => onClick('next')}
        disabled={Number(page) >= totalPages}
      >
        Next
      </Button>
    </div>
  )
}

export default Pagination