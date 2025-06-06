import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react'

interface paginationProps{
     currentPage:number;
     totalPage:number;
     onPageChange:(page:number)=> void
}

const pagination : React.FC<paginationProps>=({currentPage, totalPage, onPageChange}) => {
  return (
    <div className='flex  items-center justify-center gap-2'>
        <Button variant="outline" size="icon" disabled={currentPage===1} onClick={() => onPageChange(Math.max(1, currentPage-1))}>
            <ChevronLeft className='h-4 w-4'/>
        </Button>
        {Array.from({length:totalPage}, (_,i)=>i+1).map((page) => (
            <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            className={currentPage === page ? `bg-blue-500 text-black` : ``}
            onClick={() => onPageChange(page)}>
                {page}
            </Button>
        ))}
         <Button variant="outline" size="icon" disabled={currentPage===totalPage} onClick={() => onPageChange(Math.min(totalPage, currentPage+1))}>
            <ChevronRight className='h-4 w-4'/>
        </Button>
    </div>
  )
}

export default pagination
