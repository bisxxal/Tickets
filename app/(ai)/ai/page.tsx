import Ai from '@/components/orginalcom/AiPage'
import AiSecond from '@/components/orginalcom/AiSecond';
import Header from '@/components/orginalcom/Header';
import { getAllCategories  } from '@/lib/actions/category.actions'
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: "Book by Ai",
  description: "Generated by create next app",
};
async function AiPage() {
    // const Categories = await getAllCategories()
    // const location = await getAllLocation()
  
    return (
    <main className=' min-h-screen overflow-hidden'>
      <Header /> 
        {/* <Ai  />  */}
        <AiSecond />
    </main>
  )
}

export default AiPage
 