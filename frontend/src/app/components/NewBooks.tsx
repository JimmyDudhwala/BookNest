import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BookDetails } from '@/lib/types/type';
import { useGetProductsQuery } from '@/store/api';

const NewBooks = () => {
    const [books, setBooks] = useState<BookDetails[]>([])
      const {data:apiResponse={}} = useGetProductsQuery({})
  
      useEffect(()=>{
          if(apiResponse.data){
              setBooks(apiResponse.data)
          }
      },[apiResponse])
  
  const [currentBookSlide, setCurrentBookSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBookSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentBookSlide((prev) => (prev - 1 + 3) % 3);
  };

  const nextSlide = () => {
    setCurrentBookSlide((prev) => (prev + 1) % 3);
  };

  const calculateDiscount = (price: number, finalPrice: number) => {
    return price > finalPrice && price > 0 ? Math.round(((price - finalPrice) / price) * 100) : 0;
  };

  return (
    <section className='py-16 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <h2 className='text-3xl font-bold text-center mb-12'>Newly Added Books</h2>
        <div className='relative'>
          {books.length > 0 ? (
            <>
              <div className='overflow-hidden'>
               <div className="flex transition-transform ease-in-out duration-500"
               style={{ transform: `translateX(-${currentBookSlide * 100}%)` }}>

                  {[0, 1, 2].map((slideIndex) => (
                    <div className='flex-none w-full' key={slideIndex}>
                      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        {books.slice(slideIndex * 3, slideIndex * 3 + 3).map((book) => (
                          <Card key={book._id} className='relative'>
                            <CardContent className='p-4'>
                              <Link href={`books/${book._id}`}>
                                <div className='relative'>
                                  <Image
                                    src={book.images[0]}
                                    alt={book.title}
                                    height={300}
                                    width={200}
                                    className='mb-200px h-[200px] w-full object-cover rounded-md'
                                  />
                                  {calculateDiscount(book.price, book.finalPrice) > 0 && (
                                    <span className='absolute left-0 top-2 rounded-r-lg bg-red-500 px-2 py-1 text-xs font-medium text-white'>
                                      {calculateDiscount(book.price, book.finalPrice)}% Off
                                    </span>
                                  )}
                                </div>
                                <h3 className='mb-2 line-clamp-2 text-sm font-medium'>{book.title}</h3>
                                <div className='flex items-center justify-between'>
                                  <div className='flex items-baseline gap-2'>
                                    <span className='text-lg font-bold'>₹{book.finalPrice}</span>
                                    {book.price && (
                                      <span className='text-sm text-muted-foreground line-through'>₹{book.price}</span>
                                    )}
                                  </div>
                                  <div className='flex justify-center items-center text-xs text-zin-400'>{book.condition}</div>
                                  <div className='pt-4'>
                                    <Button className='flex float-end mb-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:to-orange-400 hover:from-orange-500'>
                                      Buy Now
                                    </Button>
                                  </div>
                                </div>
                              </Link>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scroll Buttons */}
              <Button
                className='absolute hover:text-white text-black left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md'
                onClick={prevSlide}
              >
                <ChevronLeft className='h-6 w-6' />
              </Button>
              <Button
                className='absolute hover:text-white text-black right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md'
                onClick={nextSlide}
              >
                <ChevronRight className='h-6 w-6' />
              </Button>

              {/* pagination */}
              <div className='mt-8 flex justify-center items-center space-x-2'>
                {[0,1,2].map((dot)=>(
                  <div
                  key={dot}
                  onClick={()=>setCurrentBookSlide(dot)}
                  className={`p-2 rounded-full  ${currentBookSlide === dot ? "bg-blue-600" : "bg-gray-300"}`}></div>
                ))}
              </div>
            </>
          ):(
            <p className='text-center text-gray-500'>No Books to display</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewBooks;
