'use client'
import { Accordion, AccordionItem } from '@/components/ui/accordion'
import { filters } from '@/lib/Constant'
import { AccordionContent, AccordionTrigger } from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {formatDistanceToNow} from 'date-fns'
import BookLoader from '@/lib/BookLoader'
import { motion } from "motion/react"
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import Pagination from '../components/pagination'
import NoData from '../components/NoData'
import { useRouter } from 'next/navigation'
import { useGetProductsQuery } from '@/store/api'
import { BookDetails } from '@/lib/types/type'

 
const page = () => {

    const [currentPage, setCurrentPage] = useState(1)
    const [selectedCondition, setSelectedCondition] = useState<string[]>([])
    const [selectedType, setSelectedType] = useState<string[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string[]>([])
    const [sortOption, setSortOption] = useState("newest")
    const [isLoding, setIsLoading] = useState(false)
    const [books, setBooks] = useState<BookDetails[]>([])
    const router = useRouter()
    const {data:apiResponse={}, isLoading} = useGetProductsQuery({})

    useEffect(()=>{
        if(apiResponse.data){
            setBooks(apiResponse.data)
        }
    },[apiResponse])


    const searchTerms = new URLSearchParams(window.location.search).get('search')

    const bookPerPage = 6;

    const toggleFilter =  (section:string, item:string) => {

        const updateFilter = (prev:string[]) => {
            return prev.includes(item) ? prev.filter((i) => i != item) : [...prev, item];
        }
 
        switch(section){
            case "condition":
                setSelectedCondition(updateFilter)
                break;

            case "classType":
                setSelectedType(updateFilter)
                break;

            case "category":
                setSelectedCategory(updateFilter)   
                break;
        }
        setCurrentPage(1)
    }

    const filterBooks = books.filter((book) =>{
        const conditionMatch = selectedCondition.length===0 || selectedCondition.map(cond => cond.toLowerCase().includes(book.condition.toLowerCase()));
        const typeMatch = selectedType.length===0 || selectedType.map(type =>type.toLowerCase().includes(book.classType.toLowerCase()))
        const CategoryMatch = selectedCategory.length===0 || selectedCategory.map(cate => cate.toLowerCase().includes(book.category.toLowerCase()))

        const searchMatch = searchTerms ?  book.title.toLowerCase().includes(searchTerms.toLowerCase())  || book.author.toLowerCase().includes(searchTerms.toLowerCase()) || book.subject.toLowerCase().includes(searchTerms.toLowerCase()) : true

        return conditionMatch && typeMatch && CategoryMatch && searchMatch

    })

    const sortedBooks = [...filterBooks].sort((a,b)=>{

        switch(sortOption){
            case "newest" :
            return (new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime());
            case "oldest" :
            return (new Date(a.createdAt).getTime()-new Date(b.createdAt).getTime());
            case "price-low" :
            return (a.finalPrice - b.finalPrice);
            case "price-high" :
            return (b.finalPrice - a.finalPrice);
        }

        return 0
    }
    )

    const totalPage = Math.ceil(sortedBooks.length/bookPerPage);

    const paginatedBooks = sortedBooks.slice((currentPage-1) * bookPerPage, currentPage * bookPerPage);

    const handlePageChange = (page:number) => {
        setCurrentPage(page)
    }

     const calculateDiscount = (price: number, finalPrice: number) => {
    return price > finalPrice && price > 0 ? Math.round(((price - finalPrice) / price) * 100) : 0;
  };

  const formatDates = (dateString:Date) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, {addSuffix:true})
  }
    

  return (
    <div className='min-h-screen bg-gray-100'>
        <div className='container mx-auto px-4 py-8'>
            <nav className='mb-8 flex item-center gap-2 text-sm text-muted-foreground'>
                <Link href='/' className="text-primary hover:underline">Home</Link>
                <span>/</span>
                <span>Books</span>
            </nav>
            <h1 className='mb-8 text-3xl font-bold'>Find from 1000s of books online</h1>
            <div className='grid gap-8 md:grid-cols-[280px_1fr]'>
                <div className='space-y-6'>
                    <Accordion type='multiple'
                    className='bg-white p-6 border rounded-lg'>

   {Object.entries(filters).map(([key, values]) => (
         <AccordionItem key={key} value={key}>
            <AccordionTrigger className='text-lg font-semibold text-blue-500'>
                {key.charAt(0).toUpperCase() + key.slice(1)}
            </AccordionTrigger>
          <AccordionContent className='mt-2 space-y-2'>
                {values.map((value)=>(
                    <div key={value} className='flex items-center space-x-2'>
                        <Checkbox id={value} 
                        checked = {key === "condition" ? selectedCondition.includes(value) :  key === "classType" ? selectedType.includes(value) : selectedCategory.includes(value)}
                        onCheckedChange={()=>toggleFilter(key,value)}
                     />
                     <label htmlFor='value' className='text-sm font-medium leading-none'>{value}</label>
                    </div>
                ))} 
             </AccordionContent>
             </AccordionItem>
           ))}

                    </Accordion>
                </div>
                <div className='space-y-6'>
                    {isLoding ? (<><BookLoader/></>):(paginatedBooks.length ? (
                        <>
                        <div className='flex justify-between'>
                            <div className='mb-8 text-xl font-semibold'>
                                Buy second Hand books in India
                            </div>
                            <Select value={sortOption} onValueChange={setSortOption}>
                                <SelectTrigger className='w-[180px]'>
                                    <SelectValue placeholder="Sort by"></SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='newest'>Newest First</SelectItem>
                                    <SelectItem value='oldest'>oldest First</SelectItem>
                                    <SelectItem value='price-low'>price: Low to High</SelectItem>
                                    <SelectItem value='price-high'>price: high to Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                            {paginatedBooks.map((book) => (
                                <motion.div
                                key={book._id}
                                initial={{opacity:0, y:10}}
                                animate={{opacity:1, y:0}}
                                exit={{opacity:0, y:-10}}
                                transition={{duration:0.3}}
                                >
                                    <Card className='group relative overflow-hidden rounded-lg transition-shadow duration-300 hover:shadow-2xl bg-white border-0'>
                                        <CardContent className='p-0'>
                                            <Link href={`/books/${book._id}`}>
                                                <div className='relative'>
                                                    <Image src={book.images[0]} alt={book.title} height={300}  width={300} className='h-[250px] w-full object-cover transition-transform duration-300 group-hover:scale-105'/>
                                                    <div className='absolute left-0 top-0 z-10 flex-col gap-2 p-2'>
                                                        {calculateDiscount(book.price, book.finalPrice) > 0 &&  (
                                                            <Badge className='bg-orange-600/90 text-white hover:bg-orange-700'>
                                                                {calculateDiscount(book.price, book.finalPrice)}% Off
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <Button size='icon' variant="ghost" className='absolute top-2 right-2 h-8 w-8 bg-white/80 backdrop-blur-sm transition-opacity hover:bg-white group-hover:opacity-100 rounded-full '>
                                                        <Heart className='h-4 w-4 text-red-500' />
                                                    </Button>
                                                </div> 
                                                <div className='p-4 space-y-2 flex flex-col items-start justify-between'>
                                                    <h3 className='text-lg text-orange-500 line-clamp-2 font-semibold'>{book.title}</h3>
                                                     <p className='text-sm text-zinc-400'>
                                                        {book.author}
                                                    </p>
                                                   <div className='flex items-baseline gap-2'>
                                    <span className='text-2xl text-black font-bold'>₹{book.finalPrice}</span>
                                    {book.price && (
                                      <span className='text-sm  text-zinc-500text-muted-foreground line-through'>₹{book.price}</span>
                                    )}
                                  </div>

                                        <div className='flex justify-between w-full text-center text-xs text-zinc-400'>
                                            <span>{formatDates(book.createdAt)}</span>
                                            <span>{book.condition}</span>
                                        </div>  
                                                </div>
                                               
                                            </Link>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPage={totalPage}
                            onPageChange={handlePageChange}
                        />
                        </>
                    ):(<>


<NoData
      imageUrl="/images/no-book.jpg"
      message="No books available please try later."
      description="Try adjusting your filters or search criteria to find what you're looking for."
      onClick={() => router.push("/book-sell")}
      buttonText="Shell Your First Book"
    />



                    </>))}
                </div>
            </div>
        </div>
    </div>
  )
}

export default page
